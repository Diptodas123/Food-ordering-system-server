import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";

const app = express();
dotenv.config();
const PORT = 8000;

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);

connectDB(process.env.DB_USERNAME, process.env.DB_PASSWORD);

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});