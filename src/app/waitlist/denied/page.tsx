"use client";

import { Button } from "@/components/ui/button";
import { ViewContainer } from "@/components/ui/view-container";
import { Frown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function AccessDeniedPage() {
	const searchParams = useSearchParams();
	const reason = searchParams.get("reason");
	const details = searchParams.get("details");

	let title = "Access Denied";
	let message = "An unexpected error occurred. Please try again later.";
	let suggestion = null;

	switch (reason) {
		case "domain_mismatch":
			title = "Account Not Eligible";
			message =
				"Sorry, Anon is exclusively for students of K. K. Wagh Institute. Please login using Google Account associated with @kkwagh.edu.in email address.";
			suggestion =
				"Did you accidentally use your personal Google account?";
			break;
		case "email_unverified":
			title = "Email Not Verified";
			message =
				"Your Google account's email address needs to be verified by Google before you can join the waitlist. Please ensure your Google account email is verified and try again.";
			break;
		case "missing_code":
			title = "Authentication Incomplete";
			message =
				"It looks like the authentication process with Google was interrupted. Please try logging in again.";
			break;
		case "google_error":
			title = "Google Sign-In Error";
			message = `There was an error during the Google sign-in process. ${details ? `Details: ${details}` : "Please try again."}`;
			break;
		default:
			title = "Oops! Something Went Wrong";
			message =
				"We encountered an internal server error while processing your request. Please try again in a few moments.";
			break;
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<main className="pt-10 md:pt-20">
				<ViewContainer className="max-w-[600px] text-center">
					<div className="flex justify-center mb-6">
						<Frown className="w-16 h-16" />
					</div>
					<h1 className="font-bold text-2xl md:text-4xl tracking-tight mb-4">
						{title}
					</h1>
					<p className="text-lg mb-4">{message}</p>
					{suggestion && (
						<p className="text-muted-foreground mb-6">
							{suggestion}
						</p>
					)}
					<Button asChild>
						<Link href="/">Return to Waitlist Page</Link>
					</Button>
				</ViewContainer>
			</main>
		</Suspense>
	);
}
