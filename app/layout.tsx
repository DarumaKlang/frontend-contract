import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contract Generator",
  description: "Generate legal contracts and documents quickly and securely.",
  metadataBase: new URL('https://contract-generator.com'),
  openGraph: {
    type: 'website',
    url: 'https://contract-generator.com',
    title: 'Contract Generator',
    description: 'Generate legal contracts and documents quickly and securely.',
    images: [
      {
        url: 'https://contract-generator.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contract Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contract Generator',
    description: 'Generate legal contracts and documents quickly and securely.',
    site: '@ContractGen',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
