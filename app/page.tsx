"use client";

import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";
import Hero from "@/components/ui/Hero";
import Section from "@/components/ui/Section";
import FeatureCard from "@/components/ui/FeatureCard";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <Hero
        title="Hire Faster with Private Talent Bidding"
        subtitle="Discover top Indian talent ready to join immediately. Employers place sealed bids, candidates pick the best match."
      >
        <Link href="/auth/signup">
          <Button className="px-8 py-4 text-lg rounded-xl">
            Get Started — It's Free
          </Button>
        </Link>
      </Hero>

      {/* FEATURE SECTIONS */}
      <PageContainer>
        <Section
          title="Why TalentBid?"
          subtitle="A modern hiring marketplace built for speed, transparency, and fairness."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Private Salary Bids"
              description="Employers place sealed salary bids — candidates choose the best offer without public pressure."
            />

            <FeatureCard
              title="Zero Interviews (Optional)"
              description="Skip interviews. Talent can opt for a 2–5 day trial instead."
            />

            <FeatureCard
              title="Hire in 24–72 Hours"
              description="Designed for immediate availability. No waiting, no long cycles."
            />

            <FeatureCard
              title="AI-Matched Talent"
              description="AI generates talent summaries, highlights, and job fit scores."
            />

            <FeatureCard
              title="Verified Fast Onboarding"
              description="Candidates list notice periods, availability, minimum expectations."
            />

            <FeatureCard
              title="Fair, Transparent System"
              description="No bidding wars. No lowballing. Candidates see all offers privately."
            />
          </div>
        </Section>

        <Section
          title="How It Works"
          subtitle="A simple talent marketplace built for India’s fast-moving teams."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div>
              <h3 className="text-xl font-semibold text-slate-700">
                1. Talent Lists Minimum Expected Salary
              </h3>
              <p className="mt-3 text-slate-500">
                Candidates mark themselves available with minimum expected CTC.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-700">
                2. Employers Place Private Bids
              </h3>
              <p className="mt-3 text-slate-500">
                Companies place sealed salary bids. No one sees others’ bids.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-700">
                3. Candidate Picks Best Offer
              </h3>
              <p className="mt-3 text-slate-500">
                Talent selects based on salary, culture fit, or even trial period.
              </p>
            </div>

          </div>
        </Section>

        {/* FINAL CTA */}
        <Section title="Start Hiring Smarter">
          <div className="text-center">
            <Link href="/auth/signup">
              <Button className="px-10 py-4 text-lg rounded-xl">
                Create Free Account
              </Button>
            </Link>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
}
