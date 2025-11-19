"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CandidateCard({ candidate, onBid }: any) {
  return (
    <Card className="p-8 group hover:shadow-md transition">
      <div className="flex flex-col gap-4">
        {/* Name */}
        <h3 className="text-xl font-semibold text-slate-900">
          {candidate.full_name}
        </h3>

        {/* Title */}
        <p className="text-slate-600 text-sm">{candidate.title}</p>

        {/* Skills */}
        {candidate.skills && (
          <div className="flex flex-wrap gap-2 mt-2">
            {candidate.skills.split(",").map((skill: string) => (
              <Badge key={skill} variant="neutral">
                {skill.trim()}
              </Badge>
            ))}
          </div>
        )}

        {/* Salary */}
        <div className="mt-4 text-sm flex justify-between">
          <span className="text-slate-500">Min Salary</span>
          <span className="font-medium text-slate-900">
            ₹{Number(candidate.min_salary).toLocaleString()}
          </span>
        </div>

        {/* Experience */}
        <div className="text-sm flex justify-between">
          <span className="text-slate-500">Experience</span>
          <span className="font-medium text-slate-900">
            {candidate.experience || 0} yrs
          </span>
        </div>

        {/* Availability */}
        <div className="text-sm flex justify-between">
          <span className="text-slate-500">Availability</span>
          <span className="font-medium text-slate-900">
            {candidate.availability}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-4 text-sm text-slate-700 line-clamp-3">
          {candidate.summary || "No summary provided."}
        </p>

        {/* CTA */}
        <Button className="mt-6 w-full" onClick={onBid}>
          Place Bid
        </Button>
      </div>
    </Card>
  );
}
