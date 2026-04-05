# SEO Optimization Plan — SRM PYQ API Docs

> **Rule**: No backend logic or UI functionality changes. Only metadata, copy, alt tags, structured data, and SEO files.
> **Principle**: Keywords must read naturally — woven into existing documentation prose, never stuffed or forced.

---

## File 1: `src/app/layout.tsx`

### Changes:
1. **Enhanced `metadata` object** with:
   - `title.default`: `"SRM PYQ API — Previous Year Question Papers API Documentation"`
   - `title.template`: `"%s | SRM PYQ API Docs"`
   - `description`: 155-char description with "SRM university exam papers", "REST API", "Python, JavaScript, cURL"
   - `keywords`: Array of 10 natural keywords
   - `robots`: Full directives (index, follow, googleBot)
   - `openGraph`: Full OG tags (type, locale, url, siteName, title, description)
   - `twitter`: Summary large image card
   - `alternates.canonical`: siteUrl

2. **JSON-LD structured data** in `<head>`:
   - `@type: "WebApplication"`
   - Name, description, URL, applicationCategory, pricing (free)

### Full new content:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

---

## File 2: `src/app/page.tsx`

### Changes: Natural keyword integration in copy only

#### Hero Section (line ~943-954)
**Before:**
```
SRM PYQ API
A comprehensive read-only HTTP JSON API for accessing SRM previous year question papers. 
No authentication required. Built for developers building educational tools, chatbots, 
and study applications.
```

**After:**
```
SRM PYQ API — Access Previous Year Question Papers
A comprehensive read-only REST API for accessing SRM university previous year question papers 
and exam materials. No authentication required. Built for developers creating study apps, 
exam preparation tools, and educational platforms that need programmatic access to 
SRM course papers and question paper data.
```

#### Data Models Section (line ~1034)
**Before:**
```
Core entities returned by the API. All responses are wrapped in a data key.
```

**After:**
```
Core entities returned by the SRM PYQ API. Each response follows a consistent JSON schema 
wrapped in a data key, making it straightforward to integrate SRM exam paper data into 
your applications.
```

#### Data Model Card Titles
- `Course` → `Course — SRM Course Catalog Entry`
- `Paper` → `Paper — Exam Question Paper Record`
- `File` → `File — Question Paper PDF Metadata`
- `Download Response` → `Download Response — Signed PDF Access URL`

#### API Endpoints Section (line ~1166)
**Before:**
```
Complete endpoint reference with live request testing. Each endpoint includes code examples in 
Python, cURL, JavaScript, Go, PHP, and Ruby — plus an interactive playground to test against the production API.
```

**After:**
```
Complete reference for every SRM PYQ API endpoint with live request testing. Each endpoint 
includes runnable code examples in Python, cURL, JavaScript, Go, PHP, and Ruby — plus an 
interactive playground to test queries against the production API in real time.
```

#### Endpoint Summaries (natural keyword enrichment)

| Endpoint | Before | After |
|----------|--------|-------|
| `/health` | "Liveness endpoint for fast health checks." | "Health check endpoint for verifying the SRM PYQ API is running and responsive." |
| `/v1/courses` | "List courses with optional search and cursor pagination." | "Browse and search the SRM course catalog with cursor-based pagination. Filter courses by code or name to find the right exam papers." |
| `/v1/courses/{code}` | "Get one course by exact course_code." | "Retrieve full details for a specific SRM course including department, program, and semester information." |
| `/v1/courses/{code}/papers` | "List papers for a course with optional year/term filters and cursor paging." | "List all previous year question papers for a given SRM course. Filter by exam year or term to find specific papers." |
| `/v1/papers/{id}` | "Get a single paper with normalized metadata and minimal course linkage." | "Get detailed metadata for a specific SRM question paper including exam year, term, and source information." |
| `/v1/papers/{id}/files` | "List file records for a paper, including computed public_url when applicable." | "List all PDF files attached to a question paper, including storage details and public download URLs." |
| `/v1/files/{id}/download` | "Return either a public URL or a signed URL for downloading the PDF." | "Generate a time-limited signed URL or retrieve a public link to download SRM question paper PDFs." |

#### Integration Patterns Section (line ~1217)
**Before:**
```
Integration Patterns
```

**After:**
```
SRM API Integration Patterns
```

#### Pattern Card A (line ~1231)
**Before:**
```
Search & Drill Down
Search courses with /v1/courses?q=, pick a course_code, fetch papers, get files, then download.
```

**After:**
```
Search & Drill Down
Search the SRM course catalog with /v1/courses?q=, select a course_code, fetch its previous year 
question papers, retrieve file metadata, and download the PDF. Ideal for building study apps 
and exam preparation tools.
```

#### Pattern Card B (line ~1246)
**Before:**
```
Cursor Pagination
Walk list endpoints with page.next_cursor while has_more is true.
```

**After:**
```
Cursor Pagination
Efficiently paginate through large SRM course and paper listings using page.next_cursor 
while has_more is true. This pattern ensures your app can handle the full SRM question 
paper catalog without missing results.
```

#### Pattern Card C (line ~1261)
**Before:**
```
Fresh Downloads
Always request a fresh /download URL right before fetching files. Signed URLs expire.
```

**After:**
```
Fresh Downloads
Always request a fresh /download URL right before fetching SRM question paper PDFs. 
Signed URLs expire after a set duration, so generate them on-demand for reliable paper downloads.
```

#### Errors Section (line ~1279)
**Before:**
```
Errors & Retries
```

**After:**
```
Error Handling & Retry Strategies
```

---

## File 3: `src/app/support/page.tsx`

### Add metadata export at top:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support — SRM PYQ API",
  description:
    "Contact the SRM PYQ API team for bug reports, feature requests, integration help, or documentation feedback.",
};
```

### Copy changes:

**Hero (line ~119):**
```tsx
<h1>Get in Touch with the SRM PYQ API Team</h1>
```

**Description (line ~125):**
```tsx
<p>
  Found a bug in the SRM question papers API? Have a feature request or need help 
  integrating previous year question paper data into your app? We&apos;d love to hear 
  from you. Your feedback helps us improve the API and documentation for all developers.
</p>
```

**Info Cards:**
- "Bug Reports" card → mention "SRM PYQ API bugs"
- "Feature Requests" card → mention "SRM question paper API features"

---

## File 4: SVG Alt Tags (all files with SVGs)

Add `aria-hidden="true"` to purely decorative SVGs, or `aria-label` + `role="img"` to meaningful ones:

### In `page.tsx` — examples:

```tsx
// Base URL icon
<svg aria-label="Base URL" role="img" className="h-5 w-5 text-violet-400" ...>

// Quick Start icon
<svg aria-label="Quick start guide" role="img" className="h-5 w-5 text-accent" ...>

// Course icon
<svg aria-label="Course model" role="img" className="h-4 w-4 text-accent" ...>

// Paper icon
<svg aria-label="Paper model" role="img" className="h-4 w-4 text-violet-400" ...>

// File icon
<svg aria-label="File model" role="img" className="h-4 w-4 text-amber-400" ...>

// Download icon
<svg aria-label="Download response" role="img" className="h-4 w-4 text-sky-400" ...>
```

### In `floating-nav.tsx`:
```tsx
// Support chat icon
<svg aria-label="Support" role="img" className="..." ...>
```

### In `endpoint-playground.tsx`:
```tsx
// Play icon
<svg aria-label="Run request" role="img" className="..." ...>

// Info icon
<svg aria-label="Ready to execute" role="img" className="..." ...>

// Error icon
<svg aria-label="Error" role="img" className="..." ...>

// Success icon
<svg aria-label="Response" role="img" className="..." ...>
```

### In `support/page.tsx`:
```tsx
// Back arrow
<svg aria-label="Back to documentation" role="img" className="..." ...>

// Success checkmark
<svg aria-label="Message sent successfully" role="img" className="..." ...>

// Bug icon
<svg aria-label="Bug reports" role="img" className="..." ...>

// Feature icon
<svg aria-label="Feature requests" role="img" className="..." ...>
```

---

## File 5: `public/robots.txt` (NEW)

```
User-agent: *
Allow: /

Sitemap: https://srm-api-docs.vercel.app/sitemap.xml
```

---

## File 6: `src/app/sitemap.ts` (NEW)

```tsx
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://srm-api-docs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
```

---

## File 7: `next.config.ts` — optional enhancement

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure clean URLs without trailing slashes for SEO consistency
  trailingSlash: false,
};

export default nextConfig;
```

---

## Summary of All Changes

| File | Change Type | SEO Impact |
|------|-------------|------------|
| `layout.tsx` | Metadata, OG, Twitter, canonical, JSON-LD | 🔴 High |
| `page.tsx` | Natural keyword copy, aria-labels on SVGs | 🔴 High |
| `support/page.tsx` | Metadata, keyword-enriched copy, aria-labels | 🟡 Medium |
| `floating-nav.tsx` | aria-label on SVG | 🟢 Low |
| `endpoint-playground.tsx` | aria-labels on SVGs | 🟢 Low |
| `public/robots.txt` | New file | 🟡 Medium |
| `src/app/sitemap.ts` | New file | 🟡 Medium |
| `next.config.ts` | trailingSlash config | 🟢 Low |

**Zero backend logic changes. Zero UI functionality changes.** Only metadata, copy text, accessibility attributes, and SEO configuration files.
