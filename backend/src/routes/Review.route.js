import { Router } from "express";
import { upload } from "../middlewares/Multer.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { uploadReview } from "../controllers/Review.controller.js";
import Reviews from "../models/Reviews.model.js";

const router = Router();



router.route("/reviewUpload").post(
  verifyJWT,  upload.single("image"),
    uploadReview
);

router.route("/getReviews").get(async (req,res)=>{
  try {
    const reviews = await Reviews.find().populate('user','username avatar')
    res.json(reviews);
  } catch (error) {
     res.status(500).json({ message: "Error fetching reviews" });
  }
})
export default router;