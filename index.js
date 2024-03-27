import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoute.js";

const app = express();
dotenv.config();
const PORT = 8000;

app.use(express.json());
app.use(cors());


//routes
app.use("/api/auth", authRouter);

connectDB(process.env.DB_USERNAME, process.env.DB_PASSWORD);

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});