import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRolesMiddleware } from "../middleware/role.middleware.js";
import { createCourseController, deleteCourseController, getAllCourseController, getSingleCourseController, updateCourseController } from "../controllers/course.controller.js";


const courseRouter = express.Router();


//create course route
/**
 * @route POST /api/courses/create
 * @desc Create a new course
 * @access Private
 */
courseRouter.post("/create",authMiddleware,authorizeRolesMiddleware("professor"),createCourseController);


//get all courses route
/**
 * @route GET /api/courses
 * @desc Get all courses
 * @access Public
 */
courseRouter.get("/",authMiddleware,getAllCourseController);


//get single course by id route
/**
 * @route GET /api/courses/:courseId
 * @desc Get a single course by id
 * @access Private
 */
courseRouter.get("/:courseId",authMiddleware,getSingleCourseController);


//update course by id route
/**
 * @route PUT /api/courses/:courseId
 * @desc Update a course by id
 * @access Private
 */
courseRouter.put("/:courseId",authMiddleware,authorizeRolesMiddleware("professor"),updateCourseController);


//delete course by id route
courseRouter.delete("/:courseId",authMiddleware,authorizeRolesMiddleware("professor"),deleteCourseController);


export default courseRouter;