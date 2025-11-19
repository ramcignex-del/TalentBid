// app/api/bids/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function redactForEmployer(bidRow: any) {
  // For employers viewing other employers' bids: remove salary, keep limited info
  const copy = { ...bidRow };
  delete copy.salary; // employers never see salary of other employers
  // Keep employer name if employer_visibility_snapshot === 'public' (handled in caller)
  return copy;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: bidId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // fetch bid joined with candidate and employer summary
  const { data: bidData } = await supabase
    .from("bids")
    .select(`
      *,
      candidates: candidate_id ( id, full_name, title, visibility_mode ),
      employers: employer_id ( id, company_name, visibility_mode )
    `)
    .eq("id", bidId)
    .maybeSingle();

  if (!bidData) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If candidate owner requests -> include salary and employer details according to snapshot
  if (user) {
    // find whether user is the candidate owner or employer
    // check candidates table for auth_user_id
    const { data: candidateUser } = await supabase
      .from("candidates")
      .select("auth_user_id, id")
      .eq("id", bidData.candidate_id)
      .limit(1)
      .maybeSingle();

    const { data: employerUser } = await supabase
      .from("employers")
      .select("auth_user_id, id, visibility_mode")
      .eq("id", bidData.employer_id)
      .limit(1)
      .maybeSingle();

    const isCandidateOwner = candidateUser?.auth_user_id === user.id;
    const isEmployerOwner = employerUser?.auth_user_id === user.id;

    if (isCandidateOwner) {
      // Candidate sees salary and employer identity if snapshot allows
      const showEmployerIdentity = bidData.employer_visibility_snapshot === "public";
      const response: any = {
        id: bidData.id,
        salary: bidData.salary,
        message: bidData.message,
        status: bidData.status,
        employer: showEmployerIdentity
          ? {
              id: bidData.employer_id,
              company_name: bidData.employers?.company_name,
            }
          : { id: bidData.employer_id, anonymous: true },
      };
      return NextResponse.json(response);
    }

    if (isEmployerOwner) {
      // Employer who created the bid sees full bid (it's their own bid)
      return NextResponse.json(bidData);
    }

    // If some *other employer* is viewing: only show employer name if both viewer and bid snapshot public
    // Determine viewer's employer record:
    const { data: viewerEmployer } = await supabase
      .from("employers")
      .select("id, auth_user_id, visibility_mode")
      .eq("auth_user_id", user.id)
      .limit(1)
      .maybeSingle();

    let resp = redactForEmployer(bidData);

    // Show employer name only if:
    // - bid.employer_visibility_snapshot === 'public' AND viewerEmployer.visibility_mode === 'public'
    if (bidData.employer_visibility_snapshot === "public" && viewerEmployer?.visibility_mode === "public") {
      resp.employer_name = bidData.employers?.company_name;
    } else {
      resp.employer_name = "Anonymous Employer";
    }

    return NextResponse.json(resp);
  }

  // If unauthenticated viewer -> only limited info
  return NextResponse.json({ id: bidData.id, status: bidData.status });
}
