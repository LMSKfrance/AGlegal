import { db } from "@/lib/db";
import {
  siteSettings,
  services,
  homeBenefits,
  homeProcessSteps,
  type HomeBenefit,
  type HomeProcessStep,
} from "@/lib/db/schema";
import { eq, inArray, asc } from "drizzle-orm";
import { truncateChars } from "@/lib/utils/text";
import { getHomeTeamMembers } from "@/lib/team";
import type { TeamMember } from "@/lib/types/team";

type Locale = "en" | "ka";

type HeroContent = {
  brand: string;
  title: string;
  cta: string;
  description: string;
  image: string;
};

type AboutContent = {
  title: string;
  description: string;
  image: string;
};

type ServiceCard = {
  id: number;
  image: string;
  title: string;
  description: string;
  slug: string;
  learnMoreUrl: string;
};

type BenefitCard = {
  id: number;
  iconPath: string | null;
  title: string;
  description: string;
};

type ProcessTab = {
  id: number;
  title: string;
  content: {
    title: string;
    description: string;
    image: string;
    number: string;
  };
};

export type HomeContent = {
  hero: HeroContent;
  about: AboutContent;
  servicesHeading: { title: string; description: string };
  benefitsHeading: { title: string };
  processHeading: { title: string; description: string };
  services: ServiceCard[];
  benefits: BenefitCard[];
  tabs: ProcessTab[];
  teamMembers: TeamMember[];
};

async function getSettingValue(key: string, locale: Locale): Promise<string> {
  const rows = await db
    .select({
      valueEn: siteSettings.valueEn,
      valueKa: siteSettings.valueKa,
    })
    .from(siteSettings)
    .where(eq(siteSettings.key, key));

  if (!rows.length) return "";
  const row = rows[0];
  const raw = locale === "ka" ? row.valueKa ?? row.valueEn : row.valueEn ?? row.valueKa;
  return raw ?? "";
}

export async function getHeroContent(locale: Locale): Promise<HeroContent> {
  const [brand, title, cta, description, image] = await Promise.all([
    getSettingValue("home_hero_brand", locale),
    getSettingValue("home_hero_title", locale),
    getSettingValue("home_hero_cta", locale),
    getSettingValue("home_hero_description", locale),
    getSettingValue("home_hero_image", locale),
  ]);

  return {
    brand: truncateChars(brand || "AG Legal Consulting", 40),
    title: truncateChars(
      title || "Your Trusted Legal\nAdvisors in Georgia",
      80,
    ),
    cta: truncateChars(cta || "CONSULT WITH US", 24),
    description: truncateChars(
      description ||
        "Join our mission to create a better tomorrow through legal and social support.",
      180,
    ),
    image: image || "/images/ag-legal.jpg",
  };
}

export async function getAboutContent(locale: Locale): Promise<AboutContent> {
  const [title, description, image] = await Promise.all([
    getSettingValue("home_about_title", locale),
    getSettingValue("home_about_description", locale),
    getSettingValue("home_about_image", locale),
  ]);

  return {
    title:
      truncateChars(
        title ||
          (locale === "ka" ? "ვინ ვართ ჩვენ" : "Who we are"),
        60,
      ),
    description: truncateChars(
      description ||
        (locale === "ka"
          ? "AG ლეგალური კონსალტინგი 2007 წლიდან უზრუნველყოფს ექსპერტულ სამართლებრივ რჩევას ბიზნესებისთვის და ინდივიდუალებს."
          : "AG Legal Consulting has been providing expert legal counsel to businesses and individuals since 2007."),
      260,
    ),
    image: image || "/images/ag-legal-video.jpg",
  };
}

export async function getHomeServicesHeading(locale: Locale) {
  const [title, description] = await Promise.all([
    getSettingValue("services.title", locale),
    getSettingValue("services.description", locale),
  ]);
  return {
    title: title || (locale === "ka" ? "ჩვენი სამართლებრივი მომსახურება" : "Our legal services"),
    description:
      description ||
      (locale === "ka"
        ? ""
        : "At AG Legal Consulting, we believe that great legal advice is built on trust, transparency, and a strong dedication to delivering exceptional outcomes."),
  };
}

export async function getHomeBenefitsHeading(locale: Locale) {
  const title = await getSettingValue("benefits.title", locale);
  return {
    title: title || (locale === "ka" ? "რატომ ვმუშაობთ ჩვენთან?" : "Why work with us?"),
  };
}

export async function getHomeProcessHeading(locale: Locale) {
  const [title, description] = await Promise.all([
    getSettingValue("process.title", locale),
    getSettingValue("process.description", locale),
  ]);
  return {
    title: title || (locale === "ka" ? "ჩვენი სამუშაო პროცესი" : "Our working process"),
    description:
      description ||
      (locale === "ka"
        ? ""
        : "We follow a streamlined process to ensure your legal matters are handled efficiently and effectively, keeping you informed every step of the way."),
  };
}

export async function getHomeServicesCards(locale: Locale): Promise<ServiceCard[]> {
  const rows = await db
    .select()
    .from(services)
    .where(eq(services.showOnHome, 1))
    .orderBy(asc(services.homeOrder), asc(services.sortOrder), asc(services.id));

  return rows.map((row) => {
    const title = locale === "ka" ? row.titleKa ?? row.titleEn : row.titleEn ?? row.titleKa ?? "";
    const descriptionSource =
      locale === "ka"
        ? row.homeShortDescriptionKa ?? row.descriptionKa ?? row.descriptionEn
        : row.homeShortDescriptionEn ?? row.descriptionEn ?? row.descriptionKa;

    const description = truncateChars(descriptionSource ?? "", 160);

    const image = row.homeCardImage ?? row.image ?? "/images/ag-legal.jpg";
    const learnMoreUrl =
      row.homeLearnMoreUrl && row.homeLearnMoreUrl.trim().length > 0
        ? row.homeLearnMoreUrl.trim()
        : row.slug
          ? `/services/${row.slug}`
          : "/services";

    return {
      id: row.id,
      image,
      title,
      description,
      slug: row.slug,
      learnMoreUrl,
    };
  });
}

export async function getHomeBenefits(locale: Locale): Promise<BenefitCard[]> {
  const rows: HomeBenefit[] = await db
    .select()
    .from(homeBenefits)
    .orderBy(asc(homeBenefits.sortOrder), asc(homeBenefits.id));

  return rows.map((row) => {
    const title = locale === "ka" ? row.titleKa ?? row.titleEn : row.titleEn ?? row.titleKa ?? "";
    const descriptionSource =
      locale === "ka" ? row.descriptionKa ?? row.descriptionEn : row.descriptionEn ?? row.descriptionKa;
    const description = truncateChars(descriptionSource ?? "", 220);

    return {
      id: row.id,
      iconPath: row.iconPath,
      title,
      description,
    };
  });
}

export async function getHomeProcessSteps(locale: Locale): Promise<ProcessTab[]> {
  const rows: HomeProcessStep[] = await db
    .select()
    .from(homeProcessSteps)
    .orderBy(asc(homeProcessSteps.sortOrder), asc(homeProcessSteps.id));

  return rows.map((row, index) => {
    const title =
      locale === "ka" ? row.tabTitleKa ?? row.tabTitleEn : row.tabTitleEn ?? row.tabTitleKa ?? "";
    const contentTitle =
      locale === "ka" ? row.titleKa ?? row.titleEn : row.titleEn ?? row.titleKa ?? "";
    const descriptionSource =
      locale === "ka" ? row.descriptionKa ?? row.descriptionEn : row.descriptionEn ?? row.descriptionKa;
    const description = truncateChars(descriptionSource ?? "", 260);
    const image = row.image ?? "/images/process/consultation.jpg";
    const number = row.stepNumber || String(index + 1).padStart(2, "0");

    return {
      id: row.id,
      title,
      content: {
        title: contentTitle,
        description,
        image,
        number,
      },
    };
  });
}

// ─── Home section visibility (read-only; mutations live in lib/actions/home) ───

export const HOME_SECTION_IDS = [
  "hero",
  "about",
  "services",
  "benefits",
  "process",
  "team",
  "news",
  "cta",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export type HomeSectionVisibility = Record<HomeSectionId, boolean>;

export async function getHomeSectionVisibility(): Promise<HomeSectionVisibility> {
  const keys = HOME_SECTION_IDS.map((id) => `home.section.${id}.visible`);
  const values = await Promise.all(keys.map((key) => getSettingValue(key, "en")));
  const result = {} as HomeSectionVisibility;
  const parse = (v: string) => v === "1" || v === "true" || v === "";
  HOME_SECTION_IDS.forEach((id, i) => {
    result[id] = parse(values[i] ?? "1");
  });
  return result;
}

export async function getHomeContent(locale: Locale): Promise<HomeContent> {
  const [hero, about, servicesHeading, benefitsHeading, processHeading, servicesCards, benefits, tabs, teamMembers] =
    await Promise.all([
      getHeroContent(locale),
      getAboutContent(locale),
      getHomeServicesHeading(locale),
      getHomeBenefitsHeading(locale),
      getHomeProcessHeading(locale),
      getHomeServicesCards(locale),
      getHomeBenefits(locale),
      getHomeProcessSteps(locale),
      getHomeTeamMembers(locale),
    ]);

  return {
    hero,
    about,
    servicesHeading,
    benefitsHeading,
    processHeading,
    services: servicesCards,
    benefits,
    tabs,
    teamMembers,
  };
}

