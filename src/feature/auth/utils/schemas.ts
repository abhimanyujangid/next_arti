import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  full_name: z.string(),
});

export const signUpSchema = signInSchema.extend({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
});

export function authCredentialsSchema(mode: "signin" | "signup") {
  return mode === "signup" ? signUpSchema : signInSchema;
}

export const forgotSchema = z.object({ 
  email: z.string().email("Please enter a valid email address.") 
});

export const resetPasswordFieldsSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Please confirm your password."),
});

export const resetPasswordSchema = resetPasswordFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  },
);
