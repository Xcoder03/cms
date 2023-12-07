
import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import appError from "../utils/appErr.js";

export const createPost = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //obtain the user who is creating the post
    const postOwner = await User.findById(req.userAuth);

    const createPost = await Post.create({
      title,
      description,
      category,
      user: postOwner._id,
    });

    res.json({
      status: "success",
      data: createPost,
    });
    //attach the posts to the user
    postOwner.posts.push(createPost);
    //save
    await postOwner.save();
  } catch (error) {
    next(appError(error.message));
  }
};

//fetch all post
export const fetchAllPosts = async (req, res, next) => {
    //fetch all post
    const posts = await Post.find({})
      .populate("user")
      .populate("category", "title")
  
    try {
      res.json({
        status: "success",
        data: posts,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };
  

  export const deletPost = async (req, res, next) => {
    //find post
    try {
      const postId = req.params.id;
      const loggedUser = req.userAuth;
  
      const post = await Post.findOne({
        _id: mongoose.Types.ObjectId(postId),
        user: loggedUser,
      });
  
      if (!post) {
        return next(appError("Post not found", 404));
      }
      await post.delete();
      res.json({
        status: "success",
        message: "post deleted successfully",
      });
    } catch (error) {
      next(appError(error.message));
    }
  };


  export const updatePostController = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
      const postId = req.params.id;
      //obtain the post
      const post = await Post.findById(postId);
      //check the post exists
      if (!post) {
        return next(appError("Sorry post not found!", 404));
      }
  
      //check if the post belongs to the cureent user
      const doesPostBelongToCurrentUser =
        post.user.toString() === req.userAuth.toString();
      if (!doesPostBelongToCurrentUser) {
        return next(appError("Access denied", 403));
      }
      //now updaste the post
  
      const postUpdate = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        data: postUpdate,
      });
    } catch (error) {
      next(appError(error.message));
    }
  };