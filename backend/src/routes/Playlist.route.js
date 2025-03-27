import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {savePlaylist, getPlaylist } from "../controllers/playlist.controller.js";
const router = Router();

router.route('/savePlaylist').post(verifyJWT,savePlaylist)
router.route('/getPlaylist').get(verifyJWT,getPlaylist)

export default router ;