# SRM PYQ API Documentation

Premium documentation website for the SRM PYQ (Previous Year Questions) API. Built with Next.js 15, featuring a dark mode interface with interactive API playgrounds.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- 🌙 **Dark Mode** — Ethereal Glass design with OLED-optimized colors
- 🧪 **Interactive Playgrounds** — Test API endpoints directly in the browser
- 🌍 **Multi-Language Examples** — Python, cURL, JavaScript, Go, PHP, Ruby
- 📧 **Contact Form** — Built-in support page with email integration
- ⚡ **Fast** — Static generation with Next.js App Router
- 📱 **Responsive** — Mobile-first design

## API Endpoints Documented

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /v1/courses` | List all courses |
| `GET /v1/courses/{code}` | Get course details |
| `GET /v1/courses/{code}/papers` | List papers for a course |
| `GET /v1/papers/{id}` | Get paper details |
| `GET /v1/papers/{id}/files` | List files for a paper |
| `GET /v1/files/{id}/download` | Download a file |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/KinshukAgarwal/srm-pyq-api-docs.git
cd srm-pyq-api-docs

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation.

### Environment Variables

Create a `.env.local` file for email functionality:

```env
# Required for contact form emails
# Get your API key from https://resend.com
RESEND_API_KEY=re_xxxxxxxx
```

## Deployment

### Vercel (Recommended)

1. Import this repository on [Vercel](https://vercel.com/new)
2. Add environment variable: `RESEND_API_KEY`
3. Deploy

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Email**: Resend
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── contact/     # Email API route
│   │   └── proxy/       # CORS proxy for API testing
│   ├── support/         # Contact page
│   ├── page.tsx         # Main documentation
│   └── globals.css      # Design system
└── components/
    ├── endpoint-playground.tsx  # Interactive API tester
    ├── floating-nav.tsx         # Shared navigation
    ├── multi-lang-code.tsx      # Code snippets
    └── scroll-reveal.tsx        # Animations
```

## License

MIT

---

**API Base URL**: `https://srm-pyq-api.onrender.com`
