import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://searchmyexpert-psi.vercel.app"),

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
    url: "https://searchmyexpert-psi.vercel.app",
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
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Automation Experts Marketplace",
      url: "https://searchmyexpert-psi.vercel.app",
      logo: "https://searchmyexpert-psi.vercel.app/logo.png",
      description:
        "Automation Experts Marketplace helps businesses hire top automation experts for Zapier, n8n, AI agents, API integrations and workflow automation.",
      foundingLocation: {
        "@type": "Place",
        name: "India",
      },
      sameAs: [
        "https://linkedin.com",
        "https://twitter.com",
        "https://github.com",
      ],
      knowsAbout: [
        "Zapier Automation",
        "n8n Automation",
        "AI Agents",
        "Workflow Automation",
        "API Integrations",
        "Business Automation",
      ],
    },

    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Automation Experts Marketplace",
      url: "https://searchmyexpert-psi.vercel.app",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://searchmyexpert-psi.vercel.app/experts?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },

    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Automation Expert Hiring Service",
      provider: {
        "@type": "Organization",
        name: "Automation Experts Marketplace",
        url: "https://searchmyexpert-psi.vercel.app",
      },
      serviceType: "Automation Consulting",
      areaServed: "Worldwide",
      description:
        "Hire certified automation experts for Zapier, n8n, AI automation, workflow automation and API integrations.",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  ];

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <AuthGuard />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
