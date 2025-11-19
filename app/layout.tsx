import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "TalentBid — Private Talent Marketplace",
  description: "Private bidding hiring marketplace for India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="min-h-screen antialiased text-slate-800">
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-6 pb-20">{children}</main>
      </body>
    </html>
  );
}
