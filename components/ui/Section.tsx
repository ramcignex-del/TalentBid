export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-800">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-slate-500 max-w-2xl">
          {subtitle}
        </p>
      )}

      <div className="mt-12">{children}</div>
    </section>
  );
}
