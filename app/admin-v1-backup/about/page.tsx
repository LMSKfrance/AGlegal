import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { AdminToast } from "../components/AdminToast";
import { AboutSectionVisibilityToggle } from "../components/SectionVisibilityToggle";
import styles from "../admin.module.css";
import { getAboutSectionSettings } from "@/lib/about";
import {
  updateAboutTeamMembersFromForm,
  upsertAboutNumbersSettings,
  upsertAboutMissionSettings,
  upsertAboutFeaturesSettings,
  upsertAboutPhilosophySettings,
} from "@/lib/actions/about";
import { getTeamList } from "@/lib/actions/team";
import { SubmitButton } from "../components/SubmitButton";

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

async function HeroSection() {
  const { sectionVisibility } = await getAboutSectionSettings();
  return (
    <SectionCard
      title="Hero"
      headerRight={<AboutSectionVisibilityToggle sectionId="hero" sectionLabel="Hero" visible={sectionVisibility.hero} />}
    >
      <p className={styles.formHelp}>
        Hero title and content are edited in <Link href="/admin/pages">Pages</Link> (About page).
      </p>
    </SectionCard>
  );
}

async function NumbersSection() {
  const sections = await getAboutSectionSettings();
  async function action(formData: FormData) {
    "use server";
    const result = await upsertAboutNumbersSettings(formData);
    if (result.success) redirect("/admin/about?toast=success");
    else redirect("/admin/about?toast=error");
  }
  return (
    <SectionCard
      title="Numbers"
      headerRight={<AboutSectionVisibilityToggle sectionId="numbers" sectionLabel="Numbers" visible={sections.sectionVisibility.numbers} />}
    >
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Title (EN)" name="numbersTitleEn" defaultValue={sections.numbersTitleEn} size="m" />
              <TextArea label="Description (EN)" name="numbersDescriptionEn" rows={2} defaultValue={sections.numbersDescriptionEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Title (KA)" name="numbersTitleKa" defaultValue={sections.numbersTitleKa} size="m" />
              <TextArea label="Description (KA)" name="numbersDescriptionKa" rows={2} defaultValue={sections.numbersDescriptionKa} size="m" />
            </div>
          }
        />
        <div className={styles.formActions}>
          <SubmitButton />
        </div>
      </form>
    </SectionCard>
  );
}

async function MissionSection() {
  const sections = await getAboutSectionSettings();
  async function action(formData: FormData) {
    "use server";
    const result = await upsertAboutMissionSettings(formData);
    if (result.success) redirect("/admin/about?toast=success");
    else redirect("/admin/about?toast=error");
  }
  return (
    <SectionCard
      title="Mission"
      headerRight={<AboutSectionVisibilityToggle sectionId="mission" sectionLabel="Mission" visible={sections.sectionVisibility.mission} />}
    >
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Title (EN)" name="missionTitleEn" defaultValue={sections.missionTitleEn} size="m" />
              <TextArea label="Description (EN)" name="missionDescriptionEn" rows={2} defaultValue={sections.missionDescriptionEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Title (KA)" name="missionTitleKa" defaultValue={sections.missionTitleKa} size="m" />
              <TextArea label="Description (KA)" name="missionDescriptionKa" rows={2} defaultValue={sections.missionDescriptionKa} size="m" />
            </div>
          }
        />
        <div className={styles.formActions}>
          <SubmitButton />
        </div>
      </form>
    </SectionCard>
  );
}

async function FeaturesSection() {
  const sections = await getAboutSectionSettings();
  async function action(formData: FormData) {
    "use server";
    const result = await upsertAboutFeaturesSettings(formData);
    if (result.success) redirect("/admin/about?toast=success");
    else redirect("/admin/about?toast=error");
  }
  return (
    <SectionCard
      title="Features"
      headerRight={<AboutSectionVisibilityToggle sectionId="features" sectionLabel="Features" visible={sections.sectionVisibility.features} />}
    >
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Title (EN)" name="featuresTitleEn" defaultValue={sections.featuresTitleEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Title (KA)" name="featuresTitleKa" defaultValue={sections.featuresTitleKa} size="m" />
            </div>
          }
        />
        <div className={styles.formActions}>
          <SubmitButton />
        </div>
      </form>
    </SectionCard>
  );
}

async function PhilosophySection() {
  const sections = await getAboutSectionSettings();
  async function action(formData: FormData) {
    "use server";
    const result = await upsertAboutPhilosophySettings(formData);
    if (result.success) redirect("/admin/about?toast=success");
    else redirect("/admin/about?toast=error");
  }
  return (
    <SectionCard
      title="Philosophy"
      headerRight={<AboutSectionVisibilityToggle sectionId="philosophy" sectionLabel="Philosophy" visible={sections.sectionVisibility.philosophy} />}
    >
      <form action={action}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formGroup}>
              <TextField label="Title (EN)" name="philosophyTitleEn" defaultValue={sections.philosophyTitleEn} size="m" />
              <TextArea label="Description (EN)" name="philosophyDescriptionEn" rows={2} defaultValue={sections.philosophyDescriptionEn} size="m" />
            </div>
          }
          childrenKa={
            <div className={styles.formGroup}>
              <TextField label="Title (KA)" name="philosophyTitleKa" defaultValue={sections.philosophyTitleKa} size="m" />
              <TextArea label="Description (KA)" name="philosophyDescriptionKa" rows={2} defaultValue={sections.philosophyDescriptionKa} size="m" />
            </div>
          }
        />
        <div className={styles.formActions}>
          <SubmitButton />
        </div>
      </form>
    </SectionCard>
  );
}

async function TeamSection() {
  const sections = await getAboutSectionSettings();
  const list = await getTeamList();
  async function action(formData: FormData) {
    "use server";
    const result = await updateAboutTeamMembersFromForm(formData);
    if (result.success) redirect("/admin/about?toast=success");
    else redirect("/admin/about?toast=error");
  }
  return (
    <SectionCard
      title="Team"
      headerRight={<AboutSectionVisibilityToggle sectionId="team" sectionLabel="Team" visible={sections.sectionVisibility.team} />}
    >
      <p className={styles.formHelp} style={{ marginBottom: 16 }}>
        Choose which team members appear on the About page and set their order.
      </p>
      <form action={action}>
        <div className={styles.tableWrap}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Show on About</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ color: "var(--gray-500)" }}>
                    No team members. Add some in <Link href="/admin/team">Team</Link>.
                  </td>
                </tr>
              ) : (
                list.map((member, index) => (
                  <tr key={member.id}>
                    <td>{member.titleEn}</td>
                    <td>
                      <input
                        type="checkbox"
                        name="showOnAbout"
                        value={member.id}
                        defaultChecked={!!(member as { showOnAbout?: number }).showOnAbout}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name={`aboutOrder_${member.id}`}
                        defaultValue={(member as { aboutOrder?: number }).aboutOrder ?? index}
                        min={0}
                        style={{ width: 64 }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {list.length > 0 && (
          <div className={styles.formActions}>
            <SubmitButton label="Save team selection" />
          </div>
        )}
      </form>
    </SectionCard>
  );
}

async function FAQSection() {
  const sections = await getAboutSectionSettings();
  return (
    <SectionCard
      title="FAQ"
      headerRight={<AboutSectionVisibilityToggle sectionId="faq" sectionLabel="FAQ" visible={sections.sectionVisibility.faq} />}
    >
      <p className={styles.formHelp}>
        Toggle above controls whether the FAQ block is shown on the About page.
      </p>
    </SectionCard>
  );
}

export default async function AdminAboutPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>About page</h1>
      </div>
      <div className={styles.formStack}>
        <Suspense fallback={null}><HeroSection /></Suspense>
        <Suspense fallback={null}><NumbersSection /></Suspense>
        <Suspense fallback={null}><MissionSection /></Suspense>
        <Suspense fallback={null}><FeaturesSection /></Suspense>
        <Suspense fallback={null}><PhilosophySection /></Suspense>
        <Suspense fallback={null}><TeamSection /></Suspense>
        <Suspense fallback={null}><FAQSection /></Suspense>
      </div>
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}
