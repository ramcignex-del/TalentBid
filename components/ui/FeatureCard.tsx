export default function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
