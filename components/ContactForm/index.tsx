"use client";

import cn from "classnames";
import { useActionState, useState, useCallback } from "react";
import styles from "./contact-form.module.css";
import TextField from "../TextField";
import TextArea from "../TextArea";
import { submitContactForm, type FormState } from "@/lib/actions/forms";
import { useLanguage } from "@/contexts/LanguageContext";

type ContactFormProps = {
  className?: string;
};

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const i18n = {
  en: {
    firstName: "First name", lastName: "Last name", email: "Email address",
    phone: "Phone number", message: "Message", submit: "SUBMIT", sending: "SENDING…",
    successTitle: "Message sent!",
    successText: "Thank you for reaching out. We'll get back to you as soon as possible.",
    errFirstName: "First name is required.",
    errLastName: "Last name is required.",
    errEmailRequired: "Email address is required.",
    errEmailInvalid: "Please enter a valid email address.",
    errPhone: "Please enter a valid phone number.",
    errMessage: "Message is required.",
  },
  ka: {
    firstName: "სახელი", lastName: "გვარი", email: "ელ.ფოსტა",
    phone: "ტელეფონის ნომერი", message: "შეტყობინება", submit: "გაგზავნა", sending: "იგზავნება…",
    successTitle: "შეტყობინება გაიგზავნა!",
    successText: "გმადლობთ მოგვმართვისთვის. ჩვენ მალე დაგიკავშირდებით.",
    errFirstName: "სახელი სავალდებულოა.",
    errLastName: "გვარი სავალდებულოა.",
    errEmailRequired: "ელ.ფოსტა სავალდებულოა.",
    errEmailInvalid: "გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი.",
    errPhone: "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი.",
    errMessage: "შეტყობინება სავალდებულოა.",
  },
} as const;

type I18n = { errFirstName: string; errLastName: string; errEmailRequired: string; errEmailInvalid: string; errPhone: string; errMessage: string };

function validate(v: Values, t: I18n): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = t.errFirstName;
  if (!v.lastName.trim()) e.lastName = t.errLastName;
  if (!v.email.trim()) {
    e.email = t.errEmailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
    e.email = t.errEmailInvalid;
  }
  if (v.phone && !/^[+\d\s\-().]{7,}$/.test(v.phone)) {
    e.phone = t.errPhone;
  }
  if (!v.message.trim()) e.message = t.errMessage;
  return e;
}

const INITIAL_STATE: FormState = {};
const INITIAL_VALUES: Values = { firstName: "", lastName: "", email: "", phone: "", message: "" };

const ContactForm = ({ className }: ContactFormProps) => {
  const { locale } = useLanguage();
  const t = i18n[locale] ?? i18n.en;
  const [state, formAction, pending] = useActionState(submitContactForm, INITIAL_STATE);
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Set<keyof Values>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validate(values, t);
  const hasErrors = Object.keys(errors).length > 0;

  const showError = useCallback(
    (field: keyof Values) => (touched.has(field) || submitAttempted) ? errors[field] : undefined,
    [touched, submitAttempted, errors]
  );

  const handleChange = (field: keyof Values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const handleBlur = (field: keyof Values) => () => {
    setTouched((t) => new Set(t).add(field));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitAttempted(true);
    if (hasErrors) {
      e.preventDefault();
    }
  };

  if (state.success) {
    return (
      <div className={cn(styles.form, styles.success_state, className)}>
        <div className={styles.success_icon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="var(--ag-blue-800)" />
            <path d="M10 16.5l4.5 4.5 7.5-9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className={cn("heading-6", styles.success_title)}>{t.successTitle}</h3>
        <p className={cn("paragraph-medium", styles.success_text)}>{t.successText}</p>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className={cn(styles.form, className)} noValidate>
      {state.error && (
        <div className={styles.form_error_banner}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {state.error}
        </div>
      )}
      <div className={styles.form_group_fields}>
        <TextField
          label={t.firstName}
          placeholder={t.firstName}
          name="firstName"
          size="medium"
          value={values.firstName}
          onChange={handleChange("firstName")}
          onBlur={handleBlur("firstName")}
          error={showError("firstName")}
        />
        <TextField
          label={t.lastName}
          placeholder={t.lastName}
          name="lastName"
          size="medium"
          value={values.lastName}
          onChange={handleChange("lastName")}
          onBlur={handleBlur("lastName")}
          error={showError("lastName")}
        />
      </div>
      <div className={styles.form_group_fields}>
        <TextField
          label={t.email}
          placeholder={t.email}
          name="email"
          type="email"
          size="medium"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          error={showError("email")}
        />
        <TextField
          label={t.phone}
          placeholder={t.phone}
          name="phone"
          type="tel"
          size="medium"
          value={values.phone}
          onChange={handleChange("phone")}
          onBlur={handleBlur("phone")}
          error={showError("phone")}
        />
      </div>
      <TextArea
        label={t.message}
        placeholder={t.message}
        name="message"
        value={values.message}
        onChange={handleChange("message")}
        onBlur={handleBlur("message")}
        error={showError("message")}
      />
      <button className={cn("button", styles.form_button)} type="submit" disabled={pending}>
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
};

export default ContactForm;
