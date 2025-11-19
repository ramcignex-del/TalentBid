"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth state on mount
    const checkUser = async () => {
      try {
        const supabase = getBrowserSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const supabase = getBrowserSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getBrowserSupabase();
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard", authRequired: true },
    { label: "Talent", href: "/talent" },
    { label: "Employers", href: "/employer" },
  ];

  // Filter nav items based on auth state
  const visibleNavItems = user 
    ? navItems 
    : navItems.filter(item => !item.authRequired);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left — Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          TalentBid
        </Link>

        {/* Middle — Nav links (desktop) */}
        <div className="hidden md:flex space-x-8 ml-10">
          {visibleNavItems.map((item) => (
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
          {loading ? (
            <div className="text-sm text-slate-500">Loading...</div>
          ) : user ? (
            <>
              <div className="text-sm text-slate-700">
                {user.email}
              </div>
              <Link href="/profile/setup">
                <Button variant="ghost" className="text-sm">
                  Profile
                </Button>
              </Link>
              <Button 
                variant="primary" 
                className="text-sm px-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" className="text-sm px-4">
                  Sign up
                </Button>
              </Link>
            </>
          )}
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
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="px-4 py-3 border-t border-slate-200">
            {loading ? (
              <div className="text-sm text-slate-500 text-center py-2">Loading...</div>
            ) : user ? (
              <>
                <div className="text-sm text-slate-700 mb-2 px-2">
                  {user.email}
                </div>
                <Link href="/profile/setup" onClick={() => setOpen(false)}>
                  <Button className="w-full mb-2">Profile</Button>
                </Link>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full mb-2">Sign in</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setOpen(false)}>
                  <Button variant="primary" className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
