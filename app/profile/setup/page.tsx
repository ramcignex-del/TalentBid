"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProfileSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    title: "",
    min_salary: "",
    skills: "",
    experience: "",
    summary: "",
    availability: "Immediate",
    visibility_mode: "public",
  });
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        // not logged in -> redirect to login
        router.push("/auth/login");
        return;
      }
      setUserId(user.id);

      // load existing candidate profile
      const { data: candidate } = await supabase.from("candidates").select("*").eq("user_id", user.id).limit(1).maybeSingle();

      if (candidate) {
        setForm({
          full_name: candidate.full_name || "",
          title: candidate.title || "",
          min_salary: String(candidate.min_salary || candidate.expected_salary || ""),
          skills: (candidate.skills && (Array.isArray(candidate.skills) ? candidate.skills.join(", ") : candidate.skills)) || candidate.skills || "",
          experience: String(candidate.experience || ""),
          summary: candidate.summary || "",
          availability: candidate.availability || "Immediate",
          visibility_mode: candidate.visibility_mode || "public",
        });
      }

      setLoading(false);
    }

    init();
  }, [router]);

  async function submit() {
    if (!userId) {
      router.push("/auth/login");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // upsert candidate record (if user has one, update; otherwise insert)
      // normalize skills to array for storage (optional)
      const skillsArray = form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

      const payload: any = {
        user_id: userId,
        full_name: form.full_name || null,
        title: form.title || null,
        min_salary: form.min_salary ? Number(form.min_salary) : null,
        expected_salary: form.min_salary ? Number(form.min_salary) : null,
        skills: skillsArray.length ? skillsArray : null,
        experience: form.experience ? Number(form.experience) : null,
        summary: form.summary || null,
        availability: form.availability || null,
        visibility_mode: form.visibility_mode || "public",
        created_at: new Date().toISOString(),
      };

      // Check if candidate exists
      const { data: existing } = await supabase.from("candidates").select("id").eq("user_id", userId).limit(1).maybeSingle();

      if (existing?.id) {
        await supabase.from("candidates").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("candidates").insert(payload);
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-slate-600">Loading profile…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-semibold text-slate-900">Complete Your Profile</h1>
      <p className="text-slate-600 mt-2">Employers will use this information to evaluate you and send private bids.</p>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Basic Details</h2>
            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input className="mt-2" placeholder="Your name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Professional Title</label>
              <Input className="mt-2" placeholder="e.g. Senior React Developer" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Minimum Expected Salary (Annual)</label>
              <Input type="number" className="mt-2" placeholder="e.g. 1500000" value={form.min_salary} onChange={(e) => update("min_salary", e.target.value)} />
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Skills & Experience</h2>

            <div>
              <label className="text-sm font-medium text-slate-700">Skills (comma separated)</label>
              <Input className="mt-2" placeholder="JavaScript, React, Node.js" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Total Experience (years)</label>
              <Input type="number" className="mt-2" placeholder="5" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Professional Summary</h2>

            <textarea className="w-full rounded-xl border border-slate-300 p-4 text-sm h-32 focus:ring-2 focus:ring-slate-900/10" placeholder="Describe your background..." value={form.summary} onChange={(e) => update("summary", e.target.value)} />
          </Card>

          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Availability & Visibility</h2>

            <div>
              <label className="text-sm font-medium text-slate-700">Availability</label>
              <select className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-slate-900/10" value={form.availability} onChange={(e) => update("availability", e.target.value)}>
                <option>Immediate</option>
                <option>Within 15 Days</option>
                <option>Within 30 Days</option>
                <option>Within 60 Days</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Profile Visibility</label>
              <select className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-slate-900/10" value={form.visibility_mode} onChange={(e) => update("visibility_mode", e.target.value)}>
                <option value="public">Public (show name)</option>
                <option value="anonymous">Anonymous (hide name from employers)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">If anonymous, employers will see a generic candidate listing without your name or contact details.</p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <Card className="p-8 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Live Preview</h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium text-slate-800">{form.full_name || "—"}</p>
              </div>

              <div>
                <p className="text-slate-500">Title</p>
                <p className="font-medium text-slate-800">{form.title || "—"}</p>
              </div>

              <div>
                <p className="text-slate-500">Minimum Salary</p>
                <p className="font-medium text-slate-800">{form.min_salary ? `₹${Number(form.min_salary).toLocaleString()}` : "—"}</p>
              </div>

              <div>
                <p className="text-slate-500">Skills</p>
                <p className="font-medium text-slate-800">{form.skills || "—"}</p>
              </div>

              <div>
                <p className="text-slate-500">Summary</p>
                <p className="text-slate-700 whitespace-pre-wrap">{form.summary || "—"}</p>
              </div>

              <div>
                <p className="text-slate-500">Availability</p>
                <p className="font-medium text-slate-800">{form.availability}</p>
              </div>

              <div>
                <p className="text-slate-500">Visibility</p>
                <p className="font-medium text-slate-800">{form.visibility_mode === "public" ? "Public" : "Anonymous"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
