"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "candidate" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          // redirectTo is optional, Vercel domain can be added if using redirect magic links
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // At this point the user account is created.
      // We'll create the profile record (candidate or employer) after they verify or on first save.
      // Redirect to profile setup for convenience
      router.push("/profile/setup");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <Card className="w-full max-w-md p-10">
        <h1 className="text-3xl font-semibold text-slate-900">Create an account</h1>
        <p className="text-slate-600 mt-2">Join TalentBid — India’s sealed-bid hiring marketplace.</p>

        <div className="mt-8 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input type="email" className="mt-2" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input type="password" className="mt-2" placeholder="•••••••" value={form.password} onChange={(e) => update("password", e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">I am signing up as</label>
            <select className="mt-2 w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900/10" value={form.role} onChange={(e) => update("role", e.target.value)}>
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
