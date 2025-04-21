import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!googleClientId || !googleRedirectUri) {
    console.error(
        "Missing google oauth env variabls (GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI)"
    );
    throw new Error("Server configuration error for google login");
}

const oauth2Client = new OAuth2Client(
    googleClientId,
    undefined,
    googleRedirectUri
);

export async function GET() {
    try {
        const authorizeUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/userinfo.email"],
        });

        console.log("Redirecting to google oauth url: ", authorizeUrl);
        return NextResponse.redirect(authorizeUrl);
    } catch (error) {
        console.log("Error generating google oauth url: ", error);
        return NextResponse.json(
            {message: "failed to initiate google login"},
            {status: 500},
        );
    }
}