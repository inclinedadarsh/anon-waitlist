// import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
// app/api/waitlist/route.ts
import { NextResponse } from "next/server";
// import { Resend } from "resend";
// import { z } from "zod";

// --- Environment Variable Check ---
// (Keep the existing checks)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const resendApiKey = process.env.RESEND_API_KEY;
// const resendFromEmail = process.env.RESEND_FROM_EMAIL;
// const emailHashSecret = process.env.EMAIL_HASH_SECRET;

if (
	!supabaseUrl ||
	!supabaseServiceKey
	// !resendApiKey ||
	// !emailHashSecret ||
	// !resendFromEmail
) {
	console.error("Missing required environment variables for API route.");
	// Avoid exposing specifics in production, ensure build fails or logs detailed error
	throw new Error("Server configuration error impacting /api/waitlist.");
}

// --- Initialize Clients ---
// (Reuse existing clients)
const supabase = createClient(supabaseUrl, supabaseServiceKey);
// const resend = new Resend(resendApiKey); // Keep for POST

// --- Schemas and Helper Functions ---
// (Keep existing WaitlistSchema, generateUniqueCode, hashEmail)

// const WaitlistSchema = z.object({
// 	// Keep for POST
// 	email: z
// 		.string()
// 		.email("Invalid email format.")
// 		.refine(email => email.endsWith("@kkwagh.edu.in"), {
// 			message: "Email must end with @kkwagh.edu.in",
// 		}),
// });

// async function generateUniqueCode(): Promise<string> {
// 	// Keep for POST
// 	const prefix = "anon_";
// 	const randomPartLength = 5;
// 	const chars =
// 		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// 	let attempts = 0;
// 	const maxAttempts = 10;

// 	while (attempts < maxAttempts) {
// 		let randomPart = "";
// 		for (let i = 0; i < randomPartLength; i++) {
// 			randomPart += chars.charAt(
// 				Math.floor(Math.random() * chars.length),
// 			);
// 		}
// 		const fullCode = prefix + randomPart;

// 		const { data: existingCode, error } = await supabase
// 			.from("waitlist_codes")
// 			.select("code")
// 			.eq("code", fullCode)
// 			.maybeSingle();

// 		if (error) {
// 			console.error("Supabase error checking code uniqueness:", error);
// 			throw new Error(
// 				`Database error checking code uniqueness for ${fullCode}.`,
// 			);
// 		}
// 		if (!existingCode) return fullCode;
// 		attempts++;
// 		console.log(
// 			`Code ${fullCode} exists, retrying... (Attempt ${attempts})`,
// 		);
// 	}
// 	console.error(
// 		`Failed to generate a unique code starting with '${prefix}' after ${maxAttempts} attempts.`,
// 	);
// 	throw new Error("Could not generate a unique waitlist code.");
// }

// function hashEmail(email: string): string {
// 	// Keep for POST
// 	return (
// 		crypto
// 			// biome-ignore lint/style/noNonNullAssertion: <explanation>
// 			.createHmac("sha256", emailHashSecret!)
// 			.update(email.toLowerCase())
// 			.digest("hex")
// 	);
// }

// --- API Route Handler (GET) ---
export async function GET(request: Request) {
	try {
		// Fetch all entries, selecting both 'hashed_email' and 'created_at' columns
		const { data: waitlistEntries, error } = await supabase
			.from("waitlist_users")
			.select("hashed_google_id, created_at") // Add created_at to selection
			.order("created_at", { ascending: false }); // Optional: order by newest first

		if (error) {
			console.error("Supabase error fetching waitlist users:", error);
			return NextResponse.json(
				{ message: "Database error fetching waitlist." },
				{ status: 500 },
			);
		}

		// Return the array of objects containing hashed emails and timestamps
		// e.g., [{ hashed_email: '...', created_at: '2025-04-14T...' }, ...]
		return NextResponse.json(waitlistEntries, { status: 200 });
	} catch (error: unknown) {
		console.error("Unhandled error in GET /api/waitlist:", error);
		return NextResponse.json(
			{ message: "An internal server error occurred." },
			{ status: 500 },
		);
	}
}

// --- API Route Handler (POST) ---
// (Keep the existing POST function exactly as it was)
// export async function POST(request: Request) {
// 	try {
// 		// 1. Parse and Validate Input
// 		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
// 		let rawBody;
// 		try {
// 			rawBody = await request.json();
// 		} catch (error) {
// 			return NextResponse.json(
// 				{ message: "Invalid JSON body" },
// 				{ status: 400 },
// 			);
// 		}
// 		const validationResult = WaitlistSchema.safeParse(rawBody);

// 		if (!validationResult.success) {
// 			const errorMessages = validationResult.error.errors
// 				.map(e => e.message)
// 				.join(", ");
// 			return NextResponse.json(
// 				{ message: `Validation failed: ${errorMessages}` },
// 				{ status: 400 },
// 			);
// 		}
// 		const { email } = validationResult.data;
// 		const normalizedEmail = email.toLowerCase();

// 		// 2. Hash Email
// 		const hashedEmail = hashEmail(normalizedEmail);

// 		// 3. Check if Hashed Email Already Exists
// 		const { data: existingUser, error: userCheckError } = await supabase
// 			.from("waitlist_users")
// 			.select("hashed_email")
// 			.eq("hashed_email", hashedEmail)
// 			.maybeSingle();

// 		if (userCheckError) {
// 			console.error("Supabase error checking user:", userCheckError);
// 			return NextResponse.json(
// 				{ message: "Database error checking user." },
// 				{ status: 500 },
// 			);
// 		}

// 		if (existingUser) {
// 			return NextResponse.json(
// 				{ message: "This email is already on the waitlist." },
// 				{ status: 409 },
// 			);
// 		}

// 		// 4. Generate Unique Code
// 		let uniqueCode: string;
// 		try {
// 			uniqueCode = await generateUniqueCode();
// 			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 		} catch (error: any) {
// 			console.error("Code generation failed:", error);
// 			const errorMessage = error.message.includes("Database error")
// 				? "Database error during code generation."
// 				: "Could not generate a unique code. Please try again later.";
// 			return NextResponse.json(
// 				{ message: errorMessage },
// 				{ status: 500 },
// 			);
// 		}

// 		// // 5. Send Email
// 		// try {
// 		// 	const { data, error: emailError } = await resend.emails.send({
// 		// 		// biome-ignore lint/style/noNonNullAssertion: <explanation>
// 		// 		from: resendFromEmail!,
// 		// 		to: normalizedEmail,
// 		// 		subject: "Your Waitlist Code",
// 		// 		html: `<p>Thank you for joining the waitlist!</p><p>Your unique code is: <strong>${uniqueCode}</strong></p><p>Keep this code safe.</p>`,
// 		// 	});
// 		// 	if (emailError) {
// 		// 		console.error("Resend email sending error:", emailError);
// 		// 		return NextResponse.json(
// 		// 			{ message: "Failed to send confirmation email." },
// 		// 			{ status: 500 },
// 		// 		);
// 		// 	}
// 		// 	console.log("Email sent successfully:", data);
// 		// } catch (error) {
// 		// 	console.error("Error during Resend API call:", error);
// 		// 	return NextResponse.json(
// 		// 		{
// 		// 			message:
// 		// 				"Failed to send confirmation email due to a server error.",
// 		// 		},
// 		// 		{ status: 500 },
// 		// 	);
// 		// }

// 		// --- Database Insertions ---
// 		// 6. Store Hashed Email
// 		const { error: userInsertError } = await supabase
// 			.from("waitlist_users")
// 			.insert({ hashed_email: hashedEmail });
// 		if (userInsertError) {
// 			console.error("Supabase error inserting user:", userInsertError);
// 			if (userInsertError.code === "23505") {
// 				return NextResponse.json(
// 					{
// 						message:
// 							"This email was just added. Please check your inbox.",
// 					},
// 					{ status: 409 },
// 				);
// 			}
// 			return NextResponse.json(
// 				{ message: "Database error saving user." },
// 				{ status: 500 },
// 			);
// 		}

// 		// 7. Store Code
// 		const { error: codeInsertError } = await supabase
// 			.from("waitlist_codes")
// 			.insert({ code: uniqueCode });
// 		if (codeInsertError) {
// 			console.error("Supabase error inserting code:", codeInsertError);
// 			return NextResponse.json(
// 				{
// 					message:
// 						"Database error saving unique code marker. Please contact support.",
// 				},
// 				{ status: 500 },
// 			);
// 		}

// 		// 8. Return Success
// 		return NextResponse.json(
// 			{
// 				message:
// 					"Successfully added to waitlist. Check your email for your unique code!",
// 			},
// 			{ status: 201 },
// 		);
// 	} catch (error: unknown) {
// 		console.error("Unhandled error in POST /api/waitlist:", error);
// 		return NextResponse.json(
// 			{ message: "An internal server error occurred." },
// 			{ status: 500 },
// 		);
// 	}
// }
