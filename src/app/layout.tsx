import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart USB Power Socket — 3D Working Model",
  description: "Interactive 3D working model of a Smart USB Power Socket with Android Monitoring Application, built with React Three Fiber and Next.js.",
  keywords: ["Smart USB Socket", "3D Model", "React Three Fiber", "LM317", "ESP8266", "IoT", "Android"],
  authors: [{ name: "Nile University of Nigeria — Dept. of EEE" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Smart USB Power Socket — 3D Working Model",
    description: "Interactive 3D visualization of an IoT-enabled USB power socket",
    siteName: "Smart USB Socket 3D",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart USB Power Socket — 3D Working Model",
    description: "Interactive 3D visualization of an IoT-enabled USB power socket",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
