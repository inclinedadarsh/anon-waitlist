import { ViewContainer } from "@/components/ui/view-container";

export default function Home() {
	return (
		<main className="">
			<ViewContainer>
				{/* biome-ignore lint/suspicious/noCommentText: <explanation> */}
				<h1 className="">Waitlist // Anon</h1>
				<p className="">
					Ever wanted a place to just say things without overthinking?
					We’re building an anonymous space just for K. K. Wagh
					students to talk about college, life, or just vibe with
					random folks from your campus. It’s like a chill gated
					community, but totally anon.
				</p>
				<p className="">
					We’re launching soon. Hop on the waitlist and be part of it
					from day one.
				</p>
			</ViewContainer>
		</main>
	);
}
