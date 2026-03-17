import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";
import { getHomeSectionVisibility, type HomeSectionVisibility } from "@/lib/home";
import {
  getHomeHeroSettings,
  getHomeAboutSettings,
  getHomeSectionHeadingsSettings,
  getHomeBenefitsList,
  getHomeProcessStepsList,
  upsertHomeHeroSettings,
  upsertHomeAboutSettings,
  upsertHomeSectionHeadingsSettings,
  upsertHomeBenefit,
  upsertHomeProcessStep,
  deleteHomeBenefit,
  deleteHomeProcessStep,
} from "@/lib/actions/home";
import { HomeSectionVisibilityToggle } from "../components/HomeSectionVisibilityToggle";
import { FileUploadField } from "../components/FileUploadField";

function SectionCard({
  title,
  children,
  headerRight,
}: {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  return (
    <section className={styles.formCard} aria-label={title}>
      <div className={styles.sectionCardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {headerRight}
      </div>
      {children}
    </section>
  );
}

async function HeroSection({ visibility }: { visibility: HomeSectionVisibility }) {
  const hero = await getHomeHeroSettings();

  async function action(formData: FormData) {
    "use server";
    const result = await upsertHomeHeroSettings({}, formData);
    if (result.success) redirect("/admin/home?toast=success");
  }

  return (
    <SectionCard
      title="Hero"
      headerRight={<HomeSectionVisibilityToggle sectionId="hero" sectionLabel="Hero" visible={visibility.hero} />}
    >
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Brand (EN, blue)" name="brandEn" defaultValue={hero.brandEn} size="m" />
              <TextArea label="Title (EN, main heading) *" name="titleEn" rows={2} required defaultValue={hero.titleEn} size="m" />
              <TextField label="CTA label (EN)" name="ctaEn" defaultValue={hero.ctaEn} size="m" />
              <TextArea label="Subtext / description (EN)" name="descriptionEn" rows={3} defaultValue={hero.descriptionEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Brand (KA, blue)" name="brandKa" defaultValue={hero.brandKa} size="m" />
              <TextArea label="Title (KA, main heading)" name="titleKa" rows={2} defaultValue={hero.titleKa} size="m" />
              <TextField label="CTA label (KA)" name="ctaKa" defaultValue={hero.ctaKa} size="m" />
              <TextArea label="Subtext / description (KA)" name="descriptionKa" rows={3} defaultValue={hero.descriptionKa} size="m" />
            </div>
          }
        />

        <FileUploadField
          name="heroImage"
          accept="image/jpeg,image/png,image/gif,image/webp"
          label="Hero image"
          currentPath={hero.image}
        />

        <div className={styles.formActions}>
          <Button type="submit" variant="primary" colorStyle="dark" size="m">
            Save hero
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

async function AboutSection({ visibility }: { visibility: HomeSectionVisibility }) {
  const about = await getHomeAboutSettings();

  async function action(formData: FormData) {
    "use server";
    const result = await upsertHomeAboutSettings({}, formData);
    if (result.success) redirect("/admin/home?toast=success");
  }

  return (
    <SectionCard
      title="Who we are"
      headerRight={<HomeSectionVisibilityToggle sectionId="about" sectionLabel="Who we are" visible={visibility.about} />}
    >
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Title (EN) *" name="titleEn" required defaultValue={about.titleEn} size="m" />
              <TextArea label="Body text (EN)" name="descriptionEn" rows={4} defaultValue={about.descriptionEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Title (KA)" name="titleKa" defaultValue={about.titleKa} size="m" />
              <TextArea label="Body text (KA)" name="descriptionKa" rows={4} defaultValue={about.descriptionKa} size="m" />
            </div>
          }
        />

        <FileUploadField
          name="aboutImage"
          accept="image/jpeg,image/png,image/gif,image/webp"
          label="Background image"
          currentPath={about.image}
        />

        <div className={styles.formActions}>
          <Button type="submit" variant="primary" colorStyle="dark" size="m">
            Save section
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

async function SectionHeadingsSection() {
  const headings = await getHomeSectionHeadingsSettings();

  async function action(formData: FormData) {
    "use server";
    const result = await upsertHomeSectionHeadingsSettings({}, formData);
    if (result.success) redirect("/admin/home?toast=success");
  }

  return (
    <SectionCard title="Section headings">
      <p className={styles.formHelp} style={{ marginBottom: 20 }}>
        Titles and descriptions for the homepage sections: Our legal services, Why work with us,
        Our working process.
      </p>
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Services section title (EN)" name="servicesTitleEn" defaultValue={headings.servicesTitleEn} size="m" />
              <TextArea label="Services section description (EN)" name="servicesDescriptionEn" rows={2} defaultValue={headings.servicesDescriptionEn} size="m" />
              <TextField label="Benefits section title (EN)" name="benefitsTitleEn" defaultValue={headings.benefitsTitleEn} size="m" />
              <TextField label="Process section title (EN)" name="processTitleEn" defaultValue={headings.processTitleEn} size="m" />
              <TextArea label="Process section description (EN)" name="processDescriptionEn" rows={2} defaultValue={headings.processDescriptionEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Services section title (KA)" name="servicesTitleKa" defaultValue={headings.servicesTitleKa} size="m" />
              <TextArea label="Services section description (KA)" name="servicesDescriptionKa" rows={2} defaultValue={headings.servicesDescriptionKa} size="m" />
              <TextField label="Benefits section title (KA)" name="benefitsTitleKa" defaultValue={headings.benefitsTitleKa} size="m" />
              <TextField label="Process section title (KA)" name="processTitleKa" defaultValue={headings.processTitleKa} size="m" />
              <TextArea label="Process section description (KA)" name="processDescriptionKa" rows={2} defaultValue={headings.processDescriptionKa} size="m" />
            </div>
          }
        />
        <div className={styles.formActions}>
          <Button type="submit" variant="primary" colorStyle="dark" size="m">
            Save section headings
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

function ServicesSection({ visibility }: { visibility: HomeSectionVisibility }) {
  return (
    <SectionCard
      title="Our legal services (cards)"
      headerRight={<HomeSectionVisibilityToggle sectionId="services" sectionLabel="Services" visible={visibility.services} />}
    >
      <p className={styles.formHelp}>
        Manage which services appear on the homepage in the{" "}
        <a href="/admin/services">Services</a> section. Each service has flags for
        &quot;Show on home&quot;, card order, short description, and custom &quot;Learn more&quot;
        link.
      </p>
    </SectionCard>
  );
}

function TeamSection({ visibility }: { visibility: HomeSectionVisibility }) {
  return (
    <SectionCard
      title="Team (homepage)"
      headerRight={<HomeSectionVisibilityToggle sectionId="team" sectionLabel="Team" visible={visibility.team} />}
    >
      <p className={styles.formHelp}>
        Choose which team members appear on the homepage. Use &quot;Show on home&quot; and
        &quot;Home order&quot; on each member in the <a href="/admin/team">Team</a> section.
      </p>
    </SectionCard>
  );
}

function NewsCtaSection({ visibility }: { visibility: HomeSectionVisibility }) {
  return (
    <SectionCard title="News &amp; CTA visibility">
      <p className={styles.formHelp} style={{ marginBottom: 16 }}>
        Toggle whether the News and CTA sections are shown on the homepage.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ minWidth: 64, fontSize: 13, color: "var(--gray-600)", fontWeight: 500 }}>News</span>
          <HomeSectionVisibilityToggle sectionId="news" sectionLabel="News" visible={visibility.news} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ minWidth: 64, fontSize: 13, color: "var(--gray-600)", fontWeight: 500 }}>CTA</span>
          <HomeSectionVisibilityToggle sectionId="cta" sectionLabel="CTA" visible={visibility.cta} />
        </div>
      </div>
    </SectionCard>
  );
}

async function BenefitsSection({ visibility }: { visibility: HomeSectionVisibility }) {
  const benefits = await getHomeBenefitsList();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (Number.isFinite(id)) {
      await deleteHomeBenefit(id);
    }
  }

  async function handleUpsert(id: number | null, formData: FormData) {
    "use server";
    const result = await upsertHomeBenefit(id, {}, formData);
    if (result.success) redirect("/admin/home?toast=success");
  }

  const canAdd = benefits.length < 4;

  return (
    <SectionCard
      title="Why work with us"
      headerRight={<HomeSectionVisibilityToggle sectionId="benefits" sectionLabel="Benefits" visible={visibility.benefits} />}
    >
      <p className={styles.formHelp} style={{ marginBottom: 8 }}>
        Up to 4 cards. Text is truncated automatically on the homepage to fit the design.
      </p>

      <div className={styles.cardList}>
        {benefits.map((benefit) => (
          <div key={benefit.id} className={styles.formCardInner}>
            <form action={handleUpsert.bind(null, benefit.id)}>
              <AdminLangTabs
                childrenEn={
                  <div className={styles.formGroup}>
                    <TextField label="Title (EN)" name="titleEn" defaultValue={benefit.titleEn} size="m" />
                    <TextArea label="Description (EN)" name="descriptionEn" rows={3} defaultValue={benefit.descriptionEn ?? ""} size="m" />
                  </div>
                }
                childrenKa={
                  <div className={styles.formGroup}>
                    <TextField label="Title (KA)" name="titleKa" defaultValue={benefit.titleKa ?? ""} size="m" />
                    <TextArea label="Description (KA)" name="descriptionKa" rows={3} defaultValue={benefit.descriptionKa ?? ""} size="m" />
                  </div>
                }
              />

              <FileUploadField
                name="icon"
                accept="image/svg+xml,image/png,image/jpeg,image/webp"
                label="Icon (SVG / image)"
                currentPath={benefit.iconPath}
              />

              <div className={styles.cardItemActions}>
                <Button type="submit" variant="primary" colorStyle="dark" size="s">
                  Save card
                </Button>
              </div>
            </form>

            <form action={handleDelete} style={{ marginTop: 8 }}>
              <input type="hidden" name="id" value={benefit.id} />
              <Button type="submit" variant="ghost" colorStyle="dark" size="s">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>

      {canAdd && (
        <form action={handleUpsert.bind(null, null)} className={styles.formCardInner} style={{ marginTop: 16 }}>
          <AdminLangTabs
            childrenEn={
              <div className={styles.formGroup}>
                <TextField label="Title (EN)" name="titleEn" size="m" />
                <TextArea label="Description (EN)" name="descriptionEn" rows={3} size="m" />
              </div>
            }
            childrenKa={
              <div className={styles.formGroup}>
                <TextField label="Title (KA)" name="titleKa" size="m" />
                <TextArea label="Description (KA)" name="descriptionKa" rows={3} size="m" />
              </div>
            }
          />

          <FileUploadField
            name="icon"
            accept="image/svg+xml,image/png,image/jpeg,image/webp"
            label="Icon (SVG / image)"
            currentPath={null}
          />

          <div className={styles.cardItemActions}>
            <Button type="submit" variant="primary" colorStyle="dark" size="m">
              Add card
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}

async function ProcessSection({ visibility }: { visibility: HomeSectionVisibility }) {
  const steps = await getHomeProcessStepsList();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (Number.isFinite(id)) {
      await deleteHomeProcessStep(id);
    }
  }

  async function handleUpsert(id: number | null, formData: FormData) {
    "use server";
    const result = await upsertHomeProcessStep(id, {}, formData);
    if (result.success) redirect("/admin/home?toast=success");
  }

  const canAdd = steps.length < 4;

  return (
    <SectionCard
      title="Our working process"
      headerRight={<HomeSectionVisibilityToggle sectionId="process" sectionLabel="Process" visible={visibility.process} />}
    >
      <p className={styles.formHelp} style={{ marginBottom: 8 }}>
        Up to 4 steps. Tab titles should be a single word — only the first word is used on the tab buttons.
      </p>

      <div className={styles.cardList}>
        {steps.map((step) => (
          <div key={step.id} className={styles.formCardInner}>
            <form action={handleUpsert.bind(null, step.id)}>
              <AdminLangTabs
                childrenEn={
                  <div className={styles.formGroup}>
                    <TextField label="Tab title (EN, 1 word)" name="tabTitleEn" defaultValue={step.tabTitleEn} size="m" />
                    <TextField label="Step title (EN)" name="titleEn" defaultValue={step.titleEn} size="m" />
                    <TextArea label="Description (EN)" name="descriptionEn" rows={3} defaultValue={step.descriptionEn ?? ""} size="m" />
                  </div>
                }
                childrenKa={
                  <div className={styles.formGroup}>
                    <TextField label="Tab title (KA, 1 word)" name="tabTitleKa" defaultValue={step.tabTitleKa ?? ""} size="m" />
                    <TextField label="Step title (KA)" name="titleKa" defaultValue={step.titleKa ?? ""} size="m" />
                    <TextArea label="Description (KA)" name="descriptionKa" rows={3} defaultValue={step.descriptionKa ?? ""} size="m" />
                  </div>
                }
              />

              <FileUploadField
                name="image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                label="Step image"
                currentPath={step.image}
              />

              <div className={styles.cardItemActions}>
                <Button type="submit" variant="primary" colorStyle="dark" size="s">
                  Save step
                </Button>
              </div>
            </form>

            <form action={handleDelete} style={{ marginTop: 8 }}>
              <input type="hidden" name="id" value={step.id} />
              <Button type="submit" variant="ghost" colorStyle="dark" size="s">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>

      {canAdd && (
        <form action={handleUpsert.bind(null, null)} className={styles.formCardInner} style={{ marginTop: 16 }}>
          <AdminLangTabs
            childrenEn={
              <div className={styles.formGroup}>
                <TextField label="Tab title (EN, 1 word)" name="tabTitleEn" size="m" />
                <TextField label="Step title (EN)" name="titleEn" size="m" />
                <TextArea label="Description (EN)" name="descriptionEn" rows={3} size="m" />
              </div>
            }
            childrenKa={
              <div className={styles.formGroup}>
                <TextField label="Tab title (KA, 1 word)" name="tabTitleKa" size="m" />
                <TextField label="Step title (KA)" name="titleKa" size="m" />
                <TextArea label="Description (KA)" name="descriptionKa" rows={3} size="m" />
              </div>
            }
          />

          <FileUploadField
            name="image"
            accept="image/jpeg,image/png,image/gif,image/webp"
            label="Step image"
            currentPath={null}
          />

          <div className={styles.cardItemActions}>
            <Button type="submit" variant="primary" colorStyle="dark" size="m">
              Add step
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}

export default async function AdminHomePage() {
  const visibility = await getHomeSectionVisibility();

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Homepage</h1>
      </div>

      <div className={styles.formStack}>
        <Suspense fallback={null}>
          <HeroSection visibility={visibility} />
        </Suspense>
        <Suspense fallback={null}>
          <AboutSection visibility={visibility} />
        </Suspense>
        <Suspense fallback={null}>
          <SectionHeadingsSection />
        </Suspense>
        <ServicesSection visibility={visibility} />
        <Suspense fallback={null}>
          <BenefitsSection visibility={visibility} />
        </Suspense>
        <Suspense fallback={null}>
          <ProcessSection visibility={visibility} />
        </Suspense>
        <TeamSection visibility={visibility} />
        <NewsCtaSection visibility={visibility} />
      </div>

      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}
