"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Talent", href: "/talent" }, // future pages
    { label: "Employers", href: "/employers" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left — Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          TalentBid
        </Link>

        {/* Middle — Nav links (desktop) */}
        <div className="hidden md:flex space-x-8 ml-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition ${
                pathname === item.href
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right — Auth or Avatar */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-sm">
            Profile
          </Button>
          <Button variant="primary" className="text-sm px-4">
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6 text-slate-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}

          <div className="px-4 py-3 border-t border-slate-200">
            <Button className="w-full mb-2">Profile</Button>
            <Button variant="primary" className="w-full">
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
