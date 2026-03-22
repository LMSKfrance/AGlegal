import { Resend } from "resend";
import { getSetting } from "./actions/settings-internal";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "AG Legal <onboarding@resend.dev>";

function parseRecipients(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const raw = await getSetting("notifications.contact_email");
  const to = parseRecipients(raw);
  if (!to.length) return; // no recipient configured yet

  await resend.emails.send({
    from: FROM,
    to,
    replyTo: data.email,
    subject: `New contact message — ${data.firstName} ${data.lastName}`,
    html: contactEmailHtml(data),
  });
}

export async function sendBookingEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  date: string;
  message: string;
}): Promise<void> {
  const raw = await getSetting("notifications.booking_email");
  const to = parseRecipients(raw);
  if (!to.length) return; // no recipient configured yet

  await resend.emails.send({
    from: FROM,
    to,
    replyTo: data.email,
    subject: `New consultation request — ${data.firstName} ${data.lastName}`,
    html: bookingEmailHtml(data),
  });
}

// ─── Email templates ───────────────────────────────────────────────────────

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 12px;color:#6b7280;font-size:13px;white-space:nowrap;width:120px;">${label}</td>
      <td style="padding:8px 12px;color:#111827;font-size:13px;">${value}</td>
    </tr>`;
}

function emailWrapper(title: string, body: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:#1e3a8a;padding:24px 32px;">
          <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">AG Legal</span>
        </td></tr>
        <tr><td style="padding:28px 32px 8px;">
          <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">${title}</p>
        </td></tr>
        <tr><td style="padding:8px 20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tbody>${body}</tbody>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 28px;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">You can reply directly to this email to respond to the sender.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function contactEmailHtml(d: { firstName: string; lastName: string; email: string; phone: string; message: string }) {
  return emailWrapper(
    "New contact form submission",
    row("Name", `${d.firstName} ${d.lastName}`) +
    row("Email", d.email) +
    row("Phone", d.phone || "—") +
    row("Message", d.message.replace(/\n/g, "<br/>"))
  );
}

function bookingEmailHtml(d: { firstName: string; lastName: string; email: string; topic: string; date: string; message: string }) {
  return emailWrapper(
    "New consultation request",
    row("Name", `${d.firstName} ${d.lastName}`) +
    row("Email", d.email) +
    row("Topic", d.topic || "—") +
    row("Date", d.date || "—") +
    row("Message", d.message.replace(/\n/g, "<br/>"))
  );
}
