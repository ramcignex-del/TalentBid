import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    ghost: "text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      className={cn(
        "px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
