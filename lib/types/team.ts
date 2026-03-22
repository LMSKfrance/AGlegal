/**
 * Team member types – template for DB-backed team pages.
 * Use these interfaces when migrating to a database (e.g. Prisma, Drizzle).
 */

export interface TeamMemberSocial {
  id: number | string;
  name: string;
  platform: "linkedin" | "twitter";
  link: string;
}

/** DB row shape – adjust to match your schema */
export interface TeamMemberDbRow {
  id: string | number;
  slug: string;
  title: string;
  position: string;
  description: string;
  quote: string;
  text1: string;
  text2: string;
  image: string;
  imageUrl?: string;
  socials?: Array<{
    id: number | string;
    name: string;
    platform?: string;
    link: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

import type { ReactNode } from "react";

/** View model used by team member page components */
export interface TeamMember {
  id: number | string;
  slug: string;
  title: string;
  position: string;
  description: string;
  quote: string;
  text1: string;
  text2: string;
  image: string;
  imagePosition?: "top" | "center" | "bottom";
  ogImage?: string | null;
  socials: Array<{
    id: number | string;
    name: string;
    icon?: ReactNode;
    link: string;
  }>;
}
