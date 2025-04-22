import crypto, { hash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
const identifierHashSecret = process.env.IDENTIFIER_HASH_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const ONE_WEEK_IN_SECONDS = 604800;

if (
	!googleClientId ||
	!googleClientSecret ||
	!googleRedirectUri ||
	!identifierHashSecret ||
	!supabaseUrl ||
	!supabaseServiceKey
) {
	console.error(
		"Missing required environment variables for Google Callback.",
	);
	throw new Error(
		"Server configuration error impacting Google Authentication callback.",
	);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const oauth2Client = new OAuth2Client(
	googleClientId,
	googleClientSecret,
	googleRedirectUri,
);

const hashIdentifier = (id: string): string => {
	return (
		crypto
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			.createHmac("sha256", identifierHashSecret!)
			.update(id)
			.digest("hex")
	);
};

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");
	const error = searchParams.get("error");
	const cookieStore = await cookies();

	const errorRedirectUrl = `${appUrl}/waitlist/denied?reason=google_error&details=${encodeURIComponent(error || "Unknown Google Error")}`;
	const forbiddenRedirectUrl = `${appUrl}/waitlist/denied?reason=domain_mismatch`;
	const genericRedirectUrl = `${appUrl}/waitlist/denied?reason=internal_error`;
	const successRedirectUrl = `${appUrl}`;

	if (error) {
		console.error("Google oauth error: ", error);
		return NextResponse.redirect(errorRedirectUrl);
	}

	if (!code) {
		console.error("Missing authorization code from google redirect.");
		return NextResponse.redirect(
			`${appUrl}/waitlist/denied?reason=missing_code`,
		);
	}

	try {
		console.log("Exchanging the authorization code for access token...");
		const { tokens } = await oauth2Client.getToken(code);
		console.log("Tokens received");

		const idToken = tokens.id_token;

		if (!idToken) {
			console.error("Missing id token in google's token response.");
			return NextResponse.redirect(genericRedirectUrl);
		}

		console.log("verifying id token");
		const ticket = await oauth2Client.verifyIdToken({
			idToken: idToken,
			audience: googleClientId,
		});

		console.log("Id token verified");

		const payload = ticket.getPayload();

		if (!payload) {
			console.log("could not get payload from verified id token");
			return NextResponse.redirect(genericRedirectUrl);
		}

		const googleId = payload.sub;
		const email = payload.email;
		const emailVerified = payload.email_verified;

		if (!email || !emailVerified) {
			console.warn("User denied as email missing or not verified.");
			return NextResponse.redirect(
				`${appUrl}/waitlist/denied?reason=email_unverified`,
			);
		}

		if (!email.endsWith("@kkwagh.edu.in")) {
			console.warn("User denied: Email domain mismatch");
			return NextResponse.redirect(forbiddenRedirectUrl);
		}

		const hashedGoogleId = hashIdentifier(googleId);
		console.log(`Hashed google id: ${hashedGoogleId}`);

		console.log("Checking if user exists in the db");
		const { data: existingUser, error: selectError } = await supabaseAdmin
			.from("waitlist_users")
			.select("hashed_google_id")
			.eq("hashed_google_id", hashedGoogleId)
			.maybeSingle();

		if (selectError) {
			console.error("supabase select error");
			return NextResponse.redirect(genericRedirectUrl);
		}

		if (existingUser) {
			console.log(
				`User ${hashedGoogleId} already exist in waitlist. Redirecting to success message.`,
			);
			cookieStore.set({
				name: "waitlisted",
				value: "yes",
				httpOnly: true,
				path: "/",
				maxAge: ONE_WEEK_IN_SECONDS,
			});
			return NextResponse.redirect(successRedirectUrl);
		}

		console.log(`New user ${hashedGoogleId}. Inserting into the db.`);
		const { error: insertError } = await supabaseAdmin
			.from("waitlist_users")
			.insert({ hashed_google_id: hashedGoogleId });

		if (insertError) {
			console.error("Supabase insert error: ", insertError);
			return NextResponse.redirect(genericRedirectUrl);
		}

		console.log(
			`Successfully added user ${hashedGoogleId} to the waitlist.`,
		);
		cookieStore.set({
			name: "waitlisted",
			value: "yes",
			httpOnly: true,
			path: "/",
			maxAge: ONE_WEEK_IN_SECONDS,
		});
		return NextResponse.redirect(successRedirectUrl);
	} catch (error: unknown) {
		console.error(
			`Error during google oauth callback processing: ${error}`,
		);
		return NextResponse.redirect(genericRedirectUrl);
	}
}
