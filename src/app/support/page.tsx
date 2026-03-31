"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FloatingNav } from "@/components/floating-nav";

const SUBJECT_OPTIONS = [
  { value: "Custom Subject", label: "Custom Subject (write your own)" },
  { value: "Bug Report", label: "Bug Report" },
  { value: "Feature Request", label: "Feature Request" },
  { value: "API Issue", label: "API Issue" },
  { value: "Documentation Error", label: "Documentation Error" },
  { value: "Integration Help", label: "Integration Help" },
  { value: "General Feedback", label: "General Feedback" },
  { value: "Security Concern", label: "Security Concern" },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  customSubject: string;
  message: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function SupportPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    customSubject: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");
    setResponseMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitState("error");
        setResponseMessage(data.error || "Something went wrong");
        return;
      }

      setSubmitState("success");
      setResponseMessage(data.message);
      setForm({
        name: "",
        email: "",
        subject: "",
        customSubject: "",
        message: "",
      });
    } catch {
      setSubmitState("error");
      setResponseMessage("Failed to send message. Please try again.");
    }
  };

  const isCustomSubject = form.subject === "Custom Subject";

  return (
    <div className="min-h-[100dvh]">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <FloatingNav activePage="support" />

      {/* Back to Docs Button - Fixed Left */}
      <Link
        href="/"
        className="fixed left-4 top-4 z-40 flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-text-muted backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 hover:text-foreground md:left-6 md:top-6 md:px-4 md:py-2.5 md:text-sm"
      >
        <svg
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 md:h-4 md:w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="hidden md:inline">Back to Docs</span>
      </Link>

      <main className="relative mx-auto max-w-3xl px-4 pb-32 pt-32 md:px-8">
        {/* Hero Section */}
        <section className="space-y-8 py-12">
          <ScrollReveal>
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Contact
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-4xl font-medium tracking-[-0.04em] text-foreground md:text-5xl lg:text-6xl">
              Get in Touch
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
              Found a bug? Have a feature request? We&apos;d love to hear from you. 
              Your feedback helps us improve the API and documentation for everyone.
            </p>
          </ScrollReveal>
        </section>

        {/* Form Section */}
        <ScrollReveal delay={200}>
          <section className="bezel-outer">
            <div className="bezel-inner p-6 md:p-8">
              {submitState === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <svg
                      className="h-8 w-8 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-medium text-foreground">Message Sent!</h2>
                  <p className="mb-8 text-text-muted">{responseMessage}</p>
                  <button
                    type="button"
                    onClick={() => setSubmitState("idle")}
                    className="btn-premium group bg-accent text-background hover:bg-accent/90"
                  >
                    <span>Send Another Message</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
                      <svg className="h-4 w-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-text-muted/50 transition-all duration-300 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-text-muted/50 transition-all duration-300 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.75rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="" disabled>
                        Select a subject...
                      </option>
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Subject Field (conditional) */}
                  {isCustomSubject && (
                    <div className="space-y-2">
                      <label htmlFor="customSubject" className="block text-sm font-medium text-foreground">
                        Your Custom Subject
                      </label>
                      <input
                        type="text"
                        id="customSubject"
                        name="customSubject"
                        value={form.customSubject}
                        onChange={handleChange}
                        required={isCustomSubject}
                        minLength={3}
                        placeholder="Enter your subject line..."
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-text-muted/50 transition-all duration-300 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  )}

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      minLength={10}
                      rows={6}
                      placeholder="Describe your issue, suggestion, or feedback in detail..."
                      className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-text-muted/50 transition-all duration-300 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  {/* Error Message */}
                  {submitState === "error" && responseMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <svg
                          className="h-4 w-4 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-sm text-red-400">{responseMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitState === "loading"}
                    className="btn-premium group w-full bg-accent text-background hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="font-medium">
                      {submitState === "loading" ? "Sending..." : "Send Message"}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
                      {submitState === "loading" ? (
                        <svg
                          className="h-4 w-4 animate-spin text-background"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 text-background"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ScrollReveal delay={250}>
            <div className="bezel-outer h-full">
              <div className="bezel-inner flex h-full flex-col p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <svg
                    className="h-5 w-5 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">Bug Reports</h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  Found something broken? Include steps to reproduce, expected vs actual behavior, 
                  and any error messages you encountered.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="bezel-outer h-full">
              <div className="bezel-inner flex h-full flex-col p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <svg
                    className="h-5 w-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-foreground">Feature Requests</h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  Have an idea to improve the API? Tell us what you&apos;re building and how 
                  a new feature would help your use case.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
