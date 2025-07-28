import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
     <h1 className={styles.title}>👋 Welcome to Resume Tailor</h1>

<p className={styles.description}>
  Your resume deserves to shine. ✨
  <br />
  Let our AI craft a <span className={styles.highlight}>tailored, job-ready</span> resume that speaks for you.
</p>

<p className={styles.subtext}>
  Whether you're a student, a job switcher, or just exploring — you're in the right place.
</p>

<Link href="/login" legacyBehavior>
  <a className={styles.button}>Get Started — It's Free</a>
</Link>

      </div>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Resume Tailor. Powered by AI.
      </footer>
    </main>
  )
}
