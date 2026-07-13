import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <label className="block">
        <span className="eyebrow">{label}</span>
        <div className="mt-2">
          <input
            ref={ref}
            className={`w-full bg-transparent border-b border-foreground/30 py-2 outline-none text-[0.95rem] focus:border-accent transition-colors ${className || ""}`}
            {...props}
          />
        </div>
        {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
      </label>
    );
  }
);

InputField.displayName = "InputField";
