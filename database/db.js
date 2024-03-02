import mongoose from "mongoose";

const connectDB = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@cluster0.ibss3c9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose.connect(URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error with DB: ", error.message);
    }
}

export default connectDB;