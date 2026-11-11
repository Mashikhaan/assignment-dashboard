import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";


//auth middleware
export const authMiddleware = async (req,res,next) =>{

    try{
        //get token from cookies
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Please login first"
            })
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Fetch user from database
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach user to request
        req.user = user;


        next();
    }catch(err){
      return res.status(401).json({
        success:false,
        message: "Invalid or Expired token"
      })
    }
}