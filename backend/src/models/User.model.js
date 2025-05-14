import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true 
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true 
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    password: {
        type: String,
        required: true 
    },
    refreshToken: {
        type: String,
    },
    followers: [], 
    following: [],
    post: {
        type: Number,
        default: 0 
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist" // Reference to Playlist collection
    }]
    ,
    bio : {
        type: String,
    },
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password for login
UserSchema.methods.ispasswordCorrect = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

const User = mongoose.model("User", UserSchema);
export default User;
