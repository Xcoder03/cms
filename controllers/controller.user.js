import User from "../models/user.js"
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import appError from "../errors/app-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redisClient from  "../config/redisConfig.js"
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


  // login a user 

  export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      //get email
      const isUserFound = await User.findOne({ email });
      if (!isUserFound) {
        return next(appError("Wrong login credential", 401));
      }
  
      //get password
      const isPasswordFound = await bcrypt.compare(
        password,
        isUserFound.password
      );
      if (!isPasswordFound) {
        return next(appError("Wrong login Credential", 401));
      }
      res.json({
        status: "sucesss",
        data: {
          firstname: isUserFound.firstname,
          lastname: isUserFound.lastname,
          email: isUserFound.email,
          token: generateToken(isUserFound._id),
        },
      });
    } catch (error) {
      next(appError(error.message));
    }
  };

  // logout user

  export const userLogoutCtrl = (req, res, next) => {
    const token = req.token;
  
    if (!token) {
      return next(appError("No valid token found", 401));
    }
  
    // Add the token to the Redis blacklist with an expiration time
    redisClient.setex(token, 3600, 'revoked'); // Assuming an expiration time of 1 hour
  
    res.json({ status: 'success', message: 'User logged out successfully' });
  };
