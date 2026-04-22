import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
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
    <html lang="en" className={geist.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
