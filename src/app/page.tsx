export const dynamic = 'force-dynamic';

import { ViewContainer } from "@/components/ui/view-container";
import { cookies } from "next/headers";
import Link from "next/link";
import HomePage from "@/components/HomePage";

export default async function Home() {
	const cookieStore = await cookies()
	const hasCookie = cookieStore.has('waitlisted')

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
							How is it anonymous if you're asking me to login with google in the
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
				<HomePage hasCookie={hasCookie}/>
			</ViewContainer>
		</main>
	);
}
