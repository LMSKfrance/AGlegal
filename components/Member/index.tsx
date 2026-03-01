import cn from "classnames";
import styles from "./member.module.css";
import Image from "next/image";

type MemberProps = {
  member: {
    title: string;
    position: string;
    description: string;
    image: string;
    socials: {
      id: number;
      name: string;
      icon: React.ReactNode;
      link: string;
    }[];
  };
};

const Member = ({ member }: MemberProps) => {
  return (
    <div className={styles.member}>
      <div className={styles.member_image}>
        <Image
          src={member.image}
          alt="Attorney"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className={styles.member_content}>
        <h6 className={cn("paragraph-x-large", styles.member_name)}>
          {member.title}
        </h6>
        <p className={cn("paragraph-medium", styles.member_position)}>
          {member.position}
        </p>

        <p className={cn("paragraph-small", styles.member_description)}>
          {member.description}
        </p>

        <div className={styles.member_socials}>
          {member.socials.map((social) => (
            <a
              key={social.id}
              className={styles.member_social}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Member;
