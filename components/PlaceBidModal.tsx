"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

export default function PlaceBidModal({ open, onClose, candidate }: any) {
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitBid() {
    if (!salary) return;

    setLoading(true);

    await fetch("/api/bids", {
      method: "POST",
      body: JSON.stringify({
        candidate_id: candidate.id,
        salary: Number(salary),
        message,
      }),
    });

    setLoading(false);
    onClose();
  }

  if (!open || !candidate) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-2xl font-semibold text-slate-900">
        Place Bid for {candidate.full_name}
      </h2>

      {/* Candidate Summary */}
      <Card className="mt-6 bg-slate-50 border-slate-200">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Min Expected Salary</span>
          <span className="font-medium text-slate-900">
            ₹{candidate.min_salary?.toLocaleString()}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span className="text-slate-500">Availability</span>
          <span className="font-medium text-slate-900">
            {candidate.availability || "Immediate"}
          </span>
        </div>
      </Card>

      {/* Salary Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-slate-700">
          Your Salary Offer
        </label>
        <Input
          type="number"
          placeholder="Enter salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Message */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700">
          Message (Optional)
        </label>
        <textarea
          className="mt-2 w-full rounded-lg border border-slate-300 p-4 text-sm focus:ring-2 focus:ring-slate-900/10"
          rows={3}
          placeholder="Write a message to the candidate"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submitBid} disabled={loading}>
          {loading ? "Submitting..." : "Place Bid"}
        </Button>
      </div>
    </Modal>
  );
}
