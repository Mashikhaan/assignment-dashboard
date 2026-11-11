import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRolesMiddleware } from '../middleware/role.middleware.js';
import { acknowledgeGroupAssignmentController, acknowledgeIndividualAssignmentController } from '../controllers/submission.controller.js';


const submissionRouter = express.Router();


//individual assignment submission route
/**
 * @route POST /api/submissions/:assignmentId/acknowledge
 * @desc Acknowledge individual assignment submission
 * @access Private
 */
submissionRouter.post("/:assignmentId/acknowledge",authMiddleware,authorizeRolesMiddleware("student"),acknowledgeIndividualAssignmentController);


//group assignment submission by group leader route
/**
 * @route POST /api/submissions/:assignmentId/group-acknowledge
 * @desc Acknowledge group assignment submission
 * @access Private
 */
submissionRouter.post("/:assignmentId/group-acknowledge",authMiddleware,authorizeRolesMiddleware("student"),acknowledgeGroupAssignmentController);








export default submissionRouter;