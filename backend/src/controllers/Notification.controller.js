import { createNotification } from "../helpers/notificationHelper.js";
import Reviews from "../models/Reviews.model.js";
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Notifications from "../models/Notification.js";


const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    const userId = req.user._id; // Current user from auth middleware
  
    if (!postId) {
      throw new ApiError(400, "Post ID is required");
    }
  
    // Find the post and populate user details in one query
    const post = await Reviews.findById(postId).populate('user', 'username _id');
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
  
    const userIdStr = userId.toString();
    const isLiked = post.likes.some(id => id.toString() === userIdStr);
  
    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userIdStr);
    } else {
      // Like the post
      post.likes.push(userId);
  
      // Send notification if the post owner is not the liker
      if (post.user && post.user._id.toString() !== userIdStr) {
        await createNotification(
          post.user._id,
          userId,
          "like",
          postId,
          `${req.user.username} liked your post.`
        );
      }
    }
  
    // ✅ Save the updated post
    await post.save();
  
    return res.status(200).json(
      new ApiResponse(200, { like: post.likes.length }, "Post like toggled successfully")
    );
  });
  
const isLike = asyncHandler(async (req, res) => {
    const currentId = req.user._id; // Current user's ID from auth middleware
    const { postId } = req.body; // Destructure postId from request body

    // Validate postId
    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // Check if user exists
    const currentUser = await User.findById(currentId);
    if (!currentUser) {
        throw new ApiError(400, "User not found");
    }

    // Find the review and check if current user's ID is in likes array
    const review = await Reviews.findById(postId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    const isLiked = review.likes.includes(currentId); // Check if user liked the review
    const count = review. likes.length;

    return res.status(200).json(
        new ApiResponse(200, { isLiked , count }, "Like status checked successfully")
    );
});

const getAllNotification = asyncHandler(async (req,res)=>{

    const userId = req.user._id;
    try {
        const notifications = await Notifications.find({recipient : userId}).sort({createdAt: -1}).limit(10).populate('sender','avatar username')
        return res.status(200)
        .json(new ApiResponse(201, {notifications}, "Notifications retrieved successfully"))
    } catch (error) {
         return res.status(500)
         .json(new ApiError(500, "Error retrieving notifications"))
    }
   

})




export { likePost,
    isLike,
    getAllNotification
};

