import { formOptions } from "@tanstack/react-form";

import {
  forgotSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  authCredentialsSchema,
} from "./schemas";

export const signInFormOptions = formOptions({
  defaultValues: {
    email: "",
    password: "",
    full_name: "",
  },
});

export const signUpFormOptions = formOptions({
  defaultValues: {
    email: "",
    password: "",
    full_name: "",
  },
});

export const forgotPasswordFormOptions = formOptions({
  defaultValues: {
    email: "",
  },
});

export const resetPasswordFormOptions = formOptions({
  defaultValues: {
    password: "",
    confirmPassword: "",
  },
});

export {
  forgotSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  authCredentialsSchema,
};
