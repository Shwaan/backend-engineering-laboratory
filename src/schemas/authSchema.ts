import { z } from "zod"

export const emailAvailabilitySchema = z.object({
    email: z.string().trim().pipe(
        z.email("Invalid email address")
    )
})

export const registerUserSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().pipe(
        z.email("Invalid email address")
    ),
    password: z.string().min(8, "Password must be at least 8 characters.")
})

export const verifyEmailSchema = z.object({
    registrationId: z.uuid("Invalid registration ID"),
    code: z.string()
        .regex(/^\d{6}$/, "Verification code must contain exactly 6 digits")
})

export type EmailAvailabilityInput = z.infer<typeof emailAvailabilitySchema>
export type RegisterInput = z.infer<typeof registerUserSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>