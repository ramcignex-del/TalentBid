// app/api/candidates/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, full_name, title, min_salary, skills, visibility_mode, availability")
    .order("created_at", { ascending: false });

  if (!candidates) {
    return NextResponse.json([]);
  }

  // If viewer is employer, and candidate.visibility_mode === 'anonymous', replace name
  const isEmployerViewer = !!user && (await isEmployerUser(supabase, user.id));

  const sanitized = candidates.map((c: any) => {
    if (isEmployerViewer && c.visibility_mode === "anonymous") {
      return { ...c, display_name: `Candidate ${c.id}`, full_name: null };
    }
    return { ...c, display_name: c.full_name || `Candidate ${c.id}` };
  });

  return NextResponse.json(sanitized);
}

async function isEmployerUser(supabase: any, userId: string) {
  const { data } = await supabase.from("employers").select("id").eq("user_id", userId).limit(1).maybeSingle();
  return !!data;
}
