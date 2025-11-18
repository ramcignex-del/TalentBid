// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <div className="bg-white rounded-2xl p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              TalentBid — companies bid privately to hire talent
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl">
              List your availability and minimum salary. Employers place sealed offers — you see them and decide. Optional paid trials streamline hiring and replace long interview loops.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/profile/setup" className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white font-medium">
                I am Talent
              </Link>
              <Link href="/dashboard" className="inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 text-slate-700">
                I am Employer
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              <li>• Private sealed bidding for salaries</li>
              <li>• Optional 2–5 day paid trial</li>
              <li>• AI-assisted profile & resume parsing</li>
              <li>• Fast hires, less interview overhead</li>
            </ul>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-6 border">
                <h3 className="text-lg font-semibold text-slate-800">Featured Candidates</h3>
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Frontend Engineer</div>
                        <div className="text-xs text-slate-500">React · 4 yrs</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-800">₹1.2L p.m.</div>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Product Designer</div>
                        <div className="text-xs text-slate-500">Figma · 3 yrs</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-800">₹90k p.m.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
