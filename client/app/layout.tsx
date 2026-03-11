import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://automationexperts.com"),

  title: {
    default: "Automation Experts Marketplace",
    template: "%s | Automation Experts",
  },

  description:
    "Hire top automation experts for Zapier, n8n, AI agents, API integrations and workflow automation.",

  keywords: [
    "automation experts",
    "zapier expert",
    "n8n automation",
    "AI automation",
    "workflow automation",
    "API integrations",
    "hire automation expert",
  ],

  authors: [{ name: "Automation Experts" }],
  creator: "Automation Experts",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Automation Experts Marketplace",
    description:
      "Find and hire top automation experts for Zapier, n8n, AI agents and workflow automation.",
    url: "https://automationexperts.com",
    siteName: "Automation Experts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Automation Experts Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Automation Experts Marketplace",
    description:
      "Hire top automation experts for Zapier, n8n, AI agents and integrations.",
    images: ["/og-image.png"],
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
