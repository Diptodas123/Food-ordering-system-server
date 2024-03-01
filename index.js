import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});