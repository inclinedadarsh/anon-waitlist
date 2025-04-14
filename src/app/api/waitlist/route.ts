import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
// app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// --- Environment Variable Check ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const emailHashSecret = process.env.EMAIL_HASH_SECRET;

if (
	!supabaseUrl ||
	!supabaseServiceKey ||
	!resendApiKey ||
	!emailHashSecret ||
	!resendFromEmail
) {
	console.error("Missing required environment variables");
	throw new Error("Server configuration error.");
}

// --- Initialize Clients ---
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

// --- Input Validation Schema ---
const WaitlistSchema = z.object({
	email: z
		.string()
		.email("Invalid email format.")
		.refine(email => email.endsWith("@kkwagh.edu.in"), {
			message: "Email must end with @kkwagh.edu.in",
		}),
});

// --- Helper Functions ---

/**
 * Generates a unique 10-character alphanumeric code starting with "anon_".
 * The last 5 characters are random alphanumeric.
 * Checks against the Supabase 'waitlist_codes' table to ensure uniqueness.
 * @returns {Promise<string>} A unique code (e.g., "anon_aB1cD").
 * @throws {Error} If unable to generate a unique code after several attempts.
 */
async function generateUniqueCode(): Promise<string> {
	const prefix = "anon_";
	const prefixLength = prefix.length; // 5
	const randomPartLength = 5; // Need 5 random chars for a total of 10
	const totalLength = prefixLength + randomPartLength; // 10

	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let attempts = 0;
	const maxAttempts = 10; // Safety break

	while (attempts < maxAttempts) {
		let randomPart = "";
		for (let i = 0; i < randomPartLength; i++) {
			randomPart += chars.charAt(
				Math.floor(Math.random() * chars.length),
			);
		}

		// Combine prefix and random part
		const fullCode = prefix + randomPart; // e.g., "anon_aB1cD"

		// Check if the full 10-character code exists in Supabase
		const { data: existingCode, error } = await supabase
			.from("waitlist_codes")
			.select("code")
			.eq("code", fullCode) // Check the full code for uniqueness
			.maybeSingle();

		if (error) {
			console.error("Supabase error checking code uniqueness:", error);
			// Append which code failed check for better debugging
			throw new Error(
				`Database error checking code uniqueness for ${fullCode}.`,
			);
		}

		if (!existingCode) {
			// Code is unique
			return fullCode;
		}

		// Code exists, try again
		attempts++;
		// Log the full code that already exists
		console.log(
			`Code ${fullCode} exists, retrying... (Attempt ${attempts})`,
		);
	}

	// If we reach here, we failed to generate a unique code
	console.error(
		`Failed to generate a unique code starting with '${prefix}' after ${maxAttempts} attempts.`,
	);
	throw new Error("Could not generate a unique waitlist code.");
}

/**
 * Hashes an email using HMAC-SHA256.
 * @param email The email address to hash.
 * @returns The hashed email as a hex string.
 */
function hashEmail(email: string): string {
	return (
		crypto
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			.createHmac("sha256", emailHashSecret!)
			.update(email.toLowerCase())
			.digest("hex")
	);
}

// --- API Route Handler (POST) ---
export async function POST(request: Request) {
	try {
		// 1. Parse and Validate Input
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let rawBody;
		try {
			rawBody = await request.json();
		} catch (error) {
			return NextResponse.json(
				{ message: "Invalid JSON body" },
				{ status: 400 },
			);
		}
		const validationResult = WaitlistSchema.safeParse(rawBody);

		if (!validationResult.success) {
			const errorMessages = validationResult.error.errors
				.map(e => e.message)
				.join(", ");
			return NextResponse.json(
				{ message: `Validation failed: ${errorMessages}` },
				{ status: 400 },
			);
		}
		const { email } = validationResult.data;
		const normalizedEmail = email.toLowerCase();

		// 2. Hash Email
		const hashedEmail = hashEmail(normalizedEmail);

		// 3. Check if Hashed Email Already Exists in 'waitlist_users'
		const { data: existingUser, error: userCheckError } = await supabase
			.from("waitlist_users")
			.select("hashed_email")
			.eq("hashed_email", hashedEmail)
			.maybeSingle();

		if (userCheckError) {
			console.error("Supabase error checking user:", userCheckError);
			return NextResponse.json(
				{ message: "Database error checking user." },
				{ status: 500 },
			);
		}

		if (existingUser) {
			return NextResponse.json(
				{ message: "This email is already on the waitlist." },
				{ status: 409 },
			);
		}

		// 4. Generate Unique Code
		let uniqueCode: string;
		try {
			uniqueCode = await generateUniqueCode();
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			console.error("Code generation failed:", error);
			const errorMessage = error.message.includes("Database error")
				? "Database error during code generation."
				: "Could not generate a unique code. Please try again later.";
			return NextResponse.json(
				{ message: errorMessage },
				{ status: 500 },
			);
		}

		// 5. Send Email with Code using Resend
		try {
			const { data, error: emailError } = await resend.emails.send({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				from: resendFromEmail!,
				to: normalizedEmail,
				subject: "Your Waitlist Code",
				html: `<p>Thank you for joining the waitlist!</p>
                       <p>Your unique code is: <strong>${uniqueCode}</strong></p>
                       <p>Keep this code safe.</p>`,
			});

			if (emailError) {
				console.error("Resend email sending error:", emailError);
				return NextResponse.json(
					{ message: "Failed to send confirmation email." },
					{ status: 500 },
				);
			}
			console.log("Email sent successfully:", data);
		} catch (error) {
			console.error("Error during Resend API call:", error);
			return NextResponse.json(
				{
					message:
						"Failed to send confirmation email due to a server error.",
				},
				{ status: 500 },
			);
		}

		// --- Database Insertions (AFTER successful email send) ---

		// 6. Store Hashed Email in 'waitlist_users'
		const { error: userInsertError } = await supabase
			.from("waitlist_users")
			.insert({ hashed_email: hashedEmail });

		if (userInsertError) {
			console.error("Supabase error inserting user:", userInsertError);
			if (userInsertError.code === "23505") {
				// Handle race condition
				return NextResponse.json(
					{
						message:
							"This email was just added. Please check your inbox.",
					},
					{ status: 409 },
				);
			}
			return NextResponse.json(
				{ message: "Database error saving user." },
				{ status: 500 },
			);
		}

		// 7. Store Code in 'waitlist_codes' (NO association with user)
		//    MODIFIED: Removed user_hashed_email from the insert object
		const { error: codeInsertError } = await supabase
			.from("waitlist_codes")
			.insert({ code: uniqueCode }); // Only insert the code itself

		if (codeInsertError) {
			console.error("Supabase error inserting code:", codeInsertError);
			// Still critical, as the user was added and email sent.
			// Consider logging this specific state for potential manual checks.
			return NextResponse.json(
				{
					message:
						"Database error saving unique code marker. Please contact support.",
				},
				{ status: 500 },
			);
		}

		// 8. Return Success Response
		return NextResponse.json(
			{
				message:
					"Successfully added to waitlist. Check your email for your unique code!",
			},
			{ status: 201 },
		);
	} catch (error: unknown) {
		console.error("Unhandled error in /api/waitlist:", error);
		let message = "An unexpected server error occurred.";
		if (error instanceof Error) {
			message = error.message;
		}
		return NextResponse.json(
			{ message: "An internal server error occurred." },
			{ status: 500 },
		);
	}
}
