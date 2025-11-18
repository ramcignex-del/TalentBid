// app/profile/setup/page.tsx
export default function ProfileSetupPage() {
  return (
    <section className="max-w-3xl mx-auto">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Complete your profile</h1>
        <p className="mt-2 text-sm text-slate-500">Add skills, minimum salary and availability so employers can place offers.</p>

        <form className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input className="mt-2 block w-full rounded-md border px-3 py-2" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <input className="mt-2 block w-full rounded-md border px-3 py-2" placeholder="City, India" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Skills</label>
            <input className="mt-2 block w-full rounded-md border px-3 py-2" placeholder="React, Node, TypeScript" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Minimum expected salary (₹/month)</label>
              <input className="mt-2 block w-full rounded-md border px-3 py-2" placeholder="e.g., 120000" />
            </div>
            <div>
              <label className="text-sm font-medium">Open to paid trial?</label>
              <select className="mt-2 block w-full rounded-md border px-3 py-2">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md">Save profile</button>
          </div>
        </form>
      </div>
    </section>
  );
}
