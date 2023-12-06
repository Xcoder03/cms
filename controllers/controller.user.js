import User from "../models/user.js"
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import appError from "../errors/app-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Register a user

export const registerUser = async(req, res, next) => {
    const { firstname, lastname, profilephoto, email, password } = req.body;
    try {
      //check if user has been registered before
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        return next(appError("User with that email already exists", 409));
      } else {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
          firstname,
          lastname,
          email,
          password: hashPassword,
        });
  
        res.json({
          status: "success",
          data: user,
        });
      }
    } catch (error) {
      next(appError(error.message));
    }
  };
