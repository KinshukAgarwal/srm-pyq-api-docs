import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_EMAIL = process.env.RESEND_TO_EMAIL;

const ALLOWED_SUBJECTS = [
  "Custom Subject",
  "Bug Report",
  "Feature Request",
  "API Issue",
  "Documentation Error",
  "Integration Help",
  "General Feedback",
  "Security Concern",
];

export async function POST(request: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    const body = await request.json();
    const { name, email, subject, customSubject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required and must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    if (!subject || !ALLOWED_SUBJECTS.includes(subject)) {
      return NextResponse.json(
        { error: "Please select a valid subject" },
        { status: 400 }
      );
    }

    if (subject === "Custom Subject" && (!customSubject || customSubject.trim().length < 3)) {
      return NextResponse.json(
        { error: "Custom subject must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message is required and must be at least 10 characters" },
        { status: 400 }
      );
    }

    const finalSubject = subject === "Custom Subject" ? customSubject.trim() : subject;

    if (!CONTACT_EMAIL) {
      console.error("[contact] Missing RESEND_TO_EMAIL env var. This must be the same email as your Resend account in sandbox mode.");
      return NextResponse.json(
        { error: "Email service is not fully configured. Please try again later." },
        { status: 500 }
      );
    }

    // Check if Resend is configured
    if (!resend) {
      // Log the message for development/testing when API key isn't set
      console.warn("[contact] RESEND_API_KEY is not configured. Contact form email not sent.");
      console.log("=== Contact Form Submission (Email Service Not Configured) ===");
      console.log(`To: ${CONTACT_EMAIL}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: [SRM PYQ API] ${finalSubject}`);
      console.log(`Message: ${message}`);
      console.log("To enable email delivery on Vercel, add RESEND_API_KEY and RESEND_TO_EMAIL env vars.");
      console.log("Sign up at: https://resend.com (free tier available)");
      console.log("==============================================================");
      
      return NextResponse.json({
        success: true,
        message: "Thank you! Your message has been received. Note: Email delivery is pending configuration.",
      });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Support <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[SRM PYQ API] ${finalSubject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-bottom: 24px;">New Contact Form Submission</h2>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0;"><strong>Subject:</strong> ${finalSubject}</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">
            <h3 style="color: #374151; margin: 0 0 12px 0;">Message:</h3>
            <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            Sent from SRM PYQ API Documentation Contact Form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend send failed", {
        error,
        to: CONTACT_EMAIL,
        from: "Support <onboarding@resend.dev>",
        replyTo: email,
        subject: `[SRM PYQ API] ${finalSubject}`,
      });
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    console.log("[contact] Resend email sent", {
      id: data?.id,
      to: CONTACT_EMAIL,
      from: "Support <onboarding@resend.dev>",
      replyTo: email,
      subject: `[SRM PYQ API] ${finalSubject}`,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("[contact] Unexpected contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
