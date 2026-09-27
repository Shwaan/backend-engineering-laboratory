import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectRedis, redis } from "../src/redis/redis";

describe("Redis", () => {
    const key = "test:learning:user";

    beforeAll(async () => {
        await connectRedis();
    });

    afterAll(async () => {
        await redis.del(key);
        await redis.quit();
    });

    it("should store and retrieve a value", async () => {
        const user = {
            name: "Subigya",
            email: "subigya@gmail.com",
        };

        await redis.set(
            key,
            JSON.stringify(user),
            {
                EX: 60,
            }
        );

        const value = await redis.get(key);

        expect(value).not.toBeNull();

        const parsed = JSON.parse(value!);

        expect(parsed).toEqual(user);
    });
});