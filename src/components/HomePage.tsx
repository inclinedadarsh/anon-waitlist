"use client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ViewContainer } from "@/components/ui/view-container";
import { Loader2, CheckCircle, ExternalLink } from "lucide-react";
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
    const [isEntriesLoading, setIsEntriesLoading] = useState<boolean>(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const fetchWaitlistEntries = async () => {
        setIsEntriesLoading(true);
        try {
            const response = await fetch("api/waitlist");
            if (!response.ok) {
                throw new Error("Failed to fetch waitlist entries");
            }
            const data = await response.json().catch(() => ({}));
            setWaitlistEntries(data);
        } catch (error) {
            console.error("Error occured while fetching wailist entries: ", error);
            toast.error("Failed to load waitlist entries. Please refresh the page");
        } finally {
            setIsEntriesLoading(false);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        fetchWaitlistEntries();
        setShowSuccessMessage(hasCookie);
    }, []);


    const handleGoogleLogin = () => {
        window.location.href = "/api/auth/google/login";
    };

    return (
        <>
            {showSuccessMessage && (
                <div className="mt-6 pt-6 border-t-2 border-dashed space-y-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
                        <h2 className="text-lg font-semibold block text-green-800 dark:text-green-300">
                            You're on the list!
                        </h2>
                    </div>
                    <p className="text-green-700 dark:text-green-300">
                        Thanks for joining! To stay updated on the launch and get notified first, join our official WhatsApp Channel.
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                        (Don't worry, joining the channel is anonymous - we won't see your number or name!)
                    </p>
                    {WHATSAPP_CHANNEL_URL && (
                        <Button asChild variant="secondary" className="bg-white dark:bg-background border border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-800/50 text-green-800 dark:text-green-200">
                            <Link href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                                Join WhatsApp Channel
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )
                    }
                </div>
            )}

            {!showSuccessMessage && (
                <div className="mt-6 pt-6 border-t-2 border-border border-dashed space-y-4">
                    <h2 className="text-lg font-semibold block">
                        Join the Waitlist
                    </h2>
                    <p>
                        Verify you're a K. K. Wagh student using your
                        college Google account to join.
                    </p>
                    <Button
                        onClick={handleGoogleLogin}
                        className="hover:cursor-pointer"
                    >
                        Login with Google to Join
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        We only check if your email ends with
                        @kkwagh.edu.in and store a hash of
                        your unique Google ID.
                    </p>
                </div>
            )}

            <div className="mt-6 pt-6 border-t-2 border-border border-dashed space-y-4">
                <h2
                    className="text-lg font-semibold block"
                    id="registered-users"
                >
                    {isEntriesLoading
                        ? "Loading registered users..."
                        : `${waitlistEntries.length} user${waitlistEntries.length !== 1 ? "s have" : " has"} registered till now!`}
                </h2>
                <p className="">
                    These are the hashed Google IDs of users on the
                    waitlist. As mentioned on our{" "}
                    <Link
                        href="/answers"
                        className="font-medium underline hover:no-underline"
                    >
                        answers page
                    </Link>
                    , we only only these anonymous identifiers.
                </p>

                <div className="mt-4">
                    {isEntriesLoading ? (
                        <div className="flex items-center space-x-3 py-4">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading registered users...</span>
                        </div>
                    ) : waitlistEntries.length > 0 ? (
                        <Table>
                            <TableCaption>
                                List of registered users (hashed Google IDs).
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Hashed Google ID</TableHead>
                                    <TableHead>Registered at</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {waitlistEntries.map((item, index) => (
                                    <TableRow key={item.hashed_google_id}>
                                        <TableCell>{index + 1}</TableCell>
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
        </>
    );
}
