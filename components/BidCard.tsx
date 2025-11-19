"use client";

import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export default function BidCard({ bid, onView }: any) {
  if (!bid) return null;

  const statusMap: any = {
    accepted: { label: "Accepted", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
    pending: { label: "Pending", variant: "warning" },
  };

  const status = statusMap[bid.status] || statusMap.pending;

  // Determine what employer identity to show to the current viewer (server should have enforced)
  const employerName = bid.employer?.company_name || bid.employer_name || (bid.employer?.anonymous ? "Anonymous Employer" : "Employer");

  return (
    <Card className="group hover:shadow-md transition cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{employerName}</h3>
          <div className="mt-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between text-sm">
        <span className="text-slate-500">Salary Offered</span>
        <span className="font-medium text-slate-800">
          {/* For candidate views, server will include salary. For employer-other views, salary will be redacted server-side. */}
          {bid.salary ? `₹${Number(bid.salary).toLocaleString()}` : "—"}
        </span>
      </div>

      {bid.message && (
        <p className="mt-4 text-sm text-slate-600 line-clamp-2">{bid.message}</p>
      )}

      <div className="mt-8">
        <Button className="w-full" onClick={onView}>View Details</Button>
      </div>
    </Card>
  );
}
