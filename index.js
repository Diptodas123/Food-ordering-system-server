import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import contactRouter from "./routes/contactRoute.js";
import orderRouter from "./routes/orderRoute.js";
import webHookRouter from "./middleware/webHook.js";

dotenv.config();
const app = express();
const PORT = 8000;

connectDB(process.env.DB_USERNAME, process.env.DB_PASSWORD);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/contact", contactRouter);
app.use("/api/order", orderRouter);
app.use("/webhook", webHookRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
