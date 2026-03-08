import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import type { Service } from "@/lib/types/service";

type HeroProps = {
  service: Service;
};

const Hero = ({ service }: HeroProps) => {
  return (
    <section className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <div className={styles.title_wrapper}>
          <h3 className={cn("heading-1", styles.title)}>{service?.title}.</h3>
          <p className={cn("paragraph-x-large", styles.description)}>
            {service?.text1}
          </p>
          <p className={cn("paragraph-x-large", styles.description)}>
            {service?.text2}
          </p>
        </div>

        <div className={styles.image_wrapper}>
          <Image
            src={service?.image}
            alt={service?.title}
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className={styles.content_wrapper}>
          <div className={styles.content_quote}>
            <div>
              <div className={styles.quote_divider} />
              <p className={cn("heading-6", styles.quote)}>{service?.quote}</p>
            </div>

            <div className={styles.thumbnail_image}>
              <Image
                src={service?.thumbnail_image}
                alt={service?.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          <div className={styles.content}>
            <p className={cn("paragraph-medium", styles.text)}>
              {
                "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you're starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support. We offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant."
              }
            </p>
            <p className={cn("paragraph-x-large", styles.text_bold)}>
              Incorporation & structuring
            </p>
            <p className={cn("paragraph-medium", styles.text)}>
              {
                "Choosing the right structure for your business is a critical decision that impacts everything from taxation to liability protection. We assist clients in selecting the optimal entity—be it a sole proprietorship, partnership, corporation, or limited liability company (LLC)—tailored to your goals, industry, and long-term vision."
              }
            </p>
            <p className={cn("paragraph-medium", styles.text)}>
              {
                "Our services include step-by-step guidance to form your business entity, handling all the legal paperwork and ensuring compliance with state and federal regulations. We also provide expert advice on the advantages and disadvantages of different entity types, helping you choose one that aligns with your business model and financial objectives."
              }
            </p>
            <p className={cn("paragraph-medium", styles.text)}>
              {
                "Additionally, we assist in drafting foundational documents such as operating agreements and bylaws to ensure clarity and stability for future growth."
              }
            </p>
            <p className={cn("paragraph-x-large", styles.text_bold)}>
              Contracts & agreements
            </p>

            <p className={cn("paragraph-medium", styles.text)}>
              {
                "A well-drafted contract is the backbone of any successful business relationship. Our attorneys are skilled in creating and reviewing a wide range of contracts, ensuring that your agreements are legally sound, enforceable, and in your best interest."
              }
            </p>
            <p className={cn("paragraph-medium", styles.text)}>
              {
                "We help draft, review, and negotiate commercial contracts that govern your business relationships with clients, suppliers, employees, and partners."
              }
            </p>
            <p className={cn("paragraph-medium", styles.text)}>
              {
                "This includes sales contracts, service agreements, and non-disclosure agreements (NDAs). We also assist in drafting clear and fair employment agreements that protect both your business and employees, covering topics like compensation, non-compete clauses, and intellectual property rights."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
