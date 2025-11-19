"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // successful login — redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <Card className="w-full max-w-md p-10">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 mt-2">Sign in to access your dashboard and bids.</p>

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

          <Button className="w-full mt-4" onClick={submit} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm text-slate-600 mt-4">
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-slate-900 font-medium hover:underline">
              Create one
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
