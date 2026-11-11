import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


//register user controller
export const registerController = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        // validation
        if(!name || !email || !password || !role){
            return res.status(400).send({
                success: false, 
                message: "Please enter all fields"});
        }

        if (!["student", "professor"].includes(role)) {
    return res.status(400).json({
        success: false,
        message: "Invalid role"
    });
}

        //check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

        //check if user already exists
        const existingUser = await userModel.findOne({ email: normalizedEmail });

        if(existingUser){
            return res.status(400).send({
                success: false, 
                message: "User already exists"});
        }

        //hashed password
        const hashedPassword = await bcrypt.hash(password,10);

   //create user
      const user = await userModel.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role
      })

        //generate token
         const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

         //set token in cookie
         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry time in 7 days
         })

         //send response
         return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user:{
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
         })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



//login user controller
export const loginController = async (req, res) => {
    try{
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        // validation
        if(!email || !password){
            return res.status(400).send({
                success: false, 
                message: "Please enter all fields"});
        }

        //check if user exists
        const user = await userModel.findOne({ email: normalizedEmail }).select("+password");

       if(!user){
       return res.status(404).json({
        success: false,
        message: "User does not exist"
       })
       }

       // check password match
       const isPasswordMatch = await bcrypt.compare(password, user.password);

       if(!isPasswordMatch){
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
       }

       //generate token
       const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

       //set cookie
       res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry time in 7 days
       })

       //send response
       return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
       })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


//get me controller
export const getMeController = async (req, res) => {
    try {
         return res.status(200).json({
            success: true,
            user:{
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
         })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



//logout controller
export const logoutController = async (req, res) =>{
try {
    res.clearCookie("token", {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
    });

    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
} catch (err) {
    return res.status(500).json({
        success: false,
        message: "Invalid server error"
    })
}
}