import React from "react";
import cn from "classnames";
import styles from "./play-button.module.css";

export type PlayButtonSize = "sm" | "md" | "lg";

export type PlayButtonProps = {
  onClick?: () => void;
  size?: PlayButtonSize;
  label?: string;
  className?: string;
};

const PlayIcon = ({ size }: { size: PlayButtonSize }) => {
  const dim = { sm: 18, md: 24, lg: 30 }[size];
  return (
    <svg width={dim} height={dim} viewBox="0 0 24 24" fill="none">
      <path d="M8 5.14v14l11-7-11-7z" fill="currentColor" />
    </svg>
  );
};

const PlayButton = ({
  onClick,
  size = "md",
  label = "Play video",
  className,
}: PlayButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(styles.btn, styles[`size-${size}`], className)}
    >
      <span className={styles.icon} aria-hidden>
        <PlayIcon size={size} />
      </span>
    </button>
  );
};

export default PlayButton;
