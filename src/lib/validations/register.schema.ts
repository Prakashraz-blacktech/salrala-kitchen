import { z } from "zod"

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be less than 12 digits")
    .regex(/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
