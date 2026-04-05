"use client";

import Link from "next/link";

type FloatingNavProps = {
  activePage?: "docs" | "support";
};

export function FloatingNav({ activePage = "docs" }: FloatingNavProps) {
  const isDocsPage = activePage === "docs";
  const isSupportPage = activePage === "support";

  return (
    <nav className="fixed left-1/2 top-4 z-40 w-[calc(100%-2rem)] max-w-fit -translate-x-1/2 md:top-6">
      <div className="glass-card flex items-center gap-1 overflow-hidden rounded-full px-1.5 py-1.5 md:gap-2 md:px-2 md:py-2">
        {isDocsPage ? (
          <a
            href="#overview"
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground md:px-4 md:py-2 md:text-sm"
          >
            Docs
          </a>
        ) : (
          <Link
            href="/"
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground md:px-4 md:py-2 md:text-sm"
          >
            Docs
          </Link>
        )}
        {isDocsPage ? (
          <a
            href="#endpoints"
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground md:px-4 md:py-2 md:text-sm"
          >
            API
          </a>
        ) : (
          <Link
            href="/#endpoints"
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground md:px-4 md:py-2 md:text-sm"
          >
            API
          </Link>
        )}
        {isDocsPage ? (
          <a
            href="#patterns"
            className="hidden whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground sm:block md:px-4 md:py-2 md:text-sm"
          >
            Guides
          </a>
        ) : (
          <Link
            href="/#patterns"
            className="hidden whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground sm:block md:px-4 md:py-2 md:text-sm"
          >
            Guides
          </Link>
        )}
        <Link
          href="/support"
          className={`group ml-0.5 flex shrink-0 items-center gap-1.5 rounded-full py-1.5 pl-3 pr-1.5 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:ml-1 md:gap-2 md:py-2 md:pl-4 md:pr-2 md:text-sm ${
            isSupportPage
              ? "bg-accent/10 text-accent hover:bg-accent/20"
              : "bg-white/5 text-foreground hover:bg-white/10"
          }`}
        >
          <span className="whitespace-nowrap">Support</span>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 md:h-7 md:w-7 ${
              isSupportPage
                ? "bg-accent/20 group-hover:bg-accent/30"
                : "bg-white/10 group-hover:bg-accent/20"
            }`}
          >
            <svg
              aria-label="Support" role="img"
              className={`h-2.5 w-2.5 transition-colors duration-300 md:h-3 md:w-3 ${
                isSupportPage ? "text-accent" : "text-foreground group-hover:text-accent"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </span>
        </Link>
      </div>
    </nav>
  );
}
