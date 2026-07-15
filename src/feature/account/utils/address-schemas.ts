import { z } from "zod";

export const addressFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().min(8, "Phone is required."),
  line1: z.string().trim().min(3, "Address line 1 is required."),
  line2: z.string().trim().optional().nullable(),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  pincode: z.string().trim().min(4, "Pincode is required."),
  country: z.string().trim().min(2, "Country is required."),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export type AddressRow = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};
