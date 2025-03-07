import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../app/components/Navbar";
import AuthProvider from "../Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Video Generator",
  description: "VideoGeneratorAIAgent.com uses advanced AI technology to effortlessly create engaging, professional videos. Perfect for marketing, training, and social media—generate custom videos with our innovative AI platform.",
  keywords: "AI video generator, video creation AI, artificial intelligence video, automated video production, AI video maker, professional video creation, video generation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
