import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5",
        "text-sm text-slate-800 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500",
        "transition",
        className
      )}
      {...props}
    />
  );
}
