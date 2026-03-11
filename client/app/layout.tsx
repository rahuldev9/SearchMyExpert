import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Automation Experts Marketplace",
    template: "%s | Automation Experts",
  },
  description:
    "Find top automation experts for Zapier, n8n, AI agents, API integrations, and workflow automation.",
  keywords: [
    "automation experts",
    "zapier expert",
    "n8n automation",
    "AI automation",
    "workflow automation",
    "API integrations",
  ],
  authors: [{ name: "Automation Experts" }],
  creator: "Automation Experts",
  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "Automation Experts Marketplace",
    description:
      "Hire top automation experts for Zapier, n8n, AI, and API integrations.",
    url: "https://yourdomain.com",
    siteName: "Automation Experts",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Automation Experts Marketplace",
    description:
      "Hire top automation experts for Zapier, n8n, AI agents, and integrations.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <AuthGuard />

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
