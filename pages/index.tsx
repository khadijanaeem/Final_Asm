import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎯 Resume Tailor</h1>

        <p className={styles.description}>
          Get a <span className={styles.highlight}>personalized</span>, AI-tailored resume for your next job.
        </p>

        <Link href="/login" legacyBehavior>
          <a className={styles.button}>Get Started</a>
        </Link>
      </div>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Resume Tailor. Powered by AI.
      </footer>
    </main>
  )
}
