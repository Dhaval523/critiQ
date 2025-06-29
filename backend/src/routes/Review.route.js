import { Router } from "express";
import { upload } from "../middlewares/Multer.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { uploadReview , deleteReview } from "../controllers/Review.controller.js";
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

router.route("/getUserReviews").get(verifyJWT, async (req, res) => {
  try {
    const reviews = await Reviews.find({ user: req.user._id })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: reviews,
      message: "User reviews fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
      error: error.message
    });
  }
});

router. route("/deleteReview/:id").delete(verifyJWT, deleteReview);


export default router;