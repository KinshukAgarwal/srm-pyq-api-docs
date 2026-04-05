"use client";

import { useMemo, useState } from "react";

type EndpointPlaygroundProps = {
  baseUrl: string;
  path: string;
  query?: Record<string, string | number>;
};

function buildUrl(baseUrl: string, path: string, query?: Record<string, string | number>) {
  const url = new URL(path, baseUrl);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export function EndpointPlayground({ baseUrl, path, query }: EndpointPlaygroundProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");

  const requestUrl = useMemo(() => buildUrl(baseUrl, path, query), [baseUrl, path, query]);
  const proxyUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("path", path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        params.set(key, String(value));
      }
    }
    return `/api/proxy?${params.toString()}`;
  }, [path, query]);

  async function runRequest() {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const apiResponse = await fetch(proxyUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const text = await apiResponse.text();
      if (!apiResponse.ok) {
        setError(`HTTP ${apiResponse.status}\n${text}`);
        return;
      }

      try {
        const parsed = JSON.parse(text);
        setResponse(JSON.stringify(parsed, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bezel-outer">
      <div className="bezel-inner space-y-5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <svg aria-label="Run request" role="img" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">Live Playground</p>
            <p className="mt-0.5 font-mono text-xs text-text-secondary">{requestUrl}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={runRequest}
          disabled={loading}
          className="btn-premium group border border-border bg-transparent text-foreground hover:border-accent/50 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{loading ? "Executing..." : "Run Request"}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-accent/20">
            {loading ? (
              <svg className="h-4 w-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-foreground transition-colors group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            )}
          </span>
        </button>

        {loading && (
          <div className="space-y-3">
            <div className="h-3 w-48 animate-pulse rounded-full bg-white/5" />
            <div className="h-3 w-full animate-pulse rounded-full bg-white/5" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/5" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/5" />
          </div>
        )}

        {!loading && !response && !error && (
          <div className="flex items-center gap-4 rounded-xl border border-dashed border-border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
              <svg aria-label="Ready to execute" role="img" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Ready to execute</p>
              <p className="mt-0.5 text-xs text-text-muted">Click Run Request to see a live response from the production API.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3 border-b border-red-500/10 px-4 py-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
                <svg aria-label="Error" role="img" className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-red-400">Error</span>
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-red-300">
              <code>{error}</code>
            </pre>
          </div>
        )}

        {response && (
          <div className="overflow-hidden rounded-xl border border-accent/20 bg-accent/5">
            <div className="flex items-center gap-3 border-b border-accent/10 px-4 py-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
                <svg aria-label="Response" role="img" className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-accent">Response</span>
            </div>
            <pre className="max-h-[400px] overflow-auto p-4 text-[13px] leading-relaxed text-text-secondary">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
