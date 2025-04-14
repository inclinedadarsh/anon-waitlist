"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ViewContainer } from "@/components/ui/view-container";
// import { Label } from "@radix-ui/react-label";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	const [email, setEmail] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			alert("Please enter your email address");
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
				alert(data.message || "Successfully joined the waitlist!");
				setEmail("");
			} else {
				alert(
					data.message ||
						"Failed to join the waitlist. Please try again.",
				);
			}
		} catch (error) {
			console.error("Error submitting email:", error);
			alert(
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
						overthinking? We’re building an{" "}
						<span className="font-semibold">anonymous</span> space
						just for K. K. Wagh students to talk about college,
						life, or just vibe with random folks from your campus.
						It’s like a chill gated community, but totally anon.
					</p>
					<p className="">
						We’re launching soon. Hop on the waitlist and be part of
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
							href="/answes"
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
						Here are all the people who have registered!
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
