import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";

import { LivePreviewListener } from "@/components/live-preview-listener";
import { ThemeProvider } from "@/components/theme-provider";
import { mergeOpenGraph } from "@/lib/merge-open-graph";
import { cn } from "@/lib/utils";

import { FooterBlock } from "@/payload/blocks/globals/footer/component";
import { HeaderBlock } from "@/payload/blocks/globals/header/component";

import type { Metadata } from "next";

import "@/frontend/global.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
			</head>

			<body className={cn("flex h-screen flex-col font-sans antialiased", fontSans.variable)}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<LivePreviewListener />

					<header>
						<HeaderBlock />
					</header>

					<main>{children}</main>

					<footer className="mt-auto">
						<FooterBlock />
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!),
	openGraph: mergeOpenGraph(),
	twitter: {
		card: "summary_large_image",
		creator: "@theSavanaDev",
	},
};
