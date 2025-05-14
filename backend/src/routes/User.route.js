import { Router } from "express";
import { upload } from "../middlewares/Multer.js";
import {registerUser,
    loginUser,logoutUser,
    profileView,
    FollowerFollowing,
    getFollowingAndFollowers,
    checkIsFollow,
    toggleFollow,
    updateProfile
} from "../controllers/User.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();



router.route("/register").post(
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "avatar", maxCount: 1 }
    ]),
    registerUser
);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profileView").get(verifyJWT,profileView)
router.route('/followerAndFollowing').post(verifyJWT,FollowerFollowing)
router.route("/getFollowersAndFollowing").get(verifyJWT,getFollowingAndFollowers)
router.route("/checkFollow").post(verifyJWT,checkIsFollow)
router.route("/toggleFollow").post(verifyJWT,toggleFollow)
router.route('/updateprofile').post(verifyJWT,updateProfile)


export default router;