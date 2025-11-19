"use client";

import BidCard from "./BidCard";
import BidDetailModal from "./BidDetailModal";
import { useState } from "react";

export default function MyBidsList({ bids }: any) {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  function view(bid: any) {
    setSelected(bid);
    setOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bids.map((bid: any) => (
          <BidCard key={bid.id} bid={bid} onView={() => view(bid)} />
        ))}
      </div>

      <BidDetailModal
        open={open}
        onClose={() => setOpen(false)}
        bid={selected}
      />
    </>
  );
}
