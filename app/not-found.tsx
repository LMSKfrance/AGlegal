import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.description}>
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className={styles.btn}>
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
