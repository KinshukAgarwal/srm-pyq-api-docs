import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://srm-api-docs.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "SRM PYQ API — Previous Year Question Papers API Documentation",
    template: "%s | SRM PYQ API Docs",
  },
  description:
    "Official documentation for the SRM PYQ (Previous Year Question Papers) REST API. Access SRM university exam papers, courses, and study materials programmatically with Python, JavaScript, cURL, and more.",
  keywords: [
    "SRM PYQ API",
    "SRM previous year question papers",
    "SRM university exam papers API",
    "SRM REST API documentation",
    "SRM question papers download",
    "SRM course papers API",
    "SRM university developer tools",
    "previous year papers JSON API",
    "SRM exam papers integration",
    "SRM PYQ API Python examples",
  ],
  authors: [{ name: "SRM PYQ API Team" }],
  creator: "SRM PYQ API",
  publisher: "SRM PYQ API",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SRM PYQ API Documentation",
    title: "SRM PYQ API — Previous Year Question Papers API Documentation",
    description:
      "Official documentation for the SRM PYQ REST API. Access SRM university exam papers, courses, and study materials programmatically.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SRM PYQ API — Previous Year Question Papers API Documentation",
    description:
      "Official documentation for the SRM PYQ REST API. Access SRM university exam papers programmatically.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SRM PYQ API",
              alternateName: "SRM Previous Year Question Papers API",
              description:
                "REST API for accessing SRM University previous year question papers, course catalogs, and exam materials programmatically.",
              url: siteUrl,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              browserRequirements: "Requires JavaScript",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              documentation: siteUrl,
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
