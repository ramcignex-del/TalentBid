// app/api/bids/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient(); // adapt to your wrapper
  const body = await req.json();

  const { candidate_id, salary, message, reveal_employer = null } = body;
  // reveal_employer: optional per-bid override: 'public' | 'anonymous' | null (null means use employer default)

  // Get authenticated employer
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // fetch employer and candidate
  const { data: empRow, error: empErr } = await supabase
    .from("employers")
    .select("*")
    .eq("auth_user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (empErr || !empRow) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 });
  }

  const { data: candRow } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidate_id)
    .limit(1)
    .maybeSingle();

  if (!candRow) return NextResponse.json({ error: "Candidate not found" }, { status: 404 });

  // determine snapshots
  const employer_visibility_snapshot = reveal_employer
    ? reveal_employer
    : empRow.visibility_mode || "public";

  const candidate_visibility_snapshot = candRow.visibility_mode || "public";

  // insert bid
  const { data: bid, error: insertErr } = await supabase
    .from("bids")
    .insert({
      candidate_id,
      employer_id: empRow.id,
      salary,
      message,
      status: "pending",
      employer_visibility_snapshot,
      candidate_visibility_snapshot,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ bid }, { status: 201 });
}
