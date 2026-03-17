import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ─── Articles (News / Blog) ─────────────────────────────────────────────────
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleKa: text("title_ka"),
  descriptionEn: text("description_en"),
  descriptionKa: text("description_ka"),
  contentEn: text("content_en"),
  contentKa: text("content_ka"),
  image: text("image"),
  date: text("date").notNull(),
  time: text("time"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  type: text("type"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Services ────────────────────────────────────────────────────────────────
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleKa: text("title_ka"),
  descriptionEn: text("description_en"),
  descriptionKa: text("description_ka"),
  text1En: text("text1_en"),
  text1Ka: text("text1_ka"),
  text2En: text("text2_en"),
  text2Ka: text("text2_ka"),
  quoteEn: text("quote_en"),
  quoteKa: text("quote_ka"),
  image: text("image"),
  thumbnailImage: text("thumbnail_image"),
  sortOrder: integer("sort_order").default(0),
  // Homepage-specific fields for the \"Our legal services\" cards
  showOnHome: integer("show_on_home").default(0),
  homeOrder: integer("home_order").default(0),
  homeShortDescriptionEn: text("home_short_description_en"),
  homeShortDescriptionKa: text("home_short_description_ka"),
  homeLearnMoreUrl: text("home_learn_more_url"),
  homeCardImage: text("home_card_image"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Team Members ────────────────────────────────────────────────────────────
export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleKa: text("title_ka"),
  positionEn: text("position_en"),
  positionKa: text("position_ka"),
  descriptionEn: text("description_en"),
  descriptionKa: text("description_ka"),
  quoteEn: text("quote_en"),
  quoteKa: text("quote_ka"),
  text1En: text("text1_en"),
  text1Ka: text("text1_ka"),
  text2En: text("text2_en"),
  text2Ka: text("text2_ka"),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
  showOnHome: integer("show_on_home").default(0),
  homeOrder: integer("home_order").default(0),
  showOnAbout: integer("show_on_about").default(0),
  aboutOrder: integer("about_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Team Member Socials ─────────────────────────────────────────────────────
export const teamMemberSocials = sqliteTable("team_member_socials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamMemberId: integer("team_member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  link: text("link").notNull(),
});

// ─── FAQs ────────────────────────────────────────────────────────────────────
export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionEn: text("question_en").notNull(),
  questionKa: text("question_ka"),
  answerEn: text("answer_en").notNull(),
  answerKa: text("answer_ka"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Testimonials ────────────────────────────────────────────────────────────
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteEn: text("quote_en").notNull(),
  quoteKa: text("quote_ka"),
  authorName: text("author_name").notNull(),
  authorPosition: text("author_position"),
  authorImage: text("author_image"),
  row: text("row").default("top"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Homepage Benefits (Why work with us?) ───────────────────────────────────
export const homeBenefits = sqliteTable("home_benefits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleEn: text("title_en").notNull(),
  titleKa: text("title_ka"),
  descriptionEn: text("description_en"),
  descriptionKa: text("description_ka"),
  iconPath: text("icon_path"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Homepage Process Steps (tabs) ───────────────────────────────────────────
export const homeProcessSteps = sqliteTable("home_process_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tabTitleEn: text("tab_title_en").notNull(),
  tabTitleKa: text("tab_title_ka"),
  titleEn: text("title_en").notNull(),
  titleKa: text("title_ka"),
  descriptionEn: text("description_en"),
  descriptionKa: text("description_ka"),
  image: text("image"),
  stepNumber: text("step_number"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

//  Site Settings (key/value for UI strings, page sections, etc.) 
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  valueEn: text("value_en"),
  valueKa: text("value_ka"),
  group: text("group"),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

//  Contact Settings (address, contact info, social links) 
export const contactSettings = sqliteTable("contact_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titleEn: text("title_en"),
  titleKa: text("title_ka"),
  subtitleEn: text("subtitle_en"),
  subtitleKa: text("subtitle_ka"),
  addressEn: text("address_en"),
  addressKa: text("address_ka"),
  email: text("email"),
  phone: text("phone"),
  secondaryPhone: text("secondary_phone"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  xUrl: text("x_url"),
  mapEmbedUrl: text("map_embed_url"),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

//  Pages (editable CMS pages: About, Contact, etc.) 
export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleKa: text("title_ka"),
  contentEn: text("content_en"),
  contentKa: text("content_ka"),
  metaDescriptionEn: text("meta_description_en"),
  metaDescriptionKa: text("meta_description_ka"),
  seoTitleEn: text("seo_title_en"),
  seoTitleKa: text("seo_title_ka"),
  ogTitleEn: text("og_title_en"),
  ogTitleKa: text("og_title_ka"),
  ogDescriptionEn: text("og_description_en"),
  ogDescriptionKa: text("og_description_ka"),
  ogImage: text("og_image"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Save History ─────────────────────────────────────────────────────────────
export const saveHistory = sqliteTable("save_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  section: text("section").notNull(),
  label: text("label").notNull(),
  action: text("action").notNull(), // "created" | "updated" | "deleted"
  savedAt: text("saved_at").notNull().$defaultFn(() => new Date().toISOString()),
});
export type SaveHistoryEntry = typeof saveHistory.$inferSelect;

// ─── Type exports for convenience ────────────────────────────────────────────
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type TeamMemberSocial = typeof teamMemberSocials.$inferSelect;
export type NewTeamMemberSocial = typeof teamMemberSocials.$inferInsert;
export type Faq = typeof faqs.$inferSelect;
export type NewFaq = typeof faqs.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
export type HomeBenefit = typeof homeBenefits.$inferSelect;
export type NewHomeBenefit = typeof homeBenefits.$inferInsert;
export type HomeProcessStep = typeof homeProcessSteps.$inferSelect;
export type NewHomeProcessStep = typeof homeProcessSteps.$inferInsert;
export type ContactSettings = typeof contactSettings.$inferSelect;
export type NewContactSettings = typeof contactSettings.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
