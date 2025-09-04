
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  style,
  ...props
}) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg outline-none border-slate-300 ${className}`}
    style={{
      ...style,
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#e1eed6';
      e.target.style.boxShadow = '0 0 0 1px #e1eed6';
      if (props.onFocus) props.onFocus(e);
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#d1d5db';
      e.target.style.boxShadow = 'none';
      if (props.onBlur) props.onBlur(e);
    }}
    {...props}
  />
);