import assignmentModel from "../models/assignment.model.js";
import courseModel from "../models/course.model.js";

//create assignment controller
export const createAssignmentController = async (req, res) => {
  try {
    const { title, description, course, dueDate } = req.body;

    // Check required fields
    if (!title || !description || !course || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //find existing course
    const existingCourse = await courseModel.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //check course ownership
    if (existingCourse.professor.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to create assignment for this course",
      });
    }

    //validate due date
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date must be in the future",
      });
    }

    //create assignment
    const assignment = await assignmentModel.create({
      title,
      description,
      course,
      professor: req.user._id,
      dueDate,
    });

    //send response
    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get all assignments controller
export const getAllAssignmentsController = async (req, res) => {
  try {
    let assignments;

    //check if user is professor
    if (req.user.role === "professor") {
      assignments = await assignmentModel
        .find({
          professor: req.user._id,
        })
        .populate("course", "title courseCode");
    }

    //check if user is student
    else if (req.user.role === "student") {
      const enrolledCourses = await courseModel
        .find({
          students: req.user._id,
        })
        .select("_id");

      //course IDs
      const courseIds = enrolledCourses.map((course) => course._id);

      //get assignments
      assignments = await assignmentModel
        .find({
          course: { $in: courseIds },
        })
        .populate("course", "title courseCode");
    }

    //send response
    return res.status(200).json({
      success: true,
      message: " All Assignments fetched successfully",
      count: assignments.length,
      assignments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get single assignment controller
export const getSingleAssignmentController = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await assignmentModel
      .findById(assignmentId)
      .populate("course", "title courseCode students");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    //Professor authorization
    if (
      req.user.role === "professor" &&
      assignment.professor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this assignment",
      });
    }

    //Student authorization
    if (
      req.user.role === "student" &&
      !assignment.course.students.some(
        (studentId) => studentId.toString() === req.user._id,
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    //send response
    return res.status(200).json({
      success: true,
      message: "Assignment fetched successfully",
      assignment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



//update assignment controller
export const updateAssignmentController = async (req, res) => {
    try{
        const {assignmentId} = req.params;

        const assignment = await assignmentModel.findById(assignmentId);

        if(!assignment){
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        //check assignment ownership
        if(assignment.professor.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this assignment",
            });
        }

        //only allow specific fields 
        const allowedFields = ["title", "description", "dueDate"];

        allowedFields.forEach((field) => {
            if(req.body[field] !== undefined){
                assignment[field] = req.body[field];
            }
        })

        // Validate due date if provided
    if (
      req.body.dueDate !== undefined &&
      (!Number.isFinite(new Date(req.body.dueDate).getTime()) ||
        new Date(req.body.dueDate) <= new Date())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid future due date",
      });
    }

    //save in database
    await assignment.save();

    //send response
    return res.status(200).json({
        success: true,
        message: "Assignment updated successfully",
        assignment,
    })
    }catch(err){
      return res.status(500).json({
      success: false,
      message: err.message,
    });
    }
}


//delete assignment controller
export const deleteAssignmentController = async (req, res) => {
    try {
        const {assignmentId} = req.params;

        const assignment = await assignmentModel.findById(assignmentId);

        if(!assignment){
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        //check professor ownership to delete this assignment
        if(assignment.professor.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this assignment",
            })
        }

        //delete assignment
        await assignmentModel.findByIdAndDelete(assignmentId);

        //send response
        return res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        })
        
    } catch (err) {
        return res.status(500).json({
      success: false,
      message: err.message,
    });
    }
}