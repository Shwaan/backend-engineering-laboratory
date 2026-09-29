import express from "express"
import { checkEmailAvailability, loginUser, registerUser, verifyEmail } from "../controllers/authController"
import { validateBody } from "../middleware/validateBody"
import { emailAvailabilitySchema, registerUserSchema, verifyEmailSchema, loginUserSchema } from "../schemas/authSchema"

const router = express.Router()

router.post("/email-availability", validateBody(emailAvailabilitySchema), checkEmailAvailability)

router.post("/register", validateBody(registerUserSchema), registerUser)

router.post("/verify-email", validateBody(verifyEmailSchema), verifyEmail)

router.post("/login", validateBody(loginUserSchema), loginUser)

export default router