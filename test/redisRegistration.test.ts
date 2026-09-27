import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    createPendingRegistration,
    deletePendingRegistration,
    getPendingRegistration,
} from "../src/redis/pendingRegistration";
import { connectRedis, redis } from "../src/redis/redis";

describe("Pending registration Redis storage", () => {
    beforeAll(async () => {
        await connectRedis();
    });

    afterAll(async () => {
        await redis.quit();
    });

    it("should create, retrieve, and delete a pending registration", async () => {
        const pendingRegistration = {
            name: "Subigya",
            email: "subigya@gmail.com",
            normalizedEmail: "subigya@gmail.com",
            passwordHash: "hashed-password",
            verificationCodeHash: "hashed-code",
        };

        const registrationId =
            await createPendingRegistration(pendingRegistration);

        expect(registrationId).toBeTruthy();

        const storedRegistration =
            await getPendingRegistration(registrationId);

        expect(storedRegistration).toEqual(pendingRegistration);

        await deletePendingRegistration(registrationId);

        const deletedRegistration =
            await getPendingRegistration(registrationId);

        expect(deletedRegistration).toBeNull();
    });

    it("should store pending registration with a TTL", async () => {
        const registrationId = await createPendingRegistration({
            name: "Subigya",
            email: "subigya@gmail.com",
            normalizedEmail: "subigya@gmail.com",
            passwordHash: "hashed-password",
            verificationCodeHash: "hashed-code",
        });

        const ttl = await redis.ttl(
            `registration:${registrationId}`
        );

        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThanOrEqual(600);

        await deletePendingRegistration(registrationId);
    });
});