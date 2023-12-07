
import Category from "../model/category.js";
import appError from "../errors/app-error.js";
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
  

  //update category
export const updateCategory = async (req, res,next) => {
    try {
      const foundcatetegory = await Category.findById(req.params.id);
      if (!foundcatetegory) {
        return next(appError("record not found"))
       
      }
      //find record to update
      const foundcate = await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
          },
        },
        {
          new: true,
        }
      );
  
      res.json({
        status: "success",
        data: foundcate,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };