"use client";

import { Modal } from "./ui/Modal";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export default function BidDetailModal({ open, onClose, bid }: any) {
  if (!open || !bid) return null;

  const statusMap: any = {
    accepted: { label: "Accepted", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
    pending: { label: "Pending", variant: "warning" },
  };

  const st = statusMap[bid.status] || statusMap.pending;
  const employerName = bid.employer?.company_name || bid.employer_name || (bid.employer?.anonymous ? "Anonymous Employer" : "Employer");

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-2xl font-semibold text-slate-900">{employerName}</h2>

      <div className="mt-2">
        <Badge variant={st.variant}>{st.label}</Badge>
      </div>

      <div className="mt-6 text-sm flex justify-between">
        <span className="text-slate-500">Salary Offered</span>
        <span className="font-medium text-slate-900 text-lg">{bid.salary ? `₹${Number(bid.salary).toLocaleString()}` : "—"}</span>
      </div>

      {bid.message && <p className="mt-6 text-slate-700 leading-relaxed">{bid.message}</p>}

      <div className="mt-10 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
