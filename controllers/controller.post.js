
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


//fetch all posts by admin

export const fetchPostByAllAdmin = async (req, res, next) => {
    try {
      const posts = await Post.find({});
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