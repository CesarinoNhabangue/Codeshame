import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TRPCProvider } from "@/trpc/client";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeShame | AI Code Roasts and Shareable Reviews",
    template: "%s | CodeShame",
  },
  description:
    "Paste your code, get a score, uncover the ugliest issues, and share the roast with a playful AI-powered review flow.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodeShame",
    title: "CodeShame | AI Code Roasts and Shareable Reviews",
    description:
      "AI-powered code reviews with scores, fixes, leaderboard chaos, and shareable roast pages.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeShame | AI Code Roasts and Shareable Reviews",
    description:
      "AI-powered code reviews with scores, fixes, leaderboard chaos, and shareable roast pages.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(jetbrainsMono.variable, "antialiased font-mono")}
      >
        <TRPCProvider>
          <div className="flex min-h-screen flex-col bg-bg-page">
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}
