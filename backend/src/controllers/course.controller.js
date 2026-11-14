import mongoose from "mongoose";
import courseModel from "../models/course.model.js";
import assignmentModel from "../models/assignment.model.js";
import groupModel from "../models/group.model.js";
import submissionModel from "../models/submission.model.js";


//Create course controller
export const createCourseController = async(req, res) => {
        try {
           const {title, courseCode, description } = req.body;
           
           
           //validation
           if(!title || !courseCode || !description) {
             return  res.status(400).json({
                 success: false,
                message: "Course title and course code are required"
            });
           }

           //exist course
           const existingCourse = await courseModel.findOne({
            courseCode: courseCode.trim()
           })

           if(existingCourse) {
            res.status(400).json({
                 success: false,
                message: "Course already exist"
            });
           }

           //create course
           const course = await courseModel.create({
               title,
               courseCode,
               description,
               professor: req.user._id
           });

           //send response
           res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
           })
        } catch (error) {
            console.error("Create course error", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
}


//get all course controller
export const getAllCourseController = async (req, res) => {
    try {
        let courses;

        if(req.user.role === "professor"){
            //find professor created course
            courses = await courseModel.find({
                professor: req.user._id
            })
        }else if(req.user.role === "student"){
            //find student enrolled courses
            courses = await courseModel.find({
                students: req.user._id
            })
        }

        //send response
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            count: courses.length,
            courses
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: err.message
        })
    }
}


//get single course controller
export const getSingleCourseController = async (req, res) => {
    try {
        const {courseId} = req.params;

        //find course
        const course = await courseModel.findById(courseId);

        //validation
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        //professor authorization
        if(req.user.role === "professor" && course.professor.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not authorized to access this course",
            })
        }

        //student authorization
        if(req.user.role === "student" && !course.students.includes(req.user._id)){
            return res.status(401).json({
                success: false,
                message: "You are not enrolled in this course",
            })
        }

        //send response
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}



//update course controller
export const updateCourseController = async (req, res) => {
    try {
        const {courseId} = req.params;
        //find course
        const course = await courseModel.findById(courseId)

        //check if course exists
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        //check course ownership
        if(course.professor.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this course",
            })
        }


        //update course
           const allowedFields = ["title",  "courseCode", "description"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    //save in db
    await course.save();

    //send response
    return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course
    })
    

}catch(err){

    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
}
};


//delete course controller
export const deleteCourseController = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { courseId } = req.params;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Find course
    const course = await courseModel.findById(courseId).session(session);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check course ownership
    if (course.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // Perform cascade deletion in a transaction
    await session.withTransaction(async () => {

      // Find all assignments belonging to this course
      const assignments = await assignmentModel
        .find({ course: courseId })
        .select("_id")
        .session(session);

      const assignmentIds = assignments.map(
        (assignment) => assignment._id
      );

      // Delete submissions of these assignments
      await submissionModel.deleteMany({
        assignment: { $in: assignmentIds },
      }).session(session);

      // Delete all groups belonging to this course
      await groupModel.deleteMany({
        course: courseId,
      }).session(session);

      // Delete all assignments belonging to this course
      await assignmentModel.deleteMany({
        course: courseId,
      }).session(session);

      // Finally delete the course
      await courseModel.deleteOne({
        _id: courseId,
      }).session(session);

    });

    return res.status(200).json({
      success: true,
      message: "Course and all related data deleted successfully",
    });

  } catch (err) {
    console.error("Delete course error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: err.message,
    });

  } finally {
    await session.endSession();
  }
};



//Enroll course controller
export const enrollCourseController = async (req, res) => {
    try {
        const {courseId} = req.params;

        const studentId = req.user._id;

        const course = await courseModel.findById(courseId);

        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        //check if student is already enrolled in course
        const alreadyEnrolled = course.students.some((id) => id.toString() === studentId.toString());

        if(alreadyEnrolled){
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            })
        }

      //push student id to course students array
      course.students.push(studentId);

     //save in database
      await course.save();

      //send response 
      res.status(200).json({
        success: true,
        message: "Successfully enrolled in course",
        course
      })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


//get enrolled students in course controller
export const getEnrolledStudentsController = async (req, res) => {
    try {
        const {courseId} = req.params;

        //find course with populate students
        const course = await courseModel.findById(courseId).populate('students', 'name email');

        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        //check course ownership
        if(course.professor.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access these students"
            })
        }

        //send response
        return res.status(200).json({
            success: true,
            message: "Enrolled students fetched successfully",
            count: course.students.length,
            students: course.students
        })
    } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}