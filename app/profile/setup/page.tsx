"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProfileSetup() {
  const [form, setForm] = useState({
    full_name: "",
    title: "",
    min_salary: "",
    skills: "",
    experience: "",
    summary: "",
    availability: "Immediate",
  });

  const [saving, setSaving] = useState(false);

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setSaving(true);

    await fetch("/api/candidates", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setSaving(false);
    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-semibold text-slate-900">
        Complete Your Profile
      </h1>
      <p className="text-slate-600 mt-2">
        Employers will use this information to evaluate you and send private bids.
      </p>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-10">
          {/* Personal Info */}
          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Basic Details</h2>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <Input
                className="mt-2"
                placeholder="Your name"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Professional Title
              </label>
              <Input
                className="mt-2"
                placeholder="e.g. Senior React Developer"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Minimum Expected Salary (Annual)
              </label>
              <Input
                type="number"
                className="mt-2"
                placeholder="e.g. 15,00,000"
                value={form.min_salary}
                onChange={(e) => update("min_salary", e.target.value)}
              />
            </div>
          </Card>

          {/* Skills + Experience */}
          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Skills & Experience
            </h2>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Skills (comma separated)
              </label>
              <Input
                className="mt-2"
                placeholder="JavaScript, React, Node.js"
                value={form.skills}
                onChange={(e) => update("skills", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Total Experience (years)
              </label>
              <Input
                type="number"
                className="mt-2"
                placeholder="5"
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
              />
            </div>
          </Card>

          {/* Summary */}
          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Professional Summary
            </h2>

            <textarea
              className="w-full rounded-xl border border-slate-300 p-4 text-sm h-32 focus:ring-2 focus:ring-slate-900/10"
              placeholder="Describe your background, strengths, and what you are looking for..."
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
            />
          </Card>

          {/* Availability */}
          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Availability
            </h2>

            <select
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-slate-900/10"
              value={form.availability}
              onChange={(e) => update("availability", e.target.value)}
            >
              <option>Immediate</option>
              <option>Within 15 Days</option>
              <option>Within 30 Days</option>
              <option>Within 60 Days</option>
            </select>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button onClick={submit} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div>
          <Card className="p-8 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              Live Preview
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium text-slate-800">
                  {form.full_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Title</p>
                <p className="font-medium text-slate-800">
                  {form.title || "—"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Minimum Salary</p>
                <p className="font-medium text-slate-800">
                  {form.min_salary
                    ? `₹${Number(form.min_salary).toLocaleString()}`
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Skills</p>
                <p className="font-medium text-slate-800">
                  {form.skills || "—"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Summary</p>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {form.summary || "—"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Availability</p>
                <p className="font-medium text-slate-800">
                  {form.availability}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
