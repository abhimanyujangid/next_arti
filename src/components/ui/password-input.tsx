import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [show, setShow] = useState(false);
    
    const inputContent = (
      <div className="relative">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={`w-full bg-transparent border-b border-foreground/30 py-2 pr-10 outline-none text-[0.95rem] focus:border-accent transition-colors ${className || ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent p-1"
          tabIndex={-1}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );

    if (label) {
      return (
        <label className="block">
          <span className="eyebrow">{label}</span>
          <div className="mt-2">{inputContent}</div>
          {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
        </label>
      );
    }

    return inputContent;
  }
);

PasswordInput.displayName = "PasswordInput";
