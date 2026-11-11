import express from "express";
import { createAssignmentController, deleteAssignmentController, getAllAssignmentsController, getSingleAssignmentController, updateAssignmentController } from "../controllers/assignment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRolesMiddleware } from "../middleware/role.middleware.js";



const assignmentRouter = express.Router();




//create assignment route
/**
 * @route POST /api/assignment/create
 * @desc create assignment
 * @access private
 */
assignmentRouter.post("/create",authMiddleware,authorizeRolesMiddleware("professor"),createAssignmentController);


//get all assignments route
/**
 * @route GET /api/assignment/
 * @desc get all assignments
 * @access private
 */
assignmentRouter.get("/",authMiddleware,getAllAssignmentsController);


//get single assignment route
/**
 * @route GET /api/assignment/:assignmentId
 * @desc get single assignment
 * @access private
 */
assignmentRouter.get("/:assignmentId",authMiddleware,getSingleAssignmentController);

//update assignment route
/**
 * @route PUT /api/assignment/:assignmentId
 * @desc update assignment
 * @access private
 */
assignmentRouter.put("/:assignmentId",authMiddleware,authorizeRolesMiddleware("professor"),updateAssignmentController);


//delete assignment route
/**
 * @route DELETE /api/assignment/:assignmentId
 * @desc delete assignment
 * @access private
 */
assignmentRouter.delete("/:assignmentId",authMiddleware,authorizeRolesMiddleware("professor"),deleteAssignmentController);

export default assignmentRouter;