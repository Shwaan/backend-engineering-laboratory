import { Request, Response } from "express";
import { authService } from "../services/authService";

export const checkEmailAvailability = async (req: Request, res: Response) => {
    const { email } = req.body

    const result = await authService.checkEmailAvailability(email)

    return res.status(200).json(result)
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { registrationId, code } = req.body
    const result = await authService.completeRegistration(registrationId, code)

    return res.status(201).json(result)
}

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const result = await authService.registerUser(name, email, password)

    return res.status(200).json(result)
}