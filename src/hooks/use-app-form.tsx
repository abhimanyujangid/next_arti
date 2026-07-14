"use client";

import { useState } from "react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const underlineInputClassName =
  "h-auto rounded-none border-0 border-b border-foreground/30 bg-transparent px-0 py-2 text-[0.95rem] shadow-none ring-0 outline-none focus-visible:border-accent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

function normalizeErrors(
  errors: unknown[],
): Array<{ message?: string } | undefined> {
  return errors.map((error) => {
    if (typeof error === "string") return { message: error };
    if (error && typeof error === "object" && "message" in error) {
      return { message: String((error as { message: unknown }).message) };
    }
    return { message: error != null ? String(error) : undefined };
  });
}

function TextField({
  label,
  className,
  type,
  ...props
}: { label: string } & React.ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name} className="eyebrow text-xs font-normal">
        {label}
      </FieldLabel>
      {isPassword ? (
        <div className="relative">
          <Input
            {...props}
            id={field.name}
            name={field.name}
            type={showPassword ? "text" : "password"}
            value={field.state.value ?? ""}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            aria-invalid={isInvalid}
            className={cn(
              underlineInputClassName,
              "pr-10",
              isInvalid &&
                "border-destructive/80 focus-visible:border-destructive/80",
              className,
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-0 -translate-y-1/2 p-1 text-muted-foreground hover:text-accent"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      ) : (
        <Input
          {...props}
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          className={cn(
            underlineInputClassName,
            isInvalid &&
              "border-destructive/80 focus-visible:border-destructive/80",
            className,
          )}
        />
      )}
      {isInvalid && (
        <FieldError errors={normalizeErrors(field.state.meta.errors)} />
      )}
    </Field>
  );
}

export const { useAppForm, useTypedAppFormContext, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
});

export { useFormContext, useFieldContext };
