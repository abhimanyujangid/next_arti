import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  field: any; // Type as any to easily support different generic shapes of TanStack FieldApi
}

export function FormField({ label, field, className, ...props }: FormFieldProps) {
  const errors = field.state.meta.errors;
  const isTouched = field.state.meta.isTouched;
  const error = errors.length > 0 ? errors[0]?.toString() : null;
  const showErr = isTouched && error;

  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">
        <input
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={`w-full bg-transparent border-b border-foreground/30 py-2 outline-none text-[0.95rem] focus:border-accent transition-colors ${
            showErr ? "border-destructive/80" : ""
          } ${className || ""}`}
          {...props}
        />
      </div>
      {showErr && (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}
