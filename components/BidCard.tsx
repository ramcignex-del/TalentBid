"use client";

import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export default function BidCard({ bid, onView }: any) {
  if (!bid) return null;

  const statusMap: any = {
    accepted: { label: "Accepted", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
    pending:  { label: "Pending", variant: "warning" },
  };

  return (
    <Card className="group hover:shadow-md transition cursor-pointer">
      {/* Employer Name */}
      <h3 className="text-lg font-semibold text-slate-900">
        {bid.employer_name || "Employer"}
      </h3>

      {/* Status Badge */}
      <div className="mt-2">
        <Badge variant={statusMap[bid.status]?.variant}>
          {statusMap[bid.status]?.label}
        </Badge>
      </div>

      {/* Salary */}
      <div className="mt-6 flex justify-between text-sm">
        <span className="text-slate-500">Salary Offered</span>
        <span className="font-medium text-slate-800">
          ₹{bid.salary?.toLocaleString()}
        </span>
      </div>

      {/* Message */}
      {bid.message && (
        <p className="mt-4 text-sm text-slate-600 line-clamp-2">
          {bid.message}
        </p>
      )}

      {/* CTA */}
      <div className="mt-8">
        <Button className="w-full" onClick={onView}>
          View Details
        </Button>
      </div>
    </Card>
  );
}
