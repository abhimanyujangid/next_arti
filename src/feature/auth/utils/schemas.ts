import { z } from "zod";

export const signInSchema = z.object({ 
  email: z.string().email("Please enter a valid email address."), 
  password: z.string().min(6, "Password must be at least 6 characters.") 
});

export const signUpSchema = signInSchema.extend({ 
  full_name: z.string().min(2, "Name must be at least 2 characters.") 
});

export const forgotSchema = z.object({ 
  email: z.string().email("Please enter a valid email address.") 
});
