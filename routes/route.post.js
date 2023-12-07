import express from "express";
import * as postCtrl from  "../controllers/controller.post.js"
import { isLogin } from "../middlewares/isLogin.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const postRoutes =  express.Router();
postRoutes.post("/create-post", isLogin, postCtrl.createPost)
postRoutes.get("/get-all-posts", isLogin, isAdmin, postCtrl.fetchAllPosts)
postRoutes.put("/edit-post", isLogin, postCtrl.updatePostController)
postRoutes.delete("/delete-post", isLogin, postCtrl.deletPost)

export default postRoutes;