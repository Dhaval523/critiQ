import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    movie: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    tags: {
      type: [String],
      required: [true, "At least one tag is required"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one tag is required",
      },
    },
    mood: {
      type: String,
      required: true,
      trim: true,
    },
    spoiler: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Improves lookup by user
    },
    likes: {
      type: [], // Array of User IDs
      default: [], // Empty array by default
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
ReviewSchema.index({ tags: 1, mood: 1 }); // For filtering by tags and mood
ReviewSchema.index({ createdAt: -1 }); // For sorting by latest reviews
ReviewSchema.index({ user: 1, createdAt: -1 }); // For user-specific latest reviews

const Reviews = mongoose.model("Reviews", ReviewSchema);
export default Reviews;