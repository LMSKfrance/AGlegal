"use client";

import cn from "classnames";
import { useActionState } from "react";
import styles from "./contact-form.module.css";
import TextField from "../TextField";
import TextArea from "../TextArea";
import { submitContactForm, type FormState } from "@/lib/actions/forms";

type ContactFormProps = {
  className?: string;
};

const INITIAL: FormState = {};

const ContactForm = ({ className }: ContactFormProps) => {
  const [state, formAction, pending] = useActionState(submitContactForm, INITIAL);

  if (state.success) {
    return (
      <div className={cn(styles.form, className, styles.success_state)}>
        <p className="paragraph-medium">
          Thank you for your message. We will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn(styles.form, className)}>
      {state.error && (
        <p className={styles.form_error}>{state.error}</p>
      )}
      <div className={styles.form_group_fields}>
        <TextField label="First name" placeholder="First name" name="firstName" size="medium" />
        <TextField label="Last name" placeholder="Last name" name="lastName" size="medium" />
      </div>
      <div className={styles.form_group_fields}>
        <TextField
          label="Email address"
          placeholder="Email address"
          name="email"
          type="email"
          size="medium"
        />
        <TextField
          label="Phone number"
          placeholder="Phone number"
          name="phone"
          type="tel"
          size="medium"
        />
      </div>

      <TextArea label="Message" placeholder="Message" name="message" />

      <button className={cn("button", styles.form_button)} disabled={pending}>
        {pending ? "SENDING…" : "SUBMIT"}
      </button>
    </form>
  );
};

export default ContactForm;
