import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import contactRouter from "./routes/contactRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
dotenv.config();
const PORT = 8000;

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/contact", contactRouter);
app.use("/api/order", orderRouter);

connectDB(process.env.DB_USERNAME, process.env.DB_PASSWORD);

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});