import "dotenv/config";
import express, { Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import authRoute from "./routes/authRoute";
import contactRouter from "./routes/contactRoutes";

export const app = express();

app.use(express.json());

app.get("/json", (req: Request, res: Response) => {
    res.status(200).json(
        {
            id: 1,
            name: "Subigya"
        }
    )
})

app.use("/api/contacts", contactRouter);
app.use("/api/auth", authRoute)

// No route matched above
app.use(routeNotFound)

// Error handler must come after routes
app.use(errorHandler)