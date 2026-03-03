import { Suspense } from "react";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";
import {
  getHomeHeroSettings,
  getHomeAboutSettings,
  getHomeBenefitsList,
  getHomeProcessStepsList,
  upsertHomeHeroSettings,
  upsertHomeAboutSettings,
  upsertHomeBenefit,
  upsertHomeProcessStep,
  deleteHomeBenefit,
  deleteHomeProcessStep,
  type HomeBenefit,
  type HomeProcessStep,
} from "@/lib/actions/home";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.formCard} aria-label={title}>
      <h2 className={styles.pageTitle} style={{ marginBottom: 24 }}>
        {title}
      </h2>
      {children}
    </section>
  );

}

async function HeroSection() {
  const hero = await getHomeHeroSettings();

  async function action(formData: FormData) {
    "use server";
    await upsertHomeHeroSettings({}, formData);
  }

  return (
    <SectionCard title="Hero">
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formRow}>
              <TextField
                label="Brand (EN, blue)"
                name="brandEn"
                defaultValue={hero.brandEn}
                size="m"
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Title (EN, main heading) *"
                  name="titleEn"
                  rows={2}
                  required
                  defaultValue={hero.titleEn}
                  size="m"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextField
                  label="CTA label (EN)"
                  name="ctaEn"
                  defaultValue={hero.ctaEn}
                  size="m"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Subtext / description (EN)"
                  name="descriptionEn"
                  rows={3}
                  defaultValue={hero.descriptionEn}
                  size="m"
                />
              </div>
            </div>
          }
          childrenKa={
            <div className={styles.formRow}>
              <TextField
                label="Brand (KA, blue)"
                name="brandKa"
                defaultValue={hero.brandKa}
                size="m"
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Title (KA, main heading)"
                  name="titleKa"
                  rows={2}
                  defaultValue={hero.titleKa}
                  size="m"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextField
                  label="CTA label (KA)"
                  name="ctaKa"
                  defaultValue={hero.ctaKa}
                  size="m"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Subtext / description (KA)"
                  name="descriptionKa"
                  rows={3}
                  defaultValue={hero.descriptionKa}
                  size="m"
                />
              </div>
            </div>
          }
        />

        <div className={styles.formRow} style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Hero image</label>
          <input type="file" name="heroImage" accept="image/jpeg,image/png,image/gif,image/webp" />
          {hero.image && (
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
              Current:{" "}
              <a href={hero.image} target="_blank" rel="noreferrer">
                {hero.image}
              </a>
            </p>
          )}
        </div>

        <div className={styles.formRow} style={{ marginTop: 24 }}>
          <Button type="submit" variant="primary" colorStyle="dark" size="m">
            Save hero
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

async function AboutSection() {
  const about = await getHomeAboutSettings();

  async function action(formData: FormData) {
    "use server";
    await upsertHomeAboutSettings({}, formData);
  }

  return (
    <SectionCard title="Who we are">
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formRow}>
              <TextField
                label="Title (EN) *"
                name="titleEn"
                required
                defaultValue={about.titleEn}
                size="m"
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Body text (EN)"
                  name="descriptionEn"
                  rows={4}
                  defaultValue={about.descriptionEn}
                  size="m"
                />
              </div>
            </div>
          }
          childrenKa={
            <div className={styles.formRow}>
              <TextField
                label="Title (KA)"
                name="titleKa"
                defaultValue={about.titleKa}
                size="m"
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Body text (KA)"
                  name="descriptionKa"
                  rows={4}
                  defaultValue={about.descriptionKa}
                  size="m"
                />
              </div>
            </div>
          }
        />

        <div className={styles.formRow} style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Background image</label>
          <input type="file" name="aboutImage" accept="image/jpeg,image/png,image/gif,image/webp" />
          {about.image && (
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
              Current:{" "}
              <a href={about.image} target="_blank" rel="noreferrer">
                {about.image}
              </a>
            </p>
          )}
        </div>

        <div className={styles.formRow} style={{ marginTop: 24 }}>
          <Button type="submit" variant="primary" colorStyle="dark" size="m">
            Save section
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

function ServicesSection() {
  return (
    <SectionCard title="Our legal services (cards)">
      <p className={styles.formHelp}>
        Manage which services appear on the homepage in the{" "}
        <a href="/admin/services">Services</a> section. Each service has flags for
        &quot;Show on home&quot;, card order, short description, and custom &quot;Learn more&quot;
        link.
      </p>
    </SectionCard>
  );
}

async function BenefitsSection() {
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
    await upsertHomeBenefit(id, {}, formData);
  }

  const canAdd = benefits.length < 4;

  return (
    <SectionCard title="Why work with us">
      <div className={styles.formRow}>
        <p className={styles.formHelp}>
          Up to 4 cards. Text will be truncated automatically on the homepage to fit the design.
        </p>
      </div>

      {benefits.map((benefit) => (
        <form
          key={benefit.id}
          action={handleUpsert.bind(null, benefit.id)}
          className={styles.formCard}
          style={{ marginBottom: 16 }}
        >
          <AdminLangTabs
            childrenEn={
              <div className={styles.formRow}>
                <TextField
                  label="Title (EN)"
                  name="titleEn"
                  defaultValue={benefit.titleEn}
                  size="m"
                />
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (EN)"
                    name="descriptionEn"
                    rows={3}
                    defaultValue={benefit.descriptionEn ?? ""}
                    size="m"
                  />
                </div>
              </div>
            }
            childrenKa={
              <div className={styles.formRow}>
                <TextField
                  label="Title (KA)"
                  name="titleKa"
                  defaultValue={benefit.titleKa ?? ""}
                  size="m"
                />
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (KA)"
                    name="descriptionKa"
                    rows={3}
                    defaultValue={benefit.descriptionKa ?? ""}
                    size="m"
                  />
                </div>
              </div>
            }
          />

          <div className={styles.formRow} style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Icon (SVG / image)</label>
            <input type="file" name="icon" accept="image/svg+xml,image/png,image/jpeg,image/webp" />
            {benefit.iconPath && (
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
                Current:{" "}
                <a href={benefit.iconPath} target="_blank" rel="noreferrer">
                  {benefit.iconPath}
                </a>
              </p>
            )}
          </div>

          <div
            className={styles.formRow}
            style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}
          >
            <Button type="submit" variant="primary" colorStyle="dark" size="s">
              Save card
            </Button>

            <form action={handleDelete}>
              <input type="hidden" name="id" value={benefit.id} />
              <Button type="submit" variant="ghost" colorStyle="dark" size="s">
                Delete
              </Button>
            </form>
          </div>
        </form>
      ))}

      {canAdd && (
        <form
          action={handleUpsert.bind(null, null)}
          className={styles.formCard}
          style={{ marginTop: 24 }}
        >
          <AdminLangTabs
            childrenEn={
              <div className={styles.formRow}>
                <TextField label="Title (EN)" name="titleEn" size="m" />
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (EN)"
                    name="descriptionEn"
                    rows={3}
                    size="m"
                  />
                </div>
              </div>
            }
            childrenKa={
              <div className={styles.formRow}>
                <TextField label="Title (KA)" name="titleKa" size="m" />
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (KA)"
                    name="descriptionKa"
                    rows={3}
                    size="m"
                  />
                </div>
              </div>
            }
          />

          <div className={styles.formRow} style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Icon (SVG / image)</label>
            <input type="file" name="icon" accept="image/svg+xml,image/png,image/jpeg,image/webp" />
          </div>

          <div className={styles.formRow} style={{ marginTop: 24 }}>
            <Button type="submit" variant="primary" colorStyle="dark" size="m">
              Add card
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}

async function ProcessSection() {
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
    await upsertHomeProcessStep(id, {}, formData);
  }

  const canAdd = steps.length < 4;

  return (
    <SectionCard title="Our working process">
      <div className={styles.formRow}>
        <p className={styles.formHelp}>
          Up to 4 steps. Tab titles should be a single word; if longer, only the first word will be
          used on the buttons.
        </p>
      </div>

      {steps.map((step) => (
        <form
          key={step.id}
          action={handleUpsert.bind(null, step.id)}
          className={styles.formCard}
          style={{ marginBottom: 16 }}
        >
          <AdminLangTabs
            childrenEn={
              <div className={styles.formRow}>
                <TextField
                  label="Tab title (EN, 1 word)"
                  name="tabTitleEn"
                  defaultValue={step.tabTitleEn}
                  size="m"
                />
                <div style={{ marginTop: 16 }}>
                  <TextField
                    label="Step title (EN)"
                    name="titleEn"
                    defaultValue={step.titleEn}
                    size="m"
                  />
                </div>
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (EN)"
                    name="descriptionEn"
                    rows={3}
                    defaultValue={step.descriptionEn ?? ""}
                    size="m"
                  />
                </div>
              </div>
            }
            childrenKa={
              <div className={styles.formRow}>
                <TextField
                  label="Tab title (KA, 1 word)"
                  name="tabTitleKa"
                  defaultValue={step.tabTitleKa ?? ""}
                  size="m"
                />
                <div style={{ marginTop: 16 }}>
                  <TextField
                    label="Step title (KA)"
                    name="titleKa"
                    defaultValue={step.titleKa ?? ""}
                    size="m"
                  />
                </div>
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (KA)"
                    name="descriptionKa"
                    rows={3}
                    defaultValue={step.descriptionKa ?? ""}
                    size="m"
                  />
                </div>
              </div>
            }
          />

          <div className={styles.formRow} style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Step image</label>
            <input type="file" name="image" accept="image/jpeg,image/png,image/gif,image/webp" />
            {step.image && (
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
                Current:{" "}
                <a href={step.image} target="_blank" rel="noreferrer">
                  {step.image}
                </a>
              </p>
            )}
          </div>

          <div
            className={styles.formRow}
            style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}
          >
            <Button type="submit" variant="primary" colorStyle="dark" size="s">
              Save step
            </Button>

            <form action={handleDelete}>
              <input type="hidden" name="id" value={step.id} />
              <Button type="submit" variant="ghost" colorStyle="dark" size="s">
                Delete
              </Button>
            </form>
          </div>
        </form>
      ))}

      {canAdd && (
        <form
          action={handleUpsert.bind(null, null)}
          className={styles.formCard}
          style={{ marginTop: 24 }}
        >
          <AdminLangTabs
            childrenEn={
              <div className={styles.formRow}>
                <TextField label="Tab title (EN, 1 word)" name="tabTitleEn" size="m" />
                <div style={{ marginTop: 16 }}>
                  <TextField label="Step title (EN)" name="titleEn" size="m" />
                </div>
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (EN)"
                    name="descriptionEn"
                    rows={3}
                    size="m"
                  />
                </div>
              </div>
            }
            childrenKa={
              <div className={styles.formRow}>
                <TextField label="Tab title (KA, 1 word)" name="tabTitleKa" size="m" />
                <div style={{ marginTop: 16 }}>
                  <TextField label="Step title (KA)" name="titleKa" size="m" />
                </div>
                <div style={{ marginTop: 16 }}>
                  <TextArea
                    label="Description (KA)"
                    name="descriptionKa"
                    rows={3}
                    size="m"
                  />
                </div>
              </div>
            }
          />

          <div className={styles.formRow} style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>Step image</label>
            <input type="file" name="image" accept="image/jpeg,image/png,image/gif,image/webp" />
          </div>

          <div className={styles.formRow} style={{ marginTop: 24 }}>
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
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Homepage</h1>
      </div>

      <div className={styles.formStack}>
        <Suspense fallback={null}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={null}>
          <AboutSection />
        </Suspense>
        <ServicesSection />
        <Suspense fallback={null}>
          <BenefitsSection />
        </Suspense>
        <Suspense fallback={null}>
          <ProcessSection />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}

