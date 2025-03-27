import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js"
import Playlist from "../models/Playlist.model.js";
import User from "../models/User.model.js";

const savePlaylist = asyncHandler(async (req, res) => {
    const { name, movies } = req.body;

    try {
        if (!name || !movies) {
            throw new ApiError(400, "All fields are required");
        }

        // ✅ Create Playlist
        const playlist = await Playlist.create({
            name,
            movies,
            user: req.user._id
        });

        // ✅ Update User Model: Add Playlist Reference
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { playlists: playlist._id } },
            { new: true, select: "playlists" } // Only return playlist field
        );

        if (!updatedUser) {
            throw new ApiError(404, "User not found");
        }

        return res.status(201).json(new ApiResponse(201, { 
            playlist, 
            totalPlaylists: updatedUser.playlists.length 
        }, "Playlist created successfully"));

    } catch (error) {
        console.error("Error while saving playlist:", error);
        throw new ApiError(500, error.message);
    }
});

const getPlaylist = asyncHandler(async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user._id });
        if (!playlists) {
            throw new ApiError(404, "no playlists found")

        }

        return res.
            status(200)
            .json(new ApiResponse(201, playlists, "playlists found successfully"))
    }
    catch (error) {
        console.log("error while get playlists ", error)
    }
})


export {
    savePlaylist,
    getPlaylist
}