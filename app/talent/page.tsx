"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import CandidateCard from "@/components/CandidateCard";
import PlaceBidModal from "@/components/PlaceBidModal";

export default function TalentPage() {
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [openBid, setOpenBid] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCandidates(data || []);
      setFiltered(data || []);
    }
    load();
  }, []);

  // Simple client-side search
  useEffect(() => {
    if (!query.trim()) {
      setFiltered(candidates);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      candidates.filter((c: any) => {
        return (
          c.full_name?.toLowerCase().includes(q) ||
          c.title?.toLowerCase().includes(q) ||
          c.skills?.toLowerCase().includes(q)
        );
      })
    );
  }, [query, candidates]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        Explore Talent
      </h1>
      <p className="text-slate-600 mt-2">
        Browse available candidates and send private sealed bids.
      </p>

      {/* Search / Filters */}
      <Card className="p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by name, skills, or title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {filtered.map((candidate: any) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onBid={() => {
              setSelected(candidate);
              setOpenBid(true);
            }}
          />
        ))}
      </div>

      {/* Bid Modal */}
      <PlaceBidModal
        open={openBid}
        onClose={() => setOpenBid(false)}
        candidate={selected}
      />
    </div>
  );
}
