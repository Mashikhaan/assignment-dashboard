import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRolesMiddleware } from "../middleware/role.middleware.js";
import { createGroupController, getGroupDetailsController, joinGroupController } from "../controllers/group.controller.js";

const groupRouter = express.Router();



//create group route
/**
 * @route POST /api/groups/create
 * @desc Create a new group
 * @access Private
 */
groupRouter.post("/create", authMiddleware, authorizeRolesMiddleware("student"),createGroupController
)


//join group route
/**
 * @route POST /api/groups/groupId/join
 * @desc Join a group
 * @access Private
 */
groupRouter.post("/:groupId/join",authMiddleware, authorizeRolesMiddleware("student"), joinGroupController);


//get group details route
/**
 * @route GET /api/groups/groupId
 * @desc Get group details
 * @access Private
 */
groupRouter.get("/:groupId", authMiddleware,
    authorizeRolesMiddleware("student"),getGroupDetailsController
)

export default groupRouter;