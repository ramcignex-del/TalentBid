export default function Hero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-28 text-center bg-gradient-to-b from-slate-50 to-white">
      <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}

      {children && <div className="mt-10">{children}</div>}
    </div>
  );
}
