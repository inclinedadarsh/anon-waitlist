"use client";

import { ViewContainer } from "@/components/ui/view-container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnswersPage() {
	const WAITLIST_REPO_URL = "https://github.com/inclinedadarsh/anon-waitlist";
	const PLATFORM_REPO_URL = "https://github.com/inclinedadarsh/anon";
	const CONTACT_EMAIL_1 = "dubeyadarshmain@gmail.com";
	const CONTACT_EMAIL_2 = "borse.aditya7@gmail.com";

	return (
		<main className="pt-10 md:pt-20">
			<ViewContainer className="max-w-[800px] break-words">
				<h1 className="font-bold text-3xl md:text-5xl tracking-tight">
					Answers  {"//"}  Anon
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
						How is it anonymous if I have to log in with Google?
					</h2>
					<p className="">
						We use Google Login strictly for one purpose:{" "}
						<strong>
							verifying that you are a student at K. K. Wagh
						</strong>{" "}
						by checking if your email address ends with{" "}
						<code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
							@kkwagh.edu.in
						</code>
						.
					</p>
					<p>
						Here's how it works: When you log in for the waitlist,
						we receive your basic Google profile info (including
						email and a unique Google ID called{" "}
						<code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
							sub
						</code>
						). We check the email domain. If it's valid, we{" "}
						<strong>
							hash your unique Google ID (
							<code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
								sub
							</code>
							)
						</strong>{" "}
						using a one-way cryptographic hash function
						(HMAC-SHA256) with a secret key. We store only this hash
						in the waitlist database, along with a timestamp. We{" "}
						<strong>
							do not store or log your email address or your
							actual Google ID
						</strong>{" "}
						on the waitlist.
					</p>
					<p>
						You can see exactly how the waitlist hashing works in
						our open-source code for{" "}
						<Link
							href={WAITLIST_REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:no-underline"
						>
							this waitlist site
						</Link>
						. The code for the{" "}
						<Link
							href={PLATFORM_REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:no-underline"
						>
							main Anon platform
						</Link>{" "}
						is also open-source for full transparency.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						What data does Google share with you?
					</h2>
					<p className="">
						When you use "Login with Google", we only request for
						your email to check the domain{" "}
						<code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
							@kkwagh.edu.in
						</code>{" "}
						and whether Google has verified it. We immediately
						discard your email address after checking the domain and
						only store the irreversible hash of your Google ID (
						<code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
							sub
						</code>
						) in the database.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						How would I get future updates after joining the
						waitlist?
					</h2>
					<p className="">
						Since we don't store your email, the best way to stay
						informed about the launch and future updates is by
						joining our official WhatsApp Channel. (You will find
						the link of the channel on{" "}
						<Link href="/" className="underline hover:no-underline">
							waitlist page
						</Link>{" "}
						after you join the waitlist)
					</p>
					<p>
						Since we're using WhatsApp's "Channels" feature (not
						groups), we won't know who has joined - so your
						anonymity remains protected. Join the channel to get
						notified when we launch and for all future updates.
					</p>
					<p>
						You can also star or watch the GitHub repositories for
						the{" "}
						<Link
							href={WAITLIST_REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:no-underline"
						>
							waitlist
						</Link>{" "}
						and the{" "}
						<Link
							href={PLATFORM_REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:no-underline"
						>
							main platform
						</Link>{" "}
						to get notified of code changes and releases.
					</p>
				</div>

				<div className="mt-6 pt-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						What kind of content is allowed on the platform?
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
						How will the platform be moderated if it's anonymous?
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
						When will the platform launch?
					</h2>
					<p className="">
						We're aiming to launch in the coming weeks! Join our
						WhatsApp Channel to be the first to know. Early joiners
						might even get special access or features.
					</p>
				</div>

				<div className="mt-6 py-6 space-y-4 border-t-2 border-border border-dashed">
					<h2 className="text-lg font-semibold">
						I have security or privacy concerns. How can I reach
						you?
					</h2>
					<p className="">
						We're always open to questions about security or
						privacy. Feel free to email us at{" "}
						<span>
							<Link
								href={`mailto:${CONTACT_EMAIL_1}`}
								className="underline hover:no-underline"
							>
								{CONTACT_EMAIL_1}
							</Link>
						</span>{" "}
						or{" "}
						<span>
							<Link
								href={`mailto:${CONTACT_EMAIL_2}`}
								className="underline hover:no-underline"
							>
								{CONTACT_EMAIL_2}
							</Link>
						</span>
						. You can also open an issue on the relevant GitHub
						repository if your concern is technical. Security is our
						top priority, and we appreciate your input to make the
						platform even safer.
					</p>
				</div>
			</ViewContainer>
		</main>
	);
}
