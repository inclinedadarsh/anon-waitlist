"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ViewContainer } from "@/components/ui/view-container";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Define the email schema with Zod
const emailSchema = z
	.string()
	.email("Invalid email format")
	.refine(email => email.endsWith("@kkwagh.edu.in"), {
		message: "Only K. K. Wagh email addresses are allowed",
	});

type HashedEmail = {
	hashed_email: string;
};

export default function Home() {
	const [email, setEmail] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hashedEmails, setHashedEmails] = useState<HashedEmail[]>([]);
	const [isEmailsLoading, setIsEmailsLoading] = useState<boolean>(true);

	const fetchHashedEmails = async () => {
		setIsEmailsLoading(true);
		try {
			const response = await fetch("/api/waitlist");
			if (!response.ok) {
				throw new Error("Failed to fetch registered emails");
			}
			const data = await response.json();
			setHashedEmails(data);
		} catch (error) {
			console.error("Error fetching hashed emails:", error);
			toast.error(
				"Failed to load registered emails. Please refresh the page.",
			);
		} finally {
			setIsEmailsLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchHashedEmails();
	}, []); // Add empty dependency array to run only once on mount

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.warning("Please enter your email address");
			return;
		}

		// Validate email with Zod
		const emailValidation = emailSchema.safeParse(email);
		if (!emailValidation.success) {
			toast.warning(emailValidation.error.errors[0].message);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/waitlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				toast(data.message || "Successfully joined the waitlist!");
				setEmail("");
				// Refresh the hashed emails list after successful registration
				fetchHashedEmails();
			} else {
				toast.error(
					data.message ||
						"Failed to join the waitlist. Please try again.",
				);
			}
		} catch (error) {
			console.error("Error submitting email:", error);
			toast.error(
				"An error occurred while submitting your email. Please try again later.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="pt-10 md:pt-20">
			<ViewContainer className="max-w-[800px]">
				<h1 className="font-bold text-3xl md:text-5xl tracking-tight">
					Waitlist&nbsp;&nbsp;{"//"}&nbsp;&nbsp;Anon
				</h1>
				<div className="mt-10 space-y-4">
					<p className="">
						Ever wanted a place to just{" "}
						<span className="italic">say things</span> without
						overthinking? We're building an{" "}
						<span className="font-semibold">anonymous</span> space
						just for K. K. Wagh students to talk about college,
						life, or just vibe with random folks from your campus.
						It's like a chill gated community, but totally anon.
					</p>
					<p className="">
						We're launching soon. Hop on the waitlist and be part of
						it from day one.
					</p>
				</div>
				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<p className="">
						We know you have so many questions, starting from "
						<span className="font-medium italic">
							How is it anonymous if you're taking my email in the
							first place?!
						</span>
						". There are many more questions, and we have answered
						all of them on the{" "}
						<Link
							href="/answers"
							className="underline hover:no-underline font-medium"
						>
							answers page
						</Link>
						.
					</p>
				</div>
				<form
					onSubmit={handleSubmit}
					className="mt-6 pt-6 border-t-2 border-border border-dashed space-y-4"
				>
					<Label
						htmlFor="email"
						className="text-lg font-semibold block"
					>
						Your college email address
					</Label>
					<Input
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="ajdubey371122@kkwagh.edu.in"
						className="max-w-[500px]"
						id="email"
						type="email"
						disabled={isLoading}
					/>
					<Button
						type="submit"
						className="hover:cursor-pointer"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing up...
							</>
						) : (
							<>
								Sign up <ArrowRight className="ml-2" />
							</>
						)}
					</Button>
				</form>
				<div className="mt-6 pt-6 border-t-2 border-border border-dashed space-y-4">
					<h2
						className="text-lg font-semibold block"
						id="registered-emails"
					>
						{isEmailsLoading
							? "Here are all the people who have registered!"
							: `${hashedEmails.length} user${hashedEmails.length !== 1 ? "s" : ""} have registered till now!`}
					</h2>
					<p className="">
						These are all the people who have registered for the
						waitlist. As mentioned on our{" "}
						<Link
							href="/answers"
							className="font-medium underline hover:no-underline"
						>
							answers page
						</Link>
						, all the emails we store are hashed, so this is the
						exactly how they look like in our database.
					</p>

					<div className="mt-4">
						{isEmailsLoading ? (
							<div className="flex items-center space-x-3 py-4">
								<Loader2 className="h-5 w-5 animate-spin" />
								<span>Loading registered emails...</span>
							</div>
						) : hashedEmails.length > 0 ? (
							<div className="bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto text-sm font-mono">
								{hashedEmails.map((item, index) => (
									<div
										key={item.hashed_email}
										className="pb-1.5"
									>
										{item.hashed_email}
									</div>
								))}
							</div>
						) : (
							<p className="py-2 italic">
								No registrations yet. Be the first one!
							</p>
						)}
					</div>
				</div>
				<div className="mt-6 py-6 border-t-2 border-border border-dashed space-y-4">
					By{" "}
					<Link
						href="https://linkedin.com/in/dubeyadarsh"
						className="font-medium underline hover:no-underline"
					>
						Adarsh
					</Link>{" "}
					&{" "}
					<Link
						href="https://www.linkedin.com/in/adityab29/"
						className="font-medium underline hover:no-underline"
					>
						Aditya
					</Link>
					.
				</div>
			</ViewContainer>
		</main>
	);
}
