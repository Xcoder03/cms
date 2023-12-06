import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
    },
    lastname: {
      type: String,
      required: [true, "lastname name is required"],
    },
    profilephoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "user"],
      default: "user",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    resetToken: {
      type: String,
    },

    reseTokenExpiration: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//get fullname
userSchema.virtual("fullname").get(function () {
  return `${this.firstname}  ${this.lastname}`;
});
//count post

userSchema.virtual("postCounts").get(function () {
  return this.posts.length;
});


const User = mongoose.model("User", userSchema);
export default User;