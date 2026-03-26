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
  title: "CodeShame",
  description: "Shame my code",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodeShame",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeShame",
    description: "Shame my code",
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
