import React from "react";
import Link from "next/link";
import cn from "classnames";

/**
 * AG Legal mini logo (45×30) – Figma node 8324-7948.
 * Use in footer; color controlled via CSS (e.g. gray-900 for footer).
 * Design system: logo_mini
 */
export type LogoMiniProps = {
  className?: string;
  /** When true, render as span (no link). Default: false. */
  static?: boolean;
};

const LogoSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="30"
    viewBox="0 0 45 30"
    fill="none"
    aria-hidden
    style={{ display: "block" }}
  >
    <g clipPath="url(#clip0_logo_mini)">
      <path
        d="M23.6584 0.00976562C19.3984 0.0489442 15.1553 0.638791 11.0074 1.76847L11.9603 7.18699C15.3652 6.15497 18.8638 5.59869 22.382 5.52992C25.4945 5.52992 27.7239 6.26191 27.8987 9.11856C25.2335 8.46325 22.5181 8.12266 19.794 8.10196C14.8979 8.10196 9.55603 9.51504 9.55603 15.2182C9.55603 20.1182 13.1144 21.8058 17.7744 21.8058C21.3223 21.8531 24.8169 20.8004 27.8987 18.756V21.3585H34.7095V10.8061C34.7095 2.89692 31.1074 0.00976562 23.6584 0.00976562ZM27.8987 15.1978C25.3269 15.734 22.7277 16.0736 20.1176 16.2144C17.5646 16.2144 16.6816 15.7672 16.6816 14.5879C16.6816 13.4086 17.8094 12.9003 20.8082 12.9003C23.1825 12.9439 25.5514 13.1748 27.8987 13.5916V15.1978Z"
        fill="currentColor"
      />
      <path
        d="M6.82825 0.680664H0V29.8267H6.82825V0.680664Z"
        fill="currentColor"
      />
      <path
        d="M45 0.680664H38.1718V29.9894H45V0.680664Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_logo_mini">
        <rect width="45" height="30" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const LogoMini = ({ className, static: isStatic }: LogoMiniProps) => {
  const content = <LogoSvg />;
  if (isStatic) {
    return <span className={cn(className)} aria-label="AG Legal">{content}</span>;
  }
  return (
    <Link
      href="/"
      className={cn(className)}
      aria-label="AG Legal – Home"
    >
      {content}
    </Link>
  );
};

export default LogoMini;
