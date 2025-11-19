"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

export default function PlaceBidModal({ open, onClose, candidate }: any) {
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");
  const [reveal, setReveal] = useState<"public" | "anonymous">("public");
  const [loading, setLoading] = useState(false);

  async function submitBid() {
    if (!salary || !candidate) return;

    setLoading(true);
    try {
      await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidate.id,
          salary: Number(salary),
          message,
          reveal_employer: reveal,
        }),
      });
    } catch (err) {
      console.error("Error placing bid", err);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  if (!open || !candidate) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-2xl font-semibold text-slate-900">Place Bid for {candidate.display_name || candidate.full_name}</h2>

      <Card className="mt-6 bg-slate-50 border-slate-200">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Min Expected Salary</span>
          <span className="font-medium text-slate-900">₹{candidate.min_salary?.toLocaleString() || "N/A"}</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span className="text-slate-500">Availability</span>
          <span className="font-medium text-slate-900">{candidate.availability || "Immediate"}</span>
        </div>
      </Card>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700">Your Salary Offer (annual)</label>
        <Input type="number" placeholder="Enter salary in INR" value={salary} onChange={(e) => setSalary(e.target.value)} className="mt-2" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700">Message (optional)</label>
        <textarea className="mt-2 w-full rounded-lg border border-slate-300 p-4 text-sm focus:ring-2 focus:ring-slate-900/10" rows={3} placeholder="Write a message to the candidate" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700">Reveal employer identity to candidate for this bid?</label>
        <div className="mt-2 flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="reveal" value="public" checked={reveal === "public"} onChange={() => setReveal("public")} />
            <span className="text-sm">Yes — reveal company</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="reveal" value="anonymous" checked={reveal === "anonymous"} onChange={() => setReveal("anonymous")} />
            <span className="text-sm">No — remain anonymous</span>
          </label>
        </div>
        <p className="text-xs text-slate-500 mt-2">This setting affects only this bid (snapshot) and will not change your profile visibility.</p>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submitBid} disabled={loading}>{loading ? "Submitting..." : "Place Bid"}</Button>
      </div>
    </Modal>
  );
}
