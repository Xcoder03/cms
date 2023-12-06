import User from "../models/user"
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import Category from "../model/Category.js";
import appError from "../utils/AppErr.js";
// an admin will add a category
export const createCategory = async (req, res, next) => {
  const { title } = req.body;
  try {
    const doesTitleExist = await Category.findOne({ title });
    if (doesTitleExist) {
      return next(appError("Title with this name already exists", 409));
    }

    const category = await Category.create({
      title,
    });

    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(appError(error.message));
  }
};