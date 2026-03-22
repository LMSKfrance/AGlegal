"use server";

import { sendContactEmail, sendBookingEmail } from "@/lib/email";

export type FormState = {
  success?: boolean;
  error?: string;
};

export async function submitContactForm(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const firstName = (formData.get("firstName") as string)?.trim() ?? "";
    const lastName = (formData.get("lastName") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const message = (formData.get("message") as string)?.trim() ?? "";

    if (!firstName || !lastName || !email || !message) {
      return { error: "Please fill in all required fields." };
    }

    await sendContactEmail({ firstName, lastName, email, phone, message });
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
    const lastName = (formData.get("lastName") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const topic = (formData.get("topic") as string)?.trim() ?? "";
    const date = (formData.get("date") as string)?.trim() ?? "";
    const message = (formData.get("message") as string)?.trim() ?? "";

    if (!firstName || !lastName || !email || !message) {
      return { error: "Please fill in all required fields." };
    }

    await sendBookingEmail({ firstName, lastName, email, topic, date, message });
    return { success: true };
  } catch (err) {
    console.error("submitBookingForm error:", err);
    return { error: "Failed to send request. Please try again." };
  }
}
