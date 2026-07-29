import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { links } from "@/content/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, purpose, message, company } = body;

  // Honeypot — real users never fill this in (it's hidden via CSS on the form).
  if (typeof company === "string" && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email) ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json({ error: "Please fill in your name, a valid email, and a message." }, { status: 400 });
  }

  if (!resend) {
    return NextResponse.json({ error: "Email isn't configured yet." }, { status: 500 });
  }

  const { error } = await resend.emails.send({
    from: "AI Portland Contact Form <contact@contact.aipdx.info>",
    to: links.contactEmail,
    replyTo: email,
    subject: `Contact form: ${typeof purpose === "string" && purpose ? purpose : "General inquiry"}`,
    text: `From: ${name} <${email}>\nPurpose: ${typeof purpose === "string" && purpose ? purpose : "n/a"}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
