
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" }
> = ({ children, className = "", variant = "solid", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 ${
      variant === "outline"
        ? "border text-white hover:bg-slate-100"
        : "text-white hover:opacity-90"
    } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    style={{
      backgroundColor: variant === "outline" ? "transparent" : "#44624a",
      borderColor: variant === "outline" ? "#8ba888" : "#44624a",
      color: variant === "outline" ? "#505143" : "white"
    }}
    {...props}
  >
    {children}
  </button>
);
