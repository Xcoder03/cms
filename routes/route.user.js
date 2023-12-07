// your routes goes here 

import express from "express";
import * as userCtrl from  "../controllers/controller.user.js"
import { isLogin } from "../middlewares/isLogin.js";
import { validateUser } from "../middlewares/userValidation.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const userRoutes = express.Router();

// user routes 
userRoutes.post("/register-user", validateUser, userCtrl.registerUser)
userRoutes.post("/register-admin", validateUser,userCtrl.registerAdmin)
userRoutes.post("/log-in-user", userCtrl.userLogin)
userRoutes.get("/display-All-Users", isAdmin, isLogin, userCtrl.displayAllUsers)
userRoutes.get("/logout-user", isLogin, userCtrl.userLogoutCtrl)
userRoutes.post("/forget-password", userCtrl.forgetPassword)
userRoutes.post("/reset-password", userCtrl.resetPassword)
userRoutes.put("/update-user-info", isLogin, userCtrl.updateUserProfile)
userRoutes.delete("/delete-user", isAdmin, isLogin, userCtrl.deleteUser)

export default userRoutes;
