import { json } from "express";
import Reviews from "../models/Reviews.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { createNotification } from "../helpers/notificationHelper.js";



const uploadReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment, mood, tags, spoiler, movie } = req.body;

        // Validate required fields
        const requiredFields = { rating, comment, mood, tags, spoiler, movie };
        for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
            if (!fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === "")) {
                throw new ApiError(400, `${fieldName} is required`);
            }
        }

        // Validate and handle image upload
        const imageLocalPath = req.file?.path;
        if (!imageLocalPath) {
            throw new ApiError(400, "Image is required");
        }

        const image = await uploadOnCloudinary(imageLocalPath);
        if (!image?.url) {
            throw new ApiError(500, "Failed to upload image to Cloudinary");
        }

        // Parse tags if they come as a string
        let parsedTags;
        try {
            parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
            if (!Array.isArray(parsedTags)) {
                throw new Error("Tags must be an array");
            }
        } catch (error) {
            throw new ApiError(400, "Invalid tags format - must be a valid JSON array");
        }

        // Create review
        const review = await Reviews.create({
            movie,
            rating: Number(rating), // Ensure rating is a number
            comment,
            mood,
            tags: parsedTags,
            spoiler: spoiler === "true" || spoiler === true, // Ensure boolean
            image: image.url,
            user: req.user._id
        });


        return res
            .status(201)
            .json(new ApiResponse(201, review, "Review uploaded successfully"));

    } catch (error) {
        // If error is already an ApiError, throw it as is, otherwise create new ApiError
        throw error instanceof ApiError
            ? error
            : new ApiError(500, error.message || "Failed to upload review");
    }
});
const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;
    
    try {
        const review = await Reviews.findById(reviewId);
        if (!review) throw new ApiError(404, "Review not found");

        if (review.user.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this review");
        }

        await Reviews.deleteOne({ _id: reviewId }); // Clean deletion

        res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(500, error.message || "Failed to delete review");
        }
    }
});


export {
    uploadReview,
    deleteReview
}