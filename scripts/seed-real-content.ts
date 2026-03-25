/**
 * Seed AG Legal real content into Turso DB.
 * Idempotent – safe to run on every deploy (uses upsert/update patterns).
 * Run: node --env-file=.env.local --import=tsx scripts/seed-real-content.ts
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });
const now = new Date().toISOString();

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsertSetting(key: string, valueEn: string | null, valueKa: string | null, group: string) {
  const existing = await db.select({ id: schema.siteSettings.id }).from(schema.siteSettings).where(eq(schema.siteSettings.key, key));
  if (existing.length) {
    await db.update(schema.siteSettings).set({ valueEn, valueKa, updatedAt: now }).where(eq(schema.siteSettings.key, key));
  } else {
    await db.insert(schema.siteSettings).values({ key, valueEn, valueKa, group, updatedAt: now });
  }
  console.log("  ✓ setting:", key);
}

async function updateMember(slug: string, fields: Partial<typeof schema.teamMembers.$inferInsert>) {
  await db.update(schema.teamMembers).set({ ...fields, updatedAt: now }).where(eq(schema.teamMembers.slug, slug));
  console.log("  ✓ member:", slug);
}

// ─── 1. Homepage settings ─────────────────────────────────────────────────────

async function seedHomepage() {
  console.log("\n── Homepage settings ──");

  // Hero
  await upsertSetting("home_hero_brand", "AG Legal Consulting", "AG Legal Consulting", "home");
  await upsertSetting(
    "home_hero_title",
    "AG Legal Consulting: Your Trusted Legal Advisors in Georgia",
    "AG Legal Consulting: შენი სანდო მრჩეველი საქართველოში",
    "home",
  );
  await upsertSetting(
    "home_hero_description",
    "AG Legal Consulting has been providing expert legal counsel to businesses and individuals since 2007. With years of experience and a strong reputation, our team is dedicated to being your trusted advisor, offering clear and effective guidance through any legal challenges.",
    "AG Legal Consulting 2007 წლიდან იურიდიულ მომსახურებას უწევს ბიზნესსა და ფიზიკურ პირებს. მრავალწლიანი გამოცდილებითა და სანდო რეპუტაციით, ჩვენი გუნდი მზად არის გახდეს თქვენი სანდო მრჩეველი და შემოგთავაზოთ სრული იურიდიული მომსახურება ნებისმიერ სამართლებრივ საკითხზე.",
    "home",
  );
  await upsertSetting("home_hero_cta", "Consult with Us", "დაგვიკავშირდით", "home");

  // About section (homepage mini-block)
  await upsertSetting("home_about_title", "AG Legal Consulting", "AG Legal Consulting", "home");
  await upsertSetting(
    "home_about_description",
    "Founded in Tbilisi, Georgia, in 2007. AG Legal Consulting was established as DAG Legal Consulting and rebranded in 2013. From the very beginning, we've been privileged to provide legal services to numerous leading companies.",
    "კომპანია დაფუძნდა 2007 წელს, თბილისი, საქართველო. კომპანია ოპერირებდა, როგორც DAG Legal Consulting და 2013 წლიდან გადაერქვა AG Legal Consulting. დაარსების დღიდან ჩვენთვის პატივი იყო მომსახურება გაგვეწია მრავალი წამყვანი კომპანიისთვის.",
    "home",
  );

  // CTA banner
  await upsertSetting("home_cta_subtitle", "AG Legal Consulting", "AG Legal Consulting", "home");
  await upsertSetting(
    "home_cta_title",
    "Your Trusted Legal Advisors in Georgia",
    "შენი სანდო მრჩეველი საქართველოში",
    "home",
  );
  await upsertSetting("home_cta_button", "Consult with Us", "დაგვიკავშირდით", "home");
  await upsertSetting("home_cta_button_url", "/appointment", "/appointment", "home");
}

// ─── 2. About page ────────────────────────────────────────────────────────────

async function seedAboutPage() {
  console.log("\n── About page ──");

  // pages table – slug "about"
  const existing = await db.select({ id: schema.pages.id }).from(schema.pages).where(eq(schema.pages.slug, "about"));
  const aboutFields = {
    titleEn: "Your Trusted Legal Advisors in Georgia.",
    titleKa: "შენი სანდო მრჩეველი საქართველოში.",
    contentEn:
      "AG Legal Consulting was established in 2007 as DAG Legal Consulting and rebranded to its current name in 2013. From the very beginning, we've been privileged to provide legal services to numerous leading companies.\n\nOur team is a full-service law firm providing legal advice to businesses and individuals across various areas of civil and administrative law. We serve a wide range of clients, including local businesses, international corporations, organizations, and individuals. With years of experience, expertise, and dedication, we are fully equipped to tackle the most complex and challenging legal issues, always striving to achieve the best possible outcome for our clients.",
    contentKa:
      "კომპანია დაფუძნდა 2007 წელს, როგორც DAG Legal Consulting და 2013 წლიდან ოპერირებს, როგორც AG Legal Consulting. დაარსების დღიდან ჩვენთვის პატივი იყო მომსახურება გაგვეწია მრავალი წამყვანი კომპანიისთვის.\n\nჩვენი გუნდი ემსახურება ბიზნესსა და ფიზიკურ პირებს სამოქალაქო და ადმინისტრაციული სამართლის სხვადასხვა სფეროებში. ჩვენი კომპანია იურიდიულ მხარდაჭერას უწევს კლიენტთა ფართო სპექტრს, მათ შორის ადგილობრივ ბიზნესსა და ფიზიკურ პირებს. მრავალწლიანი გამოცდილების საფუძველზე, ჩვენ ვფლობთ ყველა საჭირო რესურსს, რათა გავუმკლავდეთ ნებისმიერი სირთულის სამართლებრივ გამოწვევას.",
    updatedAt: now,
  };
  if (existing.length) {
    await db.update(schema.pages).set(aboutFields).where(eq(schema.pages.slug, "about"));
  } else {
    await db.insert(schema.pages).values({ slug: "about", sortOrder: 0, createdAt: now, ...aboutFields });
  }
  console.log("  ✓ page: about");

  // About section settings
  await upsertSetting(
    "about.mission.title",
    "Our Core Value: Client-Centered Approach.",
    "ჩვენი მთავარი ღირებულება: კლიენტზე მორგებული მიდგომა.",
    "about",
  );
  await upsertSetting(
    "about.mission.description",
    "At AG Legal Consulting, we believe that great legal advice is built on trust, transparency, and a strong dedication to delivering exceptional outcomes.",
    "ჩვენ გვჯერა, რომ იურიდიული მომსახურება უნდა ეფუძნებოდეს ნდობას, ღიაობას და საუკეთესო შედეგების მიღწევისაკენ სწრაფვას.",
    "about",
  );
  await upsertSetting(
    "about.numbers.title",
    "Our legacy in numbers.",
    "ჩვენი მემკვიდრეობა რიცხვებში.",
    "about",
  );
  await upsertSetting(
    "about.numbers.description",
    "We're proud of the milestones we've achieved over the years, showcasing our commitment to excellence in every case we handle.",
    "ჩვენ ვამაყობთ წლების განმავლობაში მიღწეული შედეგებით, რომლებიც ასახავს ჩვენს ერთგულებას სრულყოფილებისადმი.",
    "about",
  );
  await upsertSetting(
    "about.features.title",
    "What sets us apart.",
    "რა განგვასხვავებს.",
    "about",
  );
  await upsertSetting(
    "about.philosophy.title",
    "A philosophy of integrity and dedication.",
    "მთლიანობისა და ერთგულების ფილოსოფია.",
    "about",
  );
  await upsertSetting(
    "about.philosophy.description",
    "At the heart of our legal practice lies an unwavering commitment to justice, transparency, and exceptional client service.",
    "ჩვენი სამართლებრივი პრაქტიკის გულში დევს მართლმსაჯულების, გამჭვირვალობის და კლიენტების მომსახურების ერთგულება.",
    "about",
  );
}

// ─── 3. Contact settings ──────────────────────────────────────────────────────

async function seedContact() {
  console.log("\n── Contact settings ──");

  const existing = await db.select({ id: schema.contactSettings.id }).from(schema.contactSettings);
  const contactFields = {
    titleEn: "Get in Touch",
    titleKa: "დაგვიკავშირდით",
    subtitleEn: "We're here to provide the legal support you need. Reach out today to discuss your case.",
    subtitleKa: "ჩვენ აქ ვართ, რომ მოგაწოდოთ სამართლებრივი მხარდაჭერა, რომელიც გჭირდებათ.",
    addressEn: "46B Iakob Gogebashvili Street, Entrance 2, Floor 1, Mtatsminda District, Tbilisi, Georgia",
    addressKa: "იაკობ გოგებაშვილის ქუჩა N46ბ, სადარბაზო მე-2, სართული 1, მთაწმინდის რ-ნი, თბილისი, საქართველო",
    phone: "+995 (32) 2 91 50 53",
    email: "daglegal@daglegal.ge",
    updatedAt: now,
  };
  if (existing.length) {
    await db.update(schema.contactSettings).set(contactFields).where(eq(schema.contactSettings.id, existing[0].id));
  } else {
    await db.insert(schema.contactSettings).values({ ...contactFields, createdAt: now });
  }
  console.log("  ✓ contactSettings updated");
}

// ─── 4. Team members ──────────────────────────────────────────────────────────

async function seedTeamMembers() {
  console.log("\n── Team members ──");

  await updateMember("vladimer-gabrielashvili", {
    titleEn: "Vladimer Gabrielashvili",
    positionEn: "Partner",
    descriptionEn: "Vladimer Gabrielashvili graduated from Tbilisi State University in Jurisprudence, earning a diploma from the Faculty of Law. He holds certificates in Civil Law from the Qualification Examination of Judges and the Bar Examination, as well as qualifications for Prosecutors.",
    text1En: "<p>Vladimer Gabrielashvili graduated from Tbilisi State University in Jurisprudence, earning a diploma from the Faculty of Law. He holds certificates in Civil Law from the Qualification Examination of Judges and the Bar Examination, as well as qualifications for Prosecutors.</p><p>He is currently a partner and senior lawyer at AG Legal Consulting, a position he has held since 2007. Prior to this, Vladimer served as the head of the Legal Department at Georgian Railway LLC from 2005 to 2007 and at Tbilisi City Hall in 2005.</p><p>Vladimer also has significant experience in government, having worked at the National Security Council of Georgia from 2004 to 2005, where he was a senior advisor in the Department of Policy Coordination against Corruption and the Department of State and Public Security. He previously spent several years at the High Council of Justice of Georgia, from 1998 to 2004, where he was the head of the Department of Legal Analysis and Statistics and served as a member of the Disciplinary Board of Judges of the General Courts of Georgia.</p><p>Vladimer speaks in Georgian, Russian and English.</p>",
    published: 1,
    showOnHome: 1,
    homeOrder: 1,
    sortOrder: 1,
  });

  await updateMember("dimitri-aleksidze", {
    titleEn: "Dimitri Aleksidze",
    positionEn: "Partner",
    descriptionEn: "Dimitri Aleksidze, a partner at AG Legal Consulting, has held key legal and executive positions across leading Georgian enterprises and public institutions.",
    text1En: "<p>Dimitri Aleksidze graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University and studied International Private Law at Paris 8 University. He began his career as a lawyer at the International Oil Corporation of Georgia. Since 2006, he has served as the general director of the joint-stock company \"Saktransgazmretsvi.\"</p><p>In 2008, Dimitri co-founded the law firm \"AG Legal Consulting\" (formerly known as DAG Legal Consulting), where he remains a partner. He has also served as an expert for the Human Rights Protection Center of the Supreme Court of Georgia and has participated in various international and local projects related to his expertise.</p><p>Since 2015, Dimitri has been managing a group of companies in the agro-business sector, focusing on the nut industry. He is a co-founder and board member of these companies. In 2023, he was elected as a supervisory member of the \"Institute for the Development of Freedom of Information\" (IDFI).</p><p>Dimitri speaks in Georgian, English, French, Italian, Russian, and Greek.</p>",
    published: 1,
    showOnHome: 1,
    homeOrder: 2,
    sortOrder: 2,
  });

  await updateMember("lika-galustashvili", {
    titleEn: "Lika Galustashvili",
    positionEn: "Senior Associate",
    descriptionEn: "Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property law, and contract law.",
    text1En: "<p>Lika Galustashvili graduated from the Faculty of Law at Ivane Javakhishvili Tbilisi State University, where she earned her LL.B. and LL.M. degrees in Private Law. She also completed part of her Master's studies at the University of La Coruna in Spain. Later, she pursued a Master's in European Studies at Ivane Javakhishvili Tbilisi State University, supported by a scholarship from the KONRAD ADENAUER Fund.</p><p>Lika began her career as a paralegal and gained valuable experience in both the private and public sectors, as well as with non-governmental organizations. Before joining AG Legal Consulting in 2020 as an associate, she worked at the National Bureau of Enforcement, where she developed a strong foundation in enforcement law.</p><p>At AG Legal Consulting, Lika specializes in civil and administrative law, with additional expertise in corporate law, intellectual property law, and contract law. She provides clients with comprehensive legal advice on corporate reorganization, restructuring, and employment matters. Lika is actively involved in M&amp;A and real estate transactions, drafting and analyzing legal documents, as well as representing clients in Georgia's courts and arbitration proceedings.</p><p>Lika is a member of the Georgian Bar Association and a certified attorney in civil and administrative law. She speaks in Georgian, English, Spanish and Russian.</p>",
    published: 1,
    showOnHome: 1,
    homeOrder: 3,
    sortOrder: 3,
  });

  await updateMember("nikoloz-abutidze", {
    titleEn: "Nikoloz Abutidze",
    positionEn: "Senior Associate",
    descriptionEn: "Nikoloz Abutidze, a licensed insolvency practitioner, specializes in civil and corporate law, mergers and acquisitions, tax law, construction law, and labor law.",
    text1En: "<p>Nikoloz Abutidze graduated from Tbilisi State University, where he earned his Bachelor's degree in Law. He furthered his studies by completing an LL.M. in Public Administration at the Institute of Public Affairs (GIPA), and later pursued a PhD at the same institution.</p><p>Since 2013, Nikoloz has actively practiced law, specializing in civil and corporate law, mergers and acquisitions (M&amp;A), tax law, construction law, and labor law. In 2022, he further expanded his professional qualifications by becoming a licensed insolvency practitioner. As a rehabilitation manager, he has successfully facilitated the approval of rehabilitation plans totaling 12 million and 10 million GEL.</p><p>In addition to his practical work, Nikoloz has been invited by the Council of Europe and the International Labor Organization (ILO) to lead specialized training sessions on labor and corporate law. He is also a co-author of the commentary on the Labor Code of Georgia, supported by the ILO.</p><p>He speaks in Georgian, English and Russian.</p>",
    published: 1,
    showOnHome: 1,
    homeOrder: 4,
    sortOrder: 4,
  });

  await updateMember("aleksandre-khasia", {
    titleEn: "Aleksandre Khasia",
    positionEn: "Financial Manager",
    descriptionEn: "Aleksandre Khasia has been financial manager at AG Legal Consulting since 2008, overseeing all financial operations, reporting, and corporate planning.",
    text1En: "<p>Aleksandre Khasia graduated from Tbilisi State University with a degree in Economics. He further enhanced his expertise by completing accountant courses at the Federation of BAFI and has completed the first stage of professional certification for accountants and auditors through ACCA.</p><p>Aleksandre joined AG Legal Consulting in 2008 as a financial manager. Previously, he served as the main accountant for LLC \"G and M Autoparts\" and LLC \"Eset Autoparts\" from 2008 to 2009, and as an accountant for the pharmaceutical company \"AVERSI\" from 2003 to 2008.</p><p>Besides native Georgian, Aleksandre speaks in Russian.</p>",
    published: 1,
    showOnHome: 0,
    sortOrder: 5,
  });

  await updateMember("eka-arsenidze", {
    titleEn: "Eka Arsenidze",
    positionEn: "Senior Administrative Manager",
    descriptionEn: "Eka Arsenidze has been Senior Administrative Manager at AG Legal Consulting since 2008, leading the firm's administrative operations.",
    text1En: "<p>Eka Arsenidze has been a Senior Administrative Manager at AG Legal Consulting since 2008. Prior to this role, she worked as a secretary-reviewer at the High School of Justice from 2005 to 2008 and as an office manager for the law firm \"Partner\" LLC from 2004 to 2005.</p><p>Eka speaks in Georgian, Russian and English.</p>",
    published: 1,
    showOnHome: 0,
    sortOrder: 6,
  });

  await updateMember("kakhaber-kipiani", {
    titleEn: "Kakhaber Kipiani",
    positionEn: "Of Counsel",
    descriptionEn: "Kakha has been Of Counsel at AG Legal Consulting since 2024, previously serving as a senior lawyer and partner at the firm from 2009 to 2023.",
    text1En: "<p>Kakha studied at the Technical University of Georgia and graduated from the Institute of Law and Economy in 2001. He then completed a Master's degree specialising in European Law at Tbilisi State University (2001–2002), where he was also a scholar of the Robert Bosch Foundation.</p><p>Prior to joining AG Legal Consulting in 2009, Kakha held several key positions: Head of Office for the Disciplinary Council (2006–2007 and 2008–2009), Head of the Legal Department at the General Prosecutor's Office of Georgia (2009), and Head of the Legal Department at the Ministry of Justice of Georgia (2007–2008). From 2004 to 2006, he was Chairman of the Disciplinary Council of Common Courts of Judges of Georgia.</p><p>From 2009 to 2023, Kakha served as a senior lawyer and partner at AG Legal Consulting. Since 2024, he has held the position of Of Counsel at the firm.</p><p>He is certified in civil and criminal law from the Bar Examination and has completed the Prosecutors Examination. Kakha speaks in Georgian, Russian, English and German.</p>",
    published: 1,
    showOnHome: 0,
    sortOrder: 7,
  });
}

// ─── 5. Services (titles only — keep existing descriptions) ───────────────────

async function seedServices() {
  console.log("\n── Services ──");

  const serviceUpdates = [
    { slug: "corporate-business-law", titleEn: "Corporate Law", titleKa: "საკორპორაციო სამართალი" },
    { slug: "contract-law", titleEn: "Contract Law", titleKa: "სახელშეკრულებო სამართალი" },
    { slug: "criminal-defense", titleEn: "Litigation & Arbitration", titleKa: "სამართალწარმოება & არბიტრაჟი" },
    { slug: "real-estate-law", titleEn: "Real Estate", titleKa: "უძრავი ქონების სამართალი" },
    { slug: "estate-planning-wills", titleEn: "Banking & Finance", titleKa: "საბანკო & საფინანსო სამართალი" },
    { slug: "immigration-law", titleEn: "Tax and Customs", titleKa: "საგადასახადო & საბაჟო სამართალი" },
  ];

  for (const s of serviceUpdates) {
    const existing = await db.select({ id: schema.services.id }).from(schema.services).where(eq(schema.services.slug, s.slug));
    if (existing.length) {
      await db.update(schema.services).set({ titleEn: s.titleEn, titleKa: s.titleKa, updatedAt: now }).where(eq(schema.services.slug, s.slug));
      console.log("  ✓ service:", s.titleEn);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding AG Legal real content into Turso DB…\n");
  await seedHomepage();
  await seedAboutPage();
  await seedContact();
  await seedTeamMembers();
  await seedServices();
  console.log("\n✅ Done. All content seeded successfully.");
}

main().catch((err) => { console.error(err); process.exit(1); }).finally(() => client.close());
