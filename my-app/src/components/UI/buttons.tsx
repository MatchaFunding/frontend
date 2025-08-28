
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" }
> = ({ children, className = "", variant = "solid", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 ${
      variant === "outline"
        ? "border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
        : "bg-emerald-600 text-white hover:bg-emerald-700"
    } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);
