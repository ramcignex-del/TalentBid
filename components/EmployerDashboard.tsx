"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import PlaceBidModal from "./PlaceBidModal";

export default function EmployerDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch("/api/candidates");
        const data = await res.json();
        setCandidates(data || []);
      } catch (err) {
        console.error("Error loading candidates:", err);
      }
    }

    fetchCandidates();
  }, []);

  function openBid(candidate: any) {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  }

  return (
    <div className="pb-20">

      {/* Section Header */}
      <header className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900">
          Available Talent
        </h2>
        <p className="mt-2 text-slate-600">
          Browse vetted candidates ready to join immediately. Click “Place Bid” to send a private salary bid.
        </p>
      </header>

      {/* Candidate Grid */}
      {candidates.length === 0 ? (
        <div className="text-center text-slate-500 py-20">
          No candidates found at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((c: any) => (
            <Card key={c.id} className="group hover:shadow-md transition">
              
              {/* Name & Role */}
              <h3 className="text-xl font-semibold text-slate-800">
                {c.full_name || "Unnamed Candidate"}
              </h3>

              <p className="mt-1 text-slate-600">
                {c.role || "Role not specified"}
              </p>

              {/* Experience */}
              {c.experience && (
                <p className="mt-1 text-slate-500 text-sm">
                  {c.experience} years experience
                </p>
              )}

              {/* Skills */}
              {c.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.skills.map((skill: string) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              )}

              {/* Salary + Availability */}
              <div className="mt-6 flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Min Expected</span>
                  <span className="font-medium text-slate-800">
                    ₹{c.min_salary?.toLocaleString() || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-medium text-slate-800">
                    {c.availability || "Immediate"}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Button
                  className="w-full"
                  onClick={() => openBid(c)}
                >
                  Place Bid
                </Button>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      <PlaceBidModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
}
