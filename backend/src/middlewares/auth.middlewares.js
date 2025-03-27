import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import User from "../models/User.model.js";
export const verifyJWT = asyncHandler(async(req,res,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 

    if(!token){
      throw new ApiError(401,"Unauthorized request")
    }
  
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
     const user =await User.findById(decodedToken?.id).select("-refreshToken -password")
  
     if(!user){
      throw new ApiError(401,"invalid access token")
     }
  
     req.user = user
     next()
  } catch (error) {
    console.log("error in verifyJWT",error)
     throw new ApiError(401,error?.message || "Invalid access token")
  }
   
})