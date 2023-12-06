// this is the starting point of your app
import dotenv from "dotenv"
import express from  "express"
import {database} from "./config/dbConnect.js"

dotenv.config();
database();
const app = express();
app.use(express.json())



const PORT = process.env.PORT || 8080;


app.listen(PORT, console.log(` we are back  at port ${PORT} server is set.`))