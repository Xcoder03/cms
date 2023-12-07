// your routes goes here 

import express from "express";
import * as userCtrl from  "../controllers/controller.user"
import { isLogin } from "../middlewares/isLogin.js";
import { validateUser } from "../middlewares/userValidation.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRoutes = express.Router();

// register user 
userRoutes.post("/register-user", validateUser, userCtrl.registerUser)
userRoutes.post("/log-in-user", userCtrl.userLogin)
userRoutes.get("/display-All-Users", isAdmin, userCtrl.displayAllUsers)
userRoutes.get("/logout-user", isLogin, userCtrl.userLogoutCtrl)

