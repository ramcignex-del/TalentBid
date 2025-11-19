"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import BidDetailModal from "./BidDetailModal";

export default function CandidateDashboard() {
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadBids() {
      try {
        const res = await fetch("/api/bids");
        const data = await res.json();
        setBids(data || []);
      } catch (error) {
        console.error("Error loading bids:", error);
      }
    }

    loadBids();
  }, []);

  function openDetails(bid: any) {
    setSelectedBid(bid);
    setModalOpen(true);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900">
          Your Employer Bids
        </h2>
        <p className="mt-2 text-slate-600">
          Review private employer bids, compare salaries, and choose the best fit.
        </p>
      </header>

      {/* Empty State */}
      {bids.length === 0 ? (
        <div className="text-center text-slate-500 py-20">
          You haven't received any bids yet.
          <br />
          <span className="text-slate-400 text-sm">
            Once employers view your profile, their private offers will appear here.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bids.map((bid: any) => (
            <Card key={bid.id} className="group hover:shadow-md transition">
              {/* Employer Name */}
              <h3 className="text-xl font-semibold text-slate-800">
                {bid.employer_name || "Unnamed Employer"}
              </h3>

              {/* Status */}
              <div className="mt-2">{getStatusBadge(bid.status)}</div>

              {/* Salary Offered */}
              <div className="mt-6 flex justify-between text-sm">
                <span className="text-slate-500">Salary Offered</span>
                <span className="font-medium text-slate-800">
                  ₹{bid.salary?.toLocaleString() || "N/A"}
                </span>
              </div>

              {/* Notes */}
              {bid.message && (
                <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                  {bid.message}
                </p>
              )}

              {/* CTA */}
              <div className="mt-8">
                <Button className="w-full" onClick={() => openDetails(bid)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <BidDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bid={selectedBid}
      />
    </div>
  );
}
