import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRolesMiddleware } from "../middleware/role.middleware.js";
import { createCourseController, deleteCourseController, enrollCourseController, getAllCourseController, getEnrolledStudentsController, getSingleCourseController, updateCourseController } from "../controllers/course.controller.js";


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
/**
 * @route DELETE /api/courses/:courseId
 * @desc Delete a course by id
 * @access Private
 */
courseRouter.delete("/:courseId",authMiddleware,authorizeRolesMiddleware("professor"),deleteCourseController);



//Students enroll in course route
/**
 * @route POST /api/courses/:courseId/enroll
 * @desc Enroll in a course
 * @access Private
 */
courseRouter.post("/:courseId/enroll",authMiddleware,authorizeRolesMiddleware("student"),enrollCourseController);


//Get students enrolled courses route
courseRouter.get("/:courseId/students",authMiddleware,authorizeRolesMiddleware("professor"),getEnrolledStudentsController);

export default courseRouter;