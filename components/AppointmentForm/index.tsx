"use client";

import cn from "classnames";
import { useActionState } from "react";
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

const INITIAL: FormState = {};

const AppointmentForm = ({ className }: AppointmentFormProps) => {
  const { topics } = mock;
  const [state, formAction, pending] = useActionState(submitBookingForm, INITIAL);

  if (state.success) {
    return (
      <div className={cn(styles.form, className, styles.success_state)}>
        <h6 className={cn("heading-6", styles.form_title)}>Request received!</h6>
        <p className={cn("paragraph-medium", styles.form_description)}>
          Thank you for reaching out. We will confirm your consultation shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn(styles.form, className)}>
      <h6 className={cn("heading-6", styles.form_title)}>
        Schedule your consultation.
      </h6>
      <p className={cn("paragraph-medium", styles.form_description)}>
        Take the first step towards resolving your legal matters with a
        personalized consultation.
      </p>

      <div className={styles.form_group}>
        {state.error && (
          <p className={styles.form_error}>{state.error}</p>
        )}

        <div className={styles.form_group_fields}>
          <TextField
            label="First name"
            placeholder="First name"
            name="firstName"
            size="medium"
          />
          <TextField label="Last name" placeholder="Last name" name="lastName" size="medium" />
        </div>

        <TextField
          label="Email address"
          placeholder="Email address"
          name="email"
          type="email"
          size="medium"
        />

        <Dropdown
          label="Topic"
          placeholder="Corporate & business law"
          options={topics}
          name="topic"
        />

        <DatePicker label="Date" placeholder="Corporate & business law" name="date" />

        <TextArea label="Your message" placeholder="Your message" name="message" />

        <button className={cn("button", styles.form_button)} disabled={pending}>
          {pending ? "SENDING…" : "SUBMIT"}
        </button>

      </div>
    </form>
  );
};

export default AppointmentForm;
