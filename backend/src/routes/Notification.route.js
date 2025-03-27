import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getAllNotification, isLike, likePost } from "../controllers/Notification.controller.js";

const router = Router();

router.route("/isLike").post(verifyJWT,isLike)
router.route("/likeNotification").post(verifyJWT,likePost)
router.route("/getNotification").get(verifyJWT,getAllNotification)



export default router ;