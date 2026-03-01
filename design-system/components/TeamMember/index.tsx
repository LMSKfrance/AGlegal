import React from "react";
import cn from "classnames";
import styles from "./team-member.module.css";

export type SocialLink = {
  icon: React.ReactNode;
  href: string;
  label: string;
};

export type TeamMemberProps = {
  name: string;
  role: string;
  bio?: string;
  photo?: React.ReactNode;
  socials?: SocialLink[];
  className?: string;
};

const TeamMember = ({
  name,
  role,
  bio,
  photo,
  socials,
  className,
}: TeamMemberProps) => {
  return (
    <div className={cn(styles.card, className)}>
      {photo && <div className={styles.photo}>{photo}</div>}

      <div className={styles.info}>
        <div className={styles.names}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.role}>{role}</span>
        </div>

        {bio && <p className={styles.bio}>{bio}</p>}

        {socials && socials.length > 0 && (
          <div className={styles.social}>
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className={styles["social-link"]}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMember;
