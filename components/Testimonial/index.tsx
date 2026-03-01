import React from "react";
import cn from "classnames";
import styles from "./testimonial.module.css";
import Image from "next/image";
import icons from "@/constants/icons";

type TestimonialProps = {
  testimonial: {
    quote: string;
    author_image: string;
    author_name: string;
    author_position: string;
  };
};

const Testimonial = ({ testimonial }: TestimonialProps) => {
  return (
    <div className={styles.testimonial}>
      <div className={styles.testimonial_icon}>{icons.Quotation}</div>

      <div className={cn("paragraph-x-large", styles.testimonial_quote)}>
        {testimonial.quote}
      </div>

      <div className={styles.testimonial_author}>
        <div className={styles.testimonial_author_image}>
          <Image
            src={testimonial.author_image}
            alt="Testimonial author"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <div
            className={cn("paragraph-medium", styles.testimonial_author_name)}
          >
            {testimonial.author_name}
          </div>
          <div
            className={cn(
              "paragraph-small",
              styles.testimonial_author_position,
            )}
          >
            {testimonial.author_position}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
