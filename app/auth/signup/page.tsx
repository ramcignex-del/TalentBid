"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(false);

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setLoading(true);

    await fetch("/api/auth/user", {
      method: "POST",
      body: JSON.stringify({ type: "signup", ...form }),
    });

    setLoading(false);
    window.location.href = "/profile/setup";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <Card className="w-full max-w-md p-10">
        <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
        <p className="text-slate-600 mt-2">
          Join TalentBid — India’s first private sealed bid marketplace for jobs.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              className="mt-2"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              type="password"
              className="mt-2"
              placeholder="•••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>

          {/* Role Selector */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              I am signing up as
            </label>
            <select
              className="mt-2 w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900/10"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="candidate">Candidate (Looking for job)</option>
              <option value="employer">Employer (Posting jobs & bids)</option>
            </select>
          </div>

          <Button className="w-full mt-4" onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <div className="text-center text-sm text-slate-600 mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-slate-900 font-medium hover:underline">
              Login
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
