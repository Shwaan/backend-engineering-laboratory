import { connectRedis, redis } from "./redis";

await connectRedis()

await redis.set(
    "learning:user",
    JSON.stringify({
        name: "Subigya",
        email: "subigya@gmail.com"
    }),
    {
        EX: 60
    }
)

const value = await redis.get("learning:user")
console.log("Raw value:", value)

if (value) {
    const parsed = JSON.parse(value)

    console.log("Parsed value:", parsed)
}

const ttl = await redis.ttl("learning:user")
console.log("TTL:", ttl)

await redis.del("learning:user")
await redis.quit()