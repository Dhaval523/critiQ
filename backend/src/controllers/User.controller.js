import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";
import Playlist from "../models/Playlist.model.js";
import mongoose from "mongoose";
import { createNotification } from "../helpers/notificationHelper.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken(); // Corrected method
        const refreshToken = user.generateRefreshToken(); // Corrected method

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, password } = req.body;

    if ([username, fullName, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const userExist = await User.findOne({
        $or: [{ email, username }]
    })

    if (userExist) {
        throw new ApiError(401, "User Already Exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const CoverImageLocalPath = req.files?.coverImage?.[0]?.path

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath)
    if (!avatar) {
        throw new ApiError(401, "Avatar Upload Failed")
    }
    if (!coverImage) {
        throw new ApiError(401, "Cover Image upload failed")
    }



    const user = await User.create({
        username, fullName, email, password,
        avatar: avatar.url,
        coverImage: coverImage.url,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Created Successfully")
    )
})

const loginUser = asyncHandler(async (req, res , next) => {
    const { emailOrUsername, password } = req.body;

   try {
     if (!emailOrUsername) {
         throw new ApiError(400, "Username or email is required");
     }
 
     const user = await User.findOne({
         $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
     });
 
     if (!user) {
         throw new ApiError(401, "Invalid username or email");
     }
 
     const isPasswordCorrect = await user.ispasswordCorrect(password);
     if (!isPasswordCorrect) {
         throw new ApiError(401, "Invalid user credentials");
     }
 
     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
 
     const options = {
         httpOnly: true,
         secure: true
     };
     
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
   } catch (error) {
       next(error)
   }

});

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request. No user found.");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: "" } },
        { new: true }
    );

    
    res.set('Clear-Site-Data', '"cache", "cookies", "storage"');

    return res.status(200)
        .clearCookie("accessToken", { httpOnly: true, secure: true })
        .clearCookie("refreshToken", { httpOnly: true, secure: true })
        .json({ message: "User logged out successfully" });
});

const profileView = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password")
        .populate("playlists", "name movies");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const following = user.following.length
    const follower = user.followers.length
    const playlists = user.playlists.length

    return res.status(200).json(new ApiResponse(200, { user, following, follower, playlists }, "User profile retrieved successfully"));
});

const FollowerFollowing = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Logged-in user ID from auth middleware
    const { followedId } = req.body;

    // Log incoming data for debugging
    console.log("userId:", userId, "followedId:", followedId);

    // Validate followedId
    if (!followedId || !mongoose.Types.ObjectId.isValid(followedId)) {
        throw new ApiError(400, 'Invalid followed user ID');
    }

    // Prevent self-following
    if (userId.equals(followedId)) {
        throw new ApiError(400, "You can't follow yourself");
    }

    // Fetch both users concurrently
    const [loggedInUser, userToFollow] = await Promise.all([
        User.findById(userId).select('following'), // Only fetch the 'following' field
        User.findById(followedId).select('followers'), // Only fetch the 'followers' field
    ]);

    if (!loggedInUser || !userToFollow) {
        throw new ApiError(404, 'User not found');
    }

    // Check current follow status
    const isCurrentlyFollowing = loggedInUser.following.some(
        (id) => id.toString() === followedId.toString()
    );
    

    // Update follow status
    if (isCurrentlyFollowing) {
        // Unfollow
        loggedInUser.following = loggedInUser.following.filter(
            (id) => id.toString() !== followedId.toString()
        );
        userToFollow.followers = userToFollow.followers.filter(
            (id) => id.toString() !== userId.toString()
        );
    } else {
        // Follow
        loggedInUser.following.push(followedId);
        userToFollow.followers.push(userId);
    }

    // Save both users concurrently
    await Promise.all([loggedInUser.save(), userToFollow.save()]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                followers: userToFollow.followers.length,
                following: loggedInUser.following.length,
                isFollowing: !isCurrentlyFollowing,
            },
            'Successfully toggled follow status'
        )
    );
});
const getFollowingAndFollowers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('following followers');
    return res.status(200).json(
        new ApiResponse(200, {


            followers: user.followers,
            following: user.following
        })
    );
})
const checkIsFollow = asyncHandler(async (req, res) => {

    try {

        const userId = req.user._id
        const { followedId } = req.body;

        const currentUser = await User.findById(userId)
        const isFollowing = currentUser.following.includes(followedId)

        return res.status(200)
            .json(new ApiResponse(201, {
                isFollowing: isFollowing
            }))

    } catch (error) {
        throw new ApiError(500, "error while checking isFollow")

    }

})

const toggleFollow = async (req, res) => {
    try {
        let { followedId } = req.body;
        let userId = req.user._id;
        console.log(userId);
        console.log(followedId);

        if (!userId || !followedId) {
            return res.status(400).json({ message: "userId and followedId are required", success: false });
        }

        // Convert userId and followedId to ObjectId
        userId = new mongoose.Types.ObjectId(userId);
        followedId = new mongoose.Types.ObjectId(followedId);

        if (userId.equals(followedId)) {
            return res.status(400).json({ message: "You cannot follow yourself", success: false });
        }

        const follower = await User.findById(userId);
        const followed = await User.findById(followedId);

        if (!follower || !followed) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isFollowing = follower.following.includes(followedId);

        if (isFollowing) {
            // Unfollow
            follower.following = follower.following.filter(id => !id.equals(followedId));
            followed.followers = followed.followers.filter(id => !id.equals(userId));
        } else {
            // Follow
            follower.following.push(followedId);
            followed.followers.push(userId);

            createNotification(
                userId,
                followedId,
                "follow",
                userId,
                `${userId.username} is now following you`

            )
        }

        await follower.save();
        await followed.save();

        res.status(201).json({
            statusCode: 201,
            data: { isFollowing: !isFollowing }, // ✅ Send updated status
            message: "Success",
            success: true,
        });
    } catch (error) {
        console.error("Error in toggleFollow:", error);
        res.status(500).json({ message: error.message || "Server error", success: false });
    }
};
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, bio ,fullName  } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Upload and update coverImage if provided
        const coverImagePath = req.files?.coverImage?.[0]?.path;
        if (coverImagePath) {
            const uploadedCover = await uploadOnCloudinary(coverImagePath);
            if (!uploadedCover?.url) {
                return res.status(400).json({ message: "Cover image upload failed", success: false });
            }
            user.coverImage = uploadedCover.url;
        }

        // Upload and update avatar if provided
        const avatarPath = req.files?.avatar?.[0]?.path;
        if (avatarPath) {
            const uploadedAvatar = await uploadOnCloudinary(avatarPath);
            if (!uploadedAvatar?.url) {
                return res.status(400).json({ message: "Avatar upload failed", success: false });
            }
            user.avatar = uploadedAvatar.url;
        }

        // Update other fields if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (bio) user.bio = bio;
        if (fullName) user.fullName = fullName;

        await user.save();
     

        return res.status(200).json({
            statusCode: 200,
            data: user,
            message: "Profile updated successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            message: "Something went wrong while updating profile",
            success: false,
            error: error.message,
        });
    }
};







export {
    registerUser,
    loginUser,
    logoutUser,
    profileView,
    FollowerFollowing,
    getFollowingAndFollowers,
    checkIsFollow,
    toggleFollow,
    updateProfile
}