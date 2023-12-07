// this is the starting point of your app
import dotenv from "dotenv"
import express from  "express"
import {database} from "./config/dbConnect.js"
import userRoutes from "./routes/route.user.js"
import postRoutes from "./routes/route.post.js";
import categoryRoutes from "./routes/route.category.js";

dotenv.config();
database();
const app = express();
app.use(express.json())



const PORT = process.env.PORT || 8080;
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/category", categoryRoutes);


app.listen(PORT, console.log(` we are back  at port ${PORT}, the  server is set.`))