import { transporter } from "../../utils/emailServices";
import { buildVerificationEmail } from "../../utils/emailTemplate";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { hashPassword } from "../../utils/password";
import { generateVerificationCode, hashVerificationCode, verifyVerificationCode } from "../../utils/verificationCode";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { db } from "../prisma/db";
import { createPendingRegistration, deletePendingRegistration, getPendingRegistration } from "../redis/pendingRegistration";

export const authService = {
    async checkEmailAvailability(email: string) {
        const normalizedEmail = normalizeEmail(email)

        const user = await db.orm.public.User
            .where({ normalizedEmail })
            .first()

        return {
            available: !user
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

        // Generate and send verification code.
        const verificationCode = generateVerificationCode()
        const verificationCodeHash = hashVerificationCode(verificationCode, normalizedEmail)
        const passwordHash = await hashPassword(password)

        const registrationData = { name, email, normalizedEmail, passwordHash, verificationCodeHash }

        // Get pending registrationId.
        const registrationId = await createPendingRegistration(registrationData)

        // Send email
        try {
            const emailContent = buildVerificationEmail({
                name,
                verificationCode,
            })

            await transporter.sendMail({
                from: `"Random Subedi" <${env.SMTP_USER}>`,
                to: email,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html,
            });

            return {
                message: "Verification code sent.",
                registrationId,
            };
        } catch (err) {
            await deletePendingRegistration(registrationId)

            throw new AppError(
                500,
                "VERIFICATION_EMAIL_FAILED",
                "Unable to send verification code."
            );
        }
    },

    async completeRegistration(registrationId: string, code: string) {
        const pendingRegistration = await getPendingRegistration(registrationId)

        if (!pendingRegistration) {
            throw new AppError(
                404,
                "INVALID_VERIFICATION_DATA",
                "Invalid verification code."
            )
        }

        //Check if the user already exists
        const existingUser = await db.orm.public.User
            .where({ normalizedEmail: pendingRegistration.normalizedEmail })
            .first()

        if (existingUser) {
            throw new AppError(
                409,
                "EMAIL_ALREADY_EXISTS",
                "An account with this email already exists."
            );
        }

        // Check if the code is valid or not
        const isCodeValid = verifyVerificationCode(code, pendingRegistration.normalizedEmail, pendingRegistration.verificationCodeHash)

        if (!isCodeValid) {
            throw new AppError(
                500,
                "INVALID_CODE",
                "Invalid Code."
            )
        }

        // Create User + PasswordCredential
        const user = await db.transaction(async (tx) => {
            const createdUser = await tx.orm.public.User.create({
                name: pendingRegistration.name,
                email: pendingRegistration.email,
                normalizedEmail: pendingRegistration.normalizedEmail
            })

            await tx.orm.public.PasswordCredential.create({
                userId: createdUser.id,
                passwordHash: pendingRegistration.passwordHash,
            })

            return createdUser
        })

        // Delete data from redis
        await deletePendingRegistration(registrationId)

        return {
            message: "Registration completed successfully.",
            userId: user.id
        }

    }
}