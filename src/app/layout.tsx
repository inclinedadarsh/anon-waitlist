import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Anon // Waitlist",
	description:
		"Join the waitlist for Anon, an anonymous social network for the students of K. K. Wagh.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<Suspense>
					{children}
				</Suspense>
				<Toaster richColors theme="light" />
			</body>
		</html>
	);
}
