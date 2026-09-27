import { randomUUID } from "node:crypto";
import { redis } from "./redis";

const REGISTRATION_TTL_SECONDS = 10 * 60 //10 Minutes

export type PendingRegistration = {
    name: string;
    email: string;
    normalizedEmail: string;
    passwordHash: string;
    verificationCodeHash: string;
}

const registrationKey = (registrationId: string) => {
    return `registration:${registrationId}`
}

export const createPendingRegistration = async (data: PendingRegistration): Promise<string> => {
    const registrationId = randomUUID()

    //build the Redis key
    const key = registrationKey(registrationId)
    const value = JSON.stringify(data)
    //SET it with EX = REGISTRATION_TTL_SECONDS
    await redis.set(key, value, {
        EX: REGISTRATION_TTL_SECONDS
    })
    return registrationId
}

export const getPendingRegistration = async (registrationId: string): Promise<PendingRegistration | null> => {
    const key = registrationKey(registrationId)
    const value = await redis.get(key)

    if (!value) {
        return null;
    }

    return JSON.parse(value)
}

export const deletePendingRegistration = async (registrationId: string): Promise<void> => {
    const key = registrationKey(registrationId)

    await redis.del(key)
}