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
      const { error } = await supabase.auth.getSession();

      // If there's no valid session, attempt to parse it from the URL fragment
      if (error || !supabase.auth.getUser()) {
        await supabase.auth.exchangeCodeForSession(window.location.hash);
      }

      // ✅ Optionally clear the URL hash
      window.history.replaceState({}, document.title, "/dashboard");

      // ✅ Redirect to a dashboard or home page
      router.push("/dashboard");
    };

    handleMagicLinkLogin();
  }, [router]);

  return <p>Logging in...</p>;
}
