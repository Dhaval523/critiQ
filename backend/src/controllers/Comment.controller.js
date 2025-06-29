import Comment from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";              
import { createNotification } from "../helpers/notificationHelper.js";
import mongoose from "mongoose";

// Create a new comment
const createComment = asyncHandler(async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.user._id;

    if (!content || !postId) {
        throw new ApiError(400, "Content and postId are required");
    }

    const comment = await Comment.create({
        content,
        post: postId,
        user: userId
    });

   

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment created successfully")
    );
});

// Get comments for a post
const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.query; // Extract postId from query parameters

    // Validate postId
    if (!postId || !mongoose.isValidObjectId(postId)) {
        return res.status(400).json(
            new ApiResponse(400, [], "Invalid or missing postId")
        );
    }

    const comments = await Comment.find({ post: postId })
        .populate("user", "username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update your own comments");
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own comments");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

export {
    createComment,
    getPostComments,
    updateComment,
    deleteComment
};