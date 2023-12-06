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
// fetch all categories
export const fetchCategories = async (req, res, next) => {
    try {
      const categoryList = await Category.find({});
      res.json({
        status: "success",
        data: categoryList,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };

  export const deleteCategory = async (req, res,next) => {
    try {
      const foundcate = await Category.findById(req.params.id);
      if (foundcate) {
        const deleteCate = await Category.findByIdAndDelete(foundcate);
        if (deleteCate) {
          res.json({
            status: "success",
            data: "category deleted successfully",
          });
        }
      } else {
        return next(appError("No such category",404)) 
      
      }
    } catch (error) {
      next(appError(error.message));
    }
  };
  