import express from "express";
import * as categoryCtrl from  "../controllers/controller.category.js"
import { isLogin } from "../middlewares/isLogin.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const categoryRoutes =  express.Router();
categoryRoutes.post("/create-category", isLogin, isAdmin, categoryCtrl.createCategory)
categoryRoutes.get("/fetch-all-categories", isLogin, isAdmin, categoryCtrl.fetchCategories)
categoryRoutes.put("/edit-category/:id", isLogin, isAdmin, categoryCtrl.updateCategory)
categoryRoutes.delete("/delete-category/:id", isLogin, isAdmin, categoryCtrl.deleteCategory)
export default categoryRoutes;