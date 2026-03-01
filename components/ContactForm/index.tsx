import cn from "classnames";
import styles from "./contact-form.module.css";
import TextField from "../TextField";
import TextArea from "../TextArea";

type ContactFormProps = {
  className?: string;
};

const ContactForm = ({ className }: ContactFormProps) => {
  return (
    <form className={cn(styles.form, className)}>
      <div className={styles.form_group_fields}>
        <TextField label="First name" placeholder="First name" size="medium" />
        <TextField label="Last name" placeholder="Last name" size="medium" />
      </div>
      <div className={styles.form_group_fields}>
        <TextField
          label="Email address"
          placeholder="Email address"
          size="medium"
        />
        <TextField
          label="Phone number"
          placeholder="Phone number"
          size="medium"
        />
      </div>

      <TextArea label="Message" placeholder="Message" />

      <button className={cn("button", styles.form_button)}>SUBMIT</button>
    </form>
  );
};

export default ContactForm;
