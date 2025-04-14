"use client";

import { ViewContainer } from "@/components/ui/view-container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnswersPage() {
	return (
		<main className="pt-10 md:pt-20">
			<ViewContainer className="max-w-[800px]">
				<h1 className="font-bold text-3xl md:text-5xl tracking-tight">
					Answers&nbsp;&nbsp;{"//"}&nbsp;&nbsp;Anon
				</h1>

				<div className="mt-6 mb-10">
					<Link
						href="/"
						className="text-sm md:text-base underline hover:no-underline flex gap-2 items-center"
					>
						<ArrowLeft size={18} /> Back to waitlist page
					</Link>
				</div>

				<div className="mt-4 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						How is it anonymous if you're taking my email?
					</h2>
					<p className="">
						Great question! We use your email only for verification
						that you're a student at K. K. Wagh. Once verified, your
						email is hashed and stored securely. When you post
						content, it's never linked to your email or any
						identifying information.
					</p>
					<p>
						Everything we build is open source - including{" "}
						<Link
							href="https://github.com/inclinedadarsh/anon-waitlist"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:no-underline"
						>
							this waitlist site
						</Link>{" "}
						and the{" "}
						<Link
							href="https://github.com/inclinedadarsh/anon"
							className="underline hover:no-underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							platform we're building
						</Link>
						. This means anyone can verify our privacy claims by
						reviewing the code.
					</p>
					<p>
						Our database architecture is specifically designed so
						that even we (with full database access) can't tell who
						posted what! User verification and content posting use
						completely separate systems with no connecting
						identifiers.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						What kind of content is allowed?
					</h2>
					<p className="">
						While anonymity provides freedom, it comes with
						responsibility. We don't allow hate speech, harassment,
						explicit content, doxxing, or anything illegal. We want
						a supportive community where you can express yourself
						without hurting others.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						How do you moderate the platform?
					</h2>
					<p className="">
						For the time being, we'll be doing manual moderation
						directly from the database level. While this isn't the
						most scalable approach, it allows us to maintain a high
						quality standard during the early stages. The moderation
						system is designed so that we can remove problematic
						content without ever knowing who posted it.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						How do I get updates if you don't have my email?
					</h2>
					<p className="">
						We've created a{" "}
						<Link
							href="https://whatsapp.com/channel/0029Vb5yTvmL2ATyLrdn8H1h"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:no-underline"
						>
							WhatsApp Channel
						</Link>{" "}
						for all updates! Since we're using WhatsApp's "Channels"
						feature (not groups), we won't know who has joined - so
						your anonymity remains protected. Join the channel to
						get notified when we launch and for all future updates.
					</p>
					<p>
						We'll also post updates on our GitHub repositories,
						which you can star or watch to stay informed.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						When will the platform launch?
					</h2>
					<p className="">
						We're aiming to launch in the coming weeks! Join our
						WhatsApp Channel to be the first to know. Early joiners
						might even get special access or features.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						How do I know my data is secure?
					</h2>
					<p className="">
						We take security seriously. Your email is hashed using
						industry-standard techniques, and we never store
						plaintext emails. We don't collect any other personal
						information, and all posts are completely detached from
						user identities.
					</p>
				</div>

				<div className="mt-6 py-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						I have some security concerns. How can I reach you?
					</h2>
					<p className="">
						We're always open to questions about security or
						privacy. Feel free to email us at
						<span className="px-1">
							<Link
								href="mailto:dubeyadarshmain@gmail.com"
								className="underline hover:no-underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								dubeyadarshmain@gmail.com
							</Link>
						</span>
						or
						<span className="px-1">
							<Link
								href="mailto:"
								className="underline hover:no-underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								__________
							</Link>
						</span>
						and we'll be happy to address any concerns you might
						have. Security is our top priority, and we appreciate
						your input to make the platform even safer.
					</p>
				</div>
			</ViewContainer>
		</main>
	);
}
