import express from "express";
import { registerController, loginController, getMeController, logoutController } from "../controllers/auth.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";


const authRouter = express.Router();


//register route
/**
 * @route POST  api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerController);


//login route
/**
 * @route POST  api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", loginController);


//get me route
/**
 * @route GET  api/auth/me
 * @desc get profile 
 * @access Private
 */
authRouter.get("/me",authMiddleware,getMeController)


//log out route
/**
 * @route POST api/auth/logout
 * @desc log out user
 * @access Private
 */
authRouter.post("/logout", logoutController);

export default authRouter;