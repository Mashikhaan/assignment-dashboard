import courseModel from "../models/course.model.js";
import groupModel from "../models/group.model.js";




//create group controller
export const createGroupController = async (req, res) => {
try {
    const { name, courseId } = req.body;

    // check if name and courseId are provided
    if(!name || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Group name and course ID are required",
      })
    }

    //find course
    const course = await courseModel.findById(courseId);

    //check if course exists
    if(!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    //check enrolled students
    const isEnrolled = course.students.some(
        (studentId) => studentId.toString() === req.user._id.toString()
    )

    if(!isEnrolled) {
      return res.status(401).json({
        success: false,
        message: "You are not enrolled in this course",
      })
    }

    //existing group
    const existingGroup = await groupModel.findOne({
        course: courseId,
        members: req.user._id,
    })

    if(existingGroup) {
        return res.status(400).json({
            success: false,
            message: "You are already part of a group in this course",
        })
    }

    //create group
    const group = await groupModel.create({
        name,
        course:courseId,
        leader: req.user._id,
        members: [req.user._id],
    })

    //send response
    return res.status(201).json({
        success: true,
        message: "Group created successfully",
        group,
    })
} catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
}
}



//join group controller
export const joinGroupController = async (req, res) => {
    try {
        const {groupId} = req.params;

        // find group
        const group = await groupModel.findById(groupId);

        //check if group exists
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        //find course
        const course = await courseModel.findById(group.course);

        //check if course exists
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        //check  students enrolled in course
        const isEnrolled = course.students.some(
            (studentId) => studentId.toString() === req.user._id.toString()
        );
        
        if(!isEnrolled){
            return res.status(401).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        //check student already exist in group
        const existingGroup = await groupModel.findOne({
            course: group.course,
            members: req.user._id,
        })

        if(existingGroup){
            return res.status(401).json({
                success: false,
                message: "You are already part of a group in this course",
            });
        }

        //add members in group
        group.members.push(req.user._id);

        //save in database
        await group.save();

        //send response
        return res.status(200).json({
      success: true,
      message: "Group joined successfully",
      group,
    });
    }catch(err){
    return res.status(500).json({
        success: false,
        message: err.message,
    })
    }
}


//get group details controller
export const getGroupDetailsController = async (req, res) => {
    try{
        const { groupId } = req.params;

        //find group by id
        const group = await groupModel.findById(groupId)
        .populate("leader", "name email")
        .populate("members", "name email")
        .populate("course", "title courseCode");

        if(!group){
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        //check member
        const isMember = group.members.some(
            (member) => member._id.toString() === req.user._id.toString()
        );

        if(!isMember){
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            })
        }

        //send response
        return res.status(200).json({
            success: true,
            message: "Group details fetched successfully",
            group,
        })
    }catch(err){
      return res.status(500).json({
        success: false,
        message: err.message,
      })
    }
}