"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function EmployersPage() {
  return (
    <div className="pb-24">
      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="default" className="text-sm mb-6">
            For Employers & Hiring Teams
          </Badge>

          <h1 className="text-5xl font-semibold text-slate-900 leading-tight">
            Hire Top Talent Through<br />
            <span className="text-slate-600">
              Private, Sealed Salary Bids
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            TalentBid lets you make confidential salary offers to verified
            candidates. No competition spam. No noisy job boards. Only serious
            employers reach talent directly.
          </p>

          <Button className="mt-10 px-10 py-6 text-lg" onClick={() => (window.location.href = "/auth/signup")}>
            Start Hiring
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 mt-28">
        <h2 className="text-3xl font-semibold text-slate-900 text-center">
          How TalentBid Works
        </h2>
        <p className="text-slate-600 text-center mt-3">
          A transparent, fair, and fast way to hire top talent in India.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-16">
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">1. Browse Talent</h3>
            <p className="mt-3 text-slate-600 text-sm">
              View available candidates with verified experience, skills, and salary expectations.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">2. Make a Bid</h3>
            <p className="mt-3 text-slate-600 text-sm">
              Submit a private salary offer. Other employers can’t see your bid.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">3. Get Matched</h3>
            <p className="mt-3 text-slate-600 text-sm">
              If your bid is competitive, the candidate accepts and moves forward with you.
            </p>
          </Card>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="max-w-6xl mx-auto px-6 mt-28">
        <h2 className="text-3xl font-semibold text-slate-900 text-center">
          Why Employers Choose TalentBid
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
          {[
            {
              title: "Faster Hiring Cycle",
              desc: "Direct access to pre-screened, ready-to-join candidates.",
            },
            {
              title: "Confidential Offers",
              desc: "Your salary bid is private—competitors never see your offer.",
            },
            {
              title: "Zero Job Post Spam",
              desc: "No irrelevant applications. Only serious talent.",
            },
            {
              title: "Sealed-Bid Fairness",
              desc: "Talent chooses based on compensation & company culture—not spammed offers.",
            },
            {
              title: "High-Quality Talent",
              desc: "Candidates are verified and typically just laid off or actively seeking.",
            },
            {
              title: "Perfect for India",
              desc: "Optimized for the Indian hiring ecosystem—fast, efficient, private.",
            },
          ].map((b, i) => (
            <Card key={i} className="p-6">
              <h3 className="text-lg font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{b.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-32 px-6">
        <h2 className="text-4xl font-semibold text-slate-900">
          Ready to hire smarter?
        </h2>
        <p className="text-slate-600 mt-4">
          Start sending private, sealed bids to top Indian talent.
        </p>

        <Button className="mt-10 px-10 py-6 text-lg" onClick={() => (window.location.href = "/auth/signup")}>
          Create Employer Account
        </Button>
      </section>
    </div>
  );
}
