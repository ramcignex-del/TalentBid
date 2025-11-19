"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doSignOut() {
      await supabase.auth.signOut();
      router.push("/");
    }
    doSignOut();
  }, [router]);

  return <div className="py-20 text-center">Signing out…</div>;
}
