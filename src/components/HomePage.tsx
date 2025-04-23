"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WaitlistEntry = {
	hashed_google_id: string;
	created_at: string;
};

const WHATSAPP_CHANNEL_URL = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL;

export default function HomePage({ hasCookie }: { hasCookie: boolean }) {
	const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
	const [rejectedCount, setRejectedCount] = useState<number>(0); // New state for rejected count
	const [pageStatus, setPageStatus] = useState({
		entriesLoading: true,
		googleLoginLoading: false,
		isRegistered: false,
	});

	const fetchWaitlistEntries = async () => {
		try {
			const response = await fetch("api/waitlist");
			if (!response.ok) {
				throw new Error("Failed to fetch waitlist entries");
			}
			const data = await response.json(); // Changed to get the whole object
			console.log(data);
			const waitlistData: WaitlistEntry[] = data.waitlistEntries || []; // Access waitlistEntries
			const rejectedUsersCount: number = data.rejectedCount || 0; // Access rejectedCount

			waitlistData.sort((a, b) => {
				// Sort waitlist entries
				const timeA = new Date(a.created_at).getTime();
				const timeB = new Date(b.created_at).getTime();
				return timeB - timeA;
			});
			setWaitlistEntries(waitlistData);
			setRejectedCount(rejectedUsersCount); // Set the rejected count
		} catch (error) {
			console.error(
				"Error occurred while fetching waitlist entries: ",
				error,
			);
			toast.error(
				"Failed to load waitlist entries. Please refresh the page",
			);
		} finally {
			setPageStatus(current => ({ ...current, entriesLoading: false }));
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchWaitlistEntries();
		if (hasCookie) {
			setPageStatus(current => ({ ...current, isRegistered: true }));
			if (hasCookie) {
				triggerConfetti();
			}
		}
	}, [hasCookie]);

	const triggerConfetti = () => {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			colors: ["#10B981", "#059669", "#047857", "#065F46", "#064E3B"],
			gravity: 0.8,
			scalar: 1.2,
			shapes: ["circle", "square"],
			ticks: 200,
		});
	};

	const handleGoogleLogin = () => {
		setPageStatus(current => ({ ...current, googleLoginLoading: true }));
		window.location.href = "/api/auth/google/login";
	};

	const fadeVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.3,
				ease: "easeOut",
			},
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.2, ease: "easeIn" },
		},
	};

	const TableRowSkeleton = () => (
		<TableRow>
			<TableCell>
				<Skeleton className="h-4 w-8" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-64" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-32" />
			</TableCell>
		</TableRow>
	);

	const renderRegistrationSection = () => {
		return (
			<AnimatePresence mode="wait">
				{pageStatus.isRegistered ? (
					<motion.div
						key="success"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={fadeVariants}
						className="mt-6 pt-6 border-t-2 border-dashed space-y-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700"
					>
						<div className="flex items-center gap-3">
							<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
							<h2 className="text-lg font-semibold block text-green-800 dark:text-green-300">
								You're on the list!
							</h2>
						</div>
						<p className="text-green-700 dark:text-green-300">
							Thanks for joining! To stay updated on the launch
							and get notified first, join our official WhatsApp
							Channel.
						</p>
						<p className="text-xs text-green-600 dark:text-green-400">
							(Don't worry, joining the channel is anonymous - we
							won't see your number or name!)
						</p>
						{WHATSAPP_CHANNEL_URL && (
							<div>
								<Button
									asChild
									variant="secondary"
									className="bg-white dark:bg-background border border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-800/50 text-green-800 dark:text-green-200 transition-colors duration-200"
								>
									<Link
										href={WHATSAPP_CHANNEL_URL}
										target="_blank"
										rel="noopener noreferrer"
									>
										Join WhatsApp Channel
										<ExternalLink className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						)}
					</motion.div>
				) : (
					<motion.div
						key="join"
						initial="hidden"
						animate="visible"
						exit="exit"
						variants={fadeVariants}
						className="mt-6 pt-6 border-t-2 border-border border-dashed space-y-4"
					>
						<h2 className="text-lg font-semibold block">
							Join the Waitlist
						</h2>
						<p>
							Verify you're a K. K. Wagh student using your
							college Google account to join.
						</p>
						<div>
							<Button
								onClick={handleGoogleLogin}
								className="hover:cursor-pointer transition-colors duration-200"
								disabled={pageStatus.googleLoginLoading}
							>
								{pageStatus.googleLoginLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Logging in...
									</>
								) : (
									"Login with Google to Join"
								)}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							We only check if your email ends with @kkwagh.edu.in
							and store a hash of your unique Google ID.
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		);
	};

	const renderWaitlistEntries = () => {
		return (
			<motion.div
				initial="hidden"
				animate="visible"
				variants={fadeVariants}
				className="mt-6 pt-6 border-t-2 border-border border-dashed space-y-4"
			>
				<h2
					className="text-lg font-semibold block"
					id="registered-users"
				>
					{pageStatus.entriesLoading
						? "Loading registered users..."
						: `${waitlistEntries.length} user${waitlistEntries.length !== 1 ? "s have" : " has"} registered till now!`}
				</h2>
				<p>
					These are the hashed Google IDs of users on the waitlist. As
					mentioned on our{" "}
					<Link
						href="/answers"
						className="font-medium underline hover:no-underline transition-colors duration-200"
					>
						answers page
					</Link>
					, we only store these anonymous identifiers.
				</p>

				<div className="mt-4">
					<AnimatePresence mode="wait">
						{pageStatus.entriesLoading ? (
							<motion.div
								key="loading"
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={fadeVariants}
							>
								<Table>
									<TableCaption>
										Loading registered users...
									</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>No.</TableHead>
											<TableHead>
												Hashed Google ID
											</TableHead>
											<TableHead>Registered at</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{[...Array(5)].map((_, index) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											<TableRowSkeleton key={index} />
										))}
									</TableBody>
								</Table>
							</motion.div>
						) : waitlistEntries.length > 0 ? (
							<motion.div
								key="table"
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={fadeVariants}
							>
								<Table>
									<TableCaption>
										List of registered users (hashed Google
										IDs).
									</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>No.</TableHead>
											<TableHead>
												Hashed Google ID
											</TableHead>
											<TableHead>Registered at</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{waitlistEntries.map((item, index) => (
											<TableRow
												key={item.hashed_google_id}
												className="hover:bg-muted/50 transition-colors duration-200"
											>
												<TableCell>
													{index + 1}
												</TableCell>
												<TableCell>
													{item.hashed_google_id}
												</TableCell>
												<TableCell>
													{new Date(
														item.created_at,
													).toLocaleString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
														hour: "numeric",
														minute: "2-digit",
														hour12: true,
													})}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</motion.div>
						) : (
							<motion.p
								key="empty"
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={fadeVariants}
								className="py-2 italic"
							>
								No registrations yet. Be the first one!
							</motion.p>
						)}
					</AnimatePresence>
				</div>
				{/* Display the rejected users count */}
				<motion.p
					initial="hidden"
					animate="visible"
					variants={fadeVariants}
					className="mt-6 mb-1 text-sm text-muted-foreground"
				>
					{rejectedCount} user
					{rejectedCount !== 1 ? "s were" : " was"} rejected because
					they&apos;re not from K. K. Wagh.
				</motion.p>
				<motion.p
					initial="hidden"
					animate="visible"
					variants={fadeVariants}
					className="text-xs text-muted-foreground"
				>
					<span className="font-medium">Note:</span> A rejected user
					is added when someone tries to log in from a non-K. K. Wagh
					email and hasn&apos;t tried accessing before (i.e., only the
					first attempt is counted).
				</motion.p>
			</motion.div>
		);
	};

	const renderFooter = () => (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={fadeVariants}
			className="mt-6 py-6 border-t-2 border-border border-dashed space-y-4"
		>
			By{" "}
			<Link
				href="https://linkedin.com/in/dubeyadarsh"
				className="font-medium underline hover:no-underline transition-colors duration-200"
			>
				Adarsh
			</Link>{" "}
			&{" "}
			<Link
				href="https://www.linkedin.com/in/adityab29/"
				className="font-medium underline hover:no-underline transition-colors duration-200"
			>
				Aditya
			</Link>
			.
		</motion.div>
	);

	return (
		<motion.div initial="hidden" animate="visible" variants={fadeVariants}>
			{renderRegistrationSection()}
			{renderWaitlistEntries()}
			{renderFooter()}
		</motion.div>
	);
}
