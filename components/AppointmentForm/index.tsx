import cn from "classnames";
import styles from "./appointment-form.module.css";
import TextArea from "../TextArea";
import TextField from "../TextField";
import Dropdown from "../Dropdown";
import mock from "@/constants/mock";
import DatePicker from "../DatePicker";

type AppointmentFormProps = {
  className?: string;
};

const AppointmentForm = ({ className }: AppointmentFormProps) => {
  const { topics } = mock;

  return (
    <form className={cn(styles.form, className)}>
      <h6 className={cn("heading-6", styles.form_title)}>
        Schedule your consultation.
      </h6>
      <p className={cn("paragraph-medium", styles.form_description)}>
        Take the first step towards resolving your legal matters with a
        personalized consultation.
      </p>

      <div className={styles.form_group}>
        <div className={styles.form_group_fields}>
          <TextField
            label="First name"
            placeholder="First name"
            size="medium"
          />
          <TextField label="Last name" placeholder="Last name" size="medium" />
        </div>

        <TextField
          label="Email address"
          placeholder="Email address"
          size="medium"
        />

        <Dropdown
          label="Topic"
          placeholder="Corporate & business law"
          options={topics}
        />

        <DatePicker label="Date" placeholder="Corporate & business law" />

        <TextArea label="Your message" placeholder="Your message" />

        <button className={cn("button", styles.form_button)}>SUBMIT</button>

        <p className={cn("paragraph-x-small", styles.form_text)}>
          Support center 24/7
        </p>
      </div>
    </form>
  );
};

export default AppointmentForm;
