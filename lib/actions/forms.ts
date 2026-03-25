"use server";

import { Resend } from "resend";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type FormState = {
  success?: boolean;
  error?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FROM = process.env.RESEND_FROM_EMAIL ?? "AG Legal <onboarding@resend.dev>";

async function getRecipients(key: string): Promise<string[]> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    const raw = row?.valueEn ?? "";
    return raw
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function tableRow(label: string, value: string) {
  return `<tr>
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

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function submitContactForm(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const firstName = (formData.get("firstName") as string)?.trim() ?? "";
    const lastName  = (formData.get("lastName")  as string)?.trim() ?? "";
    const email     = (formData.get("email")     as string)?.trim() ?? "";
    const phone     = (formData.get("phone")     as string)?.trim() ?? "";
    const message   = (formData.get("message")   as string)?.trim() ?? "";

    if (!firstName || !lastName || !email || !message) {
      return { error: "Please fill in all required fields." };
    }

    const to = await getRecipients("notifications.contact_email");

    if (to.length > 0) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM,
        to,
        replyTo: email,
        subject: `New contact message — ${firstName} ${lastName}`,
        html: emailWrapper(
          "New contact form submission",
          tableRow("Name",    `${firstName} ${lastName}`) +
          tableRow("Email",   email) +
          tableRow("Phone",   phone || "—") +
          tableRow("Message", message.replace(/\n/g, "<br/>"))
        ),
      });
    }

    return { success: true };
  } catch (err) {
    console.error("submitContactForm error:", err);
    return { error: "Failed to send message. Please try again." };
  }
}

export async function submitBookingForm(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const firstName = (formData.get("firstName") as string)?.trim() ?? "";
    const lastName  = (formData.get("lastName")  as string)?.trim() ?? "";
    const email     = (formData.get("email")     as string)?.trim() ?? "";
    const topic     = (formData.get("topic")     as string)?.trim() ?? "";
    const date      = (formData.get("date")      as string)?.trim() ?? "";
    const message   = (formData.get("message")   as string)?.trim() ?? "";

    if (!firstName || !lastName || !email || !message) {
      return { error: "Please fill in all required fields." };
    }

    const to = await getRecipients("notifications.booking_email");

    if (to.length > 0) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM,
        to,
        replyTo: email,
        subject: `New consultation request — ${firstName} ${lastName}`,
        html: emailWrapper(
          "New consultation request",
          tableRow("Name",    `${firstName} ${lastName}`) +
          tableRow("Email",   email) +
          tableRow("Topic",   topic || "—") +
          tableRow("Date",    date  || "—") +
          tableRow("Message", message.replace(/\n/g, "<br/>"))
        ),
      });
    }

    return { success: true };
  } catch (err) {
    console.error("submitBookingForm error:", err);
    return { error: "Failed to send request. Please try again." };
  }
}
