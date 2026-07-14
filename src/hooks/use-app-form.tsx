"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

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
  ...props
}: { label: string } & React.ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name} className="eyebrow text-xs font-normal">
        {label}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...props}
      />
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
