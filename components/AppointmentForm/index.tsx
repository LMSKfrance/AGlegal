"use client";

import cn from "classnames";
import { useActionState, useState, useCallback } from "react";
import styles from "./appointment-form.module.css";
import TextArea from "../TextArea";
import TextField from "../TextField";
import Dropdown from "../Dropdown";
import mock from "@/constants/mock";
import DatePicker from "../DatePicker";
import { submitBookingForm, type FormState } from "@/lib/actions/forms";

type AppointmentFormProps = {
  className?: string;
};

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  date: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "First name is required.";
  if (!v.lastName.trim()) e.lastName = "Last name is required.";
  if (!v.email.trim()) {
    e.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
    e.email = "Please enter a valid email address.";
  }
  if (!v.message.trim()) e.message = "Message is required.";
  return e;
}

const INITIAL_STATE: FormState = {};
const INITIAL_VALUES: Values = { firstName: "", lastName: "", email: "", topic: "1", date: "", message: "" };

const AppointmentForm = ({ className }: AppointmentFormProps) => {
  const { topics } = mock;
  const [state, formAction, pending] = useActionState(submitBookingForm, INITIAL_STATE);
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Set<keyof Values>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validate(values);
  const hasErrors = Object.keys(errors).length > 0;

  const showError = useCallback(
    (field: keyof Values) => (touched.has(field) || submitAttempted) ? errors[field] : undefined,
    [touched, submitAttempted, errors]
  );

  const handleChange = (field: keyof Values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        <h6 className={cn("heading-6", styles.form_title)}>Request received!</h6>
        <p className={cn("paragraph-medium", styles.success_text)}>
          Thank you for reaching out. We&apos;ll confirm your consultation shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className={cn(styles.form, className)} noValidate>
      <h6 className={cn("heading-6", styles.form_title)}>
        Schedule your consultation.
      </h6>
      <p className={cn("paragraph-medium", styles.form_description)}>
        Take the first step towards resolving your legal matters with a
        personalized consultation.
      </p>

      <div className={styles.form_group}>
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
            label="First name"
            placeholder="First name"
            name="firstName"
            size="medium"
            value={values.firstName}
            onChange={handleChange("firstName")}
            onBlur={handleBlur("firstName")}
            error={showError("firstName")}
          />
          <TextField
            label="Last name"
            placeholder="Last name"
            name="lastName"
            size="medium"
            value={values.lastName}
            onChange={handleChange("lastName")}
            onBlur={handleBlur("lastName")}
            error={showError("lastName")}
          />
        </div>

        <TextField
          label="Email address"
          placeholder="Email address"
          name="email"
          type="email"
          size="medium"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          error={showError("email")}
        />

        <Dropdown
          label="Topic"
          placeholder="Corporate & business law"
          options={topics}
          name="topic"
          value={values.topic}
          onChange={handleChange("topic")}
          onBlur={handleBlur("topic")}
        />

        <DatePicker
          label="Date"
          placeholder="Select a date"
          name="date"
          value={values.date}
          onChange={handleChange("date")}
          onBlur={handleBlur("date")}
        />

        <TextArea
          label="Your message"
          placeholder="Your message"
          name="message"
          value={values.message}
          onChange={handleChange("message")}
          onBlur={handleBlur("message")}
          error={showError("message")}
        />

        <button className={cn("button", styles.form_button)} type="submit" disabled={pending}>
          {pending ? "SENDING…" : "SUBMIT"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
