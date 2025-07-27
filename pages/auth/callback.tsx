// pages/auth/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleMagicLinkLogin = async () => {
      const hash = window.location.hash;

      // Exchange hash fragment for a session
      const { error } = await supabase.auth.exchangeCodeForSession(hash);

      if (error) {
        console.error("Session exchange failed:", error.message);
        return router.push("/login"); // Optional: Redirect on error
      }

      // Clear the hash from the URL
      window.history.replaceState({}, document.title, "/dashboard");

      // Redirect after successful login
      router.push("/dashboard");
    };

    handleMagicLinkLogin();
  }, [router]);

  return <p>Logging in...</p>;
}
