import { app } from "./app"
import { env } from "./config/env"
import { connectRedis } from "./redis/redis"

const PORT = env.PORT

export const startServer = async () => {
    try {
        await connectRedis()

        app.listen(PORT, () => {
            console.log("Server running on PORT:", PORT)
        })
    } catch (error) {
        console.log("Failed to start application:", error)
        process.exit(1)
    }
}

startServer()