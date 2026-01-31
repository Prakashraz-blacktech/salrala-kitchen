import { z } from "zod"

export const loginSchema = z.object({
    phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be less than 12 digits")
    .regex(/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number"),
  })
  
  export type LoginFormData = z.infer<typeof loginSchema>