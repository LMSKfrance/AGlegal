import cn from "classnames";
import styles from "./member.module.css";
import Image from "next/image";
import Link from "next/link";

import type { TeamMember } from "@/lib/types/team";

type MemberProps = {
  member: Pick<TeamMember, "slug" | "title" | "position" | "description" | "image" | "socials">;
};

const Member = ({ member }: MemberProps) => {
  const content = (
    <>
      <div className={styles.member_image}>
        <Image
          src={member.image}
          alt={member.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.member_content}>
        <h6 className={cn("paragraph-x-large", styles.member_name)}>
          {member.title}
        </h6>
        <p className={cn("paragraph-medium", styles.member_position)}>
          {member.position}
        </p>

        <div className={styles.member_socials}>
          {member.socials.map((social) => (
            <span
              key={social.id}
              className={styles.member_social}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(social.link, "_blank", "noopener,noreferrer");
              }}
            >
              {social.icon}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (member.slug) {
    return (
      <Link href={`/team/${member.slug}`} className={styles.member}>
        {content}
      </Link>
    );
  }

  return <div className={styles.member}>{content}</div>;
};

export default Member;
