import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    PORT: z.coerce.number().int().min(1),
    NODE_ENV: z.enum([
        "development",
        "test",
        "production"
    ]),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
    DIRECT_URL: z.string().min(1, 'DIRECT_URL is required.'),
    OTP_HMAC_SECRET: z.string().regex(/^[0-9a-fA-F]{64}$/),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().min(1),
    SMTP_USER: z.string().trim().pipe(
        z.email("Invalid email address")
    ),
    SMTP_PASS: z.string().length(16, "Must be exactly 16 characters long."),
    REDIS_URL: z.string().min(1, "REDIS_URL is required"),
    AUTH_DUMMY_PASSWORD_HASH: z.string().startsWith("$argon2id$"),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
    console.error("Invalid environment configuration:")
    console.error(result.error.issues)

    process.exit(1)
}

export const env = result.data