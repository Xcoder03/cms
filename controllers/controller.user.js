import User from "../models/user.js"
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import appError from "../errors/app-error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redisClient from  "../config/redisConfig.js"
import sendEmail from "../utils/sendEmail.js";
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

  // forget password

  export const forgetPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      //check if email is valid
      const user = await User.findOne({ email });
      if (!user) {
        return next(appError(`User with ${email} does not exists `, 404));
      }
      //Generate a reset token
      const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      //set the rest token and its expiration on the user obj
  
      user.resetToken = resetToken;
      user.reseTokenExpiration = Date.now() + 3600000;
  
      user.save();
      //send the password reset email
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const html = `<h3>RESET PASSWORD</h3><br/> <p>Below is the link to reset your password<br>This link only valid for 1 hour. please do not share with anyone<hr/><br/>click <strong> <a href="${resetUrl}">here</a> </strong>to reset your password</p><p>Having issues? kindly contact our support team</p> `;
      await sendEmail(user.email, "Reset Your Password", html);
  
      res.status(200).json({
        status: "success",
        message: "Password reset sent successfully to the " + user.email,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };

  // reset the password 

  export const resetPassword = async (req, res, next) => {
    try {
      const { resetToken, password } = req.body;
      //find the user with token
      const user = await User.findOne({
        resetToken,
        reseTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        return next(appError("Invalid or the link expired", 400));
      }
      //Hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      //update useer obj
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.reseTokenExpiration = undefined;
  
      await user.save();

          // Delete the reset token from the user document
      await User.updateOne(
        { _id: user._id },
        { $unset: { resetToken: 1, resetTokenExpiration: 1 } }
      );
  
  
      res.status(200).json({
        status: "success",
        message: "Your password reset successfully",
      });
      const html = `<h3> success </h3><br/> <p>You password changed successfully</p> `;
      await sendEmail(user.email, "Password Message", html);
    } catch (error) {
      next(appError(error.message));
    }
  };
  

  //display all user
export const displayAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({});
      res.json({
        status: "success",
        data: users,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };

  //update user profile

  export const updateUserProfile = async(req, res) => {
    const{firstname, lastname} = req.body
    try {
        const findUser = await User.findById(req.userAuth)
        if(!findUser){
            return res.json({
                status:"error",
                message:"record not found"
            })
        }

        const foundUser = await User.findByIdAndUpdate  (req.params.id,{
            $set:{
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }   
            
        },
        {
            new: true
        })

        res.json({
            status:"success",
            data:"record updated successfully"
        })
        
    } catch (error) {
        res.json(error.message)
    }
    
}

//delete user
export const deleteUser = async (req, res, next) => {
    const userid = req.params.id;
    const found = await User.findByIdAndDelete(userid);
    if(!found){
      return next(appError("No user with such ID",404))
    }
    
    try {
      res.json({
        status: "success",
        data: `User account deleted successfully`,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };
  

  // register admin

  // Controller to create an admin
export const registerAdmin = async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;
    try {
      // Check if user with the provided email already exists
      const foundUser = await User.findOne({ email });
  
      if (foundUser) {
        return next(appError("User with that email already exists", 409));
      } else {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
  
        // Create a new user with isAdmin set to true
        const user = await User.create({
          firstname,
          lastname,
          email,
          password: hashPassword,
          isAdmin: true, // Set isAdmin to true for an admin user
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