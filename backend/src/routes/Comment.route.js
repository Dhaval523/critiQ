import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createComment, getPostComments, updateComment } from "../controllers/Comment.controller.js";

const router = Router();

router.route("/createComment").post(verifyJWT, createComment);          
router.route("/:postId").get(verifyJWT, getPostComments);       
router.route("/:commentId").patch(verifyJWT, updateComment);    

export default router;