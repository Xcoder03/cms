// this is where is your database connection for your project is done.


import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
export const database = async () =>{
    try {
        mongoose.set("strictQuery",false);
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}