import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clarix — Dedicated AI Assistants for Business & Life",
  description:
    "We build, configure, and maintain personalized AI assistants that run on dedicated hardware, hold deep knowledge of your world, and communicate through the channels you already use.",
  keywords: ["AI assistant", "managed AI", "Claude AI", "dedicated AI", "business AI assistant", "OpenClaw"],
  openGraph: {
    title: "Clarix — Dedicated AI Assistants",
    description: "Your Life. Your Work. An AI That Knows It.",
    url: "https://clarix.ai",
    siteName: "Clarix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget apiKey={process.env.NEXT_PUBLIC_OPENROUTER_CHAT_KEY || ""} />
      </body>
    </html>
  );
}
