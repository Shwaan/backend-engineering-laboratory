import { transporter } from "../../utils/emailServices";
import { buildVerificationEmail } from "../../utils/emailTemplate";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { hashPassword } from "../../utils/password";
import { generateVerificationCode } from "../../utils/verificationCode";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { db } from "../prisma/db";


export const authService = {
    async checkEmailAvailability(email: string) {
        const normalizedEmail = normalizeEmail(email)

        const user = await db.orm.public.User
            .where({ normalizedEmail })
            .first()

        const pendingRegistration = await db.orm.public.PendingRegistration
            .where({ normalizedEmail })
            .first()

        return {
            available: !user && !pendingRegistration
        }
    },

    async registerUser(name: string, email: string, password: string) {
        const normalizedEmail = normalizeEmail(email)

        // Check if the verified account exists.
        const existingUser = await db.orm.public.User
            .where({ normalizedEmail })
            .first()

        if (existingUser) {
            throw new AppError(
                409,
                "EMAIL_ALREADY_EXISTS",
                "An account with this email already exists."
            );
        }

        const pendingRegistration = await db.orm.public.PendingRegistration
            .where({ normalizedEmail })
            .first()

        const hashedPassword = hashPassword(password)

        // Generate and send verification code.
        const verificationCode = generateVerificationCode()
        const emailContent = buildVerificationEmail({
            name,
            verificationCode,
        })
        try {
            await transporter.sendMail({
                from: `"Random Subedi" <${env.SMTP_USER}>`,
                to: email,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html,
            });

            console.log("Message Sent succesfully.")
            // console.log("Info: ", info)
        } catch (err) {
            console.error("Verification failed:", err);
        }

        // ToDo: Store pending registration.

        return {
            "message": "User created successfully.",
        }
    }
}