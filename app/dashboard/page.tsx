"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import CandidateDashboard from "@/components/CandidateDashboard";
import EmployerDashboard from "@/components/EmployerDashboard";

export default function DashboardPage() {
  // In the future, replace with real role detection using Supabase auth metadata.
  const [role, setRole] = useState<"candidate" | "employer" | null>(null);

  useEffect(() => {
    // TEMP LOGIC:
    // Check localStorage or URL override for demo purposes.
    // Later replaced by real user session/role.
    const userType =
      (localStorage.getItem("user-role") as "candidate" | "employer") ||
      "candidate"; // default for now

    setRole(userType);
  }, []);

  if (!role) {
    return (
      <PageContainer>
        <div className="py-20 text-center text-slate-600 text-lg">
          Loading your dashboard…
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <header className="py-10">
        <h1 className="text-3xl font-semibold text-slate-900">
          {role === "candidate" ? "Candidate Dashboard" : "Employer Dashboard"}
        </h1>
        <p className="mt-2 text-slate-600 max-w-xl">
          {role === "candidate"
            ? "View bids from employers, update your availability, and manage your profile."
            : "Browse immediate-joiner talent, place private bids, and track hiring progress."}
        </p>
      </header>

      {/* Dashboard Body */}
      <div className="mt-6">
        {role === "candidate" ? (
          <CandidateDashboard />
        ) : (
          <EmployerDashboard />
        )}
      </div>
    </PageContainer>
  );
}
