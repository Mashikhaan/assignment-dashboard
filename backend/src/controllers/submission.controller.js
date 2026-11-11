import assignmentModel from "../models/assignment.model.js";
import courseModel from "../models/course.model.js";
import groupModel from "../models/group.model.js";
import submissionModel from "../models/submission.model.js";




//acknowledge individual assignment submission controller
export const acknowledgeIndividualAssignmentController = async (req, res) => {
    try {
     const {assignmentId} = req.params;

     //find assignment by Id
     const assignment = await assignmentModel.findById(assignmentId).populate("course", "students");

     if(!assignment){
         return res.status(404).json({message: "Assignment not found"});
     }

     //check submission type
     if(assignment.submissionType !== "Individual"){
         return res.status(400).json({message: "This assignment is not an individual assignment"});
     }

     //check enrolled students in course
     const isEnrolled = assignment.course.students.some(
        (studentId) => studentId.toString() === req.user._id.toString()
     )

     if(!isEnrolled){
         return res.status(401).json({message: "You are not enrolled in this course"});
     }

     //check if student has already submitted
     const existingSubmission = await submissionModel.findOne({
         assignment: assignmentId,
         student: req.user._id
     });

     if(existingSubmission){
         return res.status(400).json({message: "You have already submitted this assignment"});
     }

     //create submission
     const submission = await submissionModel.create({
        assignment: assignmentId,
        student: req.user._id,
        acknowledgedBy:req.user._id,
        acknowledgedAt: new Date(),
     })

     //send response
     return res.status(201).json({
        success: true,
        message: "Assignment acknowledged successfully",
        submission
        });

    }catch(err){
     return res.status(500).json({
        success: false,
        message: err.message
     })
    }
}


//acknowledge group assignment by group leader
export const acknowledgeGroupAssignmentController = async (req, res) => {
    try {
        const {assignmentId} = req.params;
        const {groupId} = req.body;

        //find and check assignment exists
        const assignment = await assignmentModel.findById(assignmentId);

        if(!assignment){
            return res.status(404).json({message: "Assignment not found"});
        }


       //check assignment submission type
       if(assignment.submissionType !== "Group"){
        return res.status(400).json({message: "this  is not a group assignment"});
       }

       //find and check group exist
       const group = await groupModel.findById(groupId);

       if(!group){
        return res.status(404).json({message: "Group not found"});
       }

       //check group belong assignment
       if(group.course.toString() !== assignment.course.toString()){
        return res.status(400).json({message: "Group does not belong to this assignment's course"});
       }

       //check group leader is the one who is acknowledging
       if(group.leader.toString() !== req.user._id.toString()){
        return res.status(403).json({
            success: false,
            message: "Only group leader can acknowledge this assignment",});
       }

       //check group is already acknowledge
       const existingSubmission = await submissionModel.findOne({
        assignment: assignmentId,
        group: groupId,
       })

       if(existingSubmission){
        return res.status(400).json({message: "Group has already acknowledged this assignment"});
       }

       //create submission
       const submission = await submissionModel.create({
           assignment: assignmentId,
           group: groupId,
           acknowledgedBy: req.user._id,
           acknowledgedAt: new Date(),
       })

       //send response
       return res.status(201).json({
        success: true,
        message: "Group assignment acknowledged  successfully", 
        submission,
    });
    } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


//get assignment status
export const getAssignmentStatusController = async (req, res) => {
    try {
        const {assignmentId} = req.params;

        //get assignment
        const assignment = await assignmentModel.findById(assignmentId)
        .populate("course","students")

        //check if assignment exists
        if(!assignment){
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        //check enrolled students
         const isEnrolled = assignment.course.students.some(
      (studentId) => studentId.toString() === req.user.id
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    let submission;

     if (assignment.submissionType === "Individual") {
      submission = await submissionModel.findOne({
        assignment: assignmentId,
        student: req.user.id,
      }).populate("acknowledgedBy", "name email");
    } else {
      const group = await groupModel.findOne({
        course: assignment.course._id,
        members: req.user.id,
      });


      if (!group) {
        return res.status(404).json({
          success: false,
          message: "You are not a member of any group in this course.Create or join one to submit this assignment.",
        });
      }

      //submission
      submission = await submissionModel.findOne({
        assignment: assignmentId,
        group: group._id,
      }).populate("acknowledgedBy", "name email");
    }

    return res.status(200).json({
      success: true,
      acknowledged: !!submission,
      submission,
    });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
        
      })
    }
}


//get submission assignment tracking controller
export const getSubmissionAssignmentTrackingController = async (req, res) => {
    try {
    const { assignmentId } = req.params;

    //find assignment
    const assignment = await assignmentModel.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }


    //check if user is professor
    if (assignment.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assignment",
      });
    }

    let tracking = [];
    let total = 0;
    let submitted = 0;

    if (assignment.submissionType === "Individual") {
      const course = await courseModel.findById(assignment.course)
        .populate("students", "name email");

      const submissions = await submissionModel.find({
        assignment: assignmentId,
      });

      //get tracking for each student(Individual)
      tracking = course.students.map((student) => {
        const submission = submissions.find(
          (item) => item.student?.toString() === student._id.toString()
        );

        return {
          student,
          status: submission ? "Submitted" : "Pending",
          acknowledgedAt: submission?.acknowledgedAt || null,
        };
      });

      total = tracking.length;

      submitted = tracking.filter(
        (item) => item.status === "Submitted"
      ).length;

    } else {
      const groups = await groupModel.find({
        course: assignment.course,
      })
        .populate("leader", "name email")
        .populate("members", "name email");

      const submissions = await submissionModel.find({
        assignment: assignmentId,
      }).populate("acknowledgedBy", "name email");

      //get tracking for each group
      tracking = groups.map((group) => {
        const submission = submissions.find(
          (item) => item.group?.toString() === group._id.toString()
        );

        return {
          group,
          status: submission ? "Submitted" : "Pending",
          acknowledgedBy: submission?.acknowledgedBy || null,
          acknowledgedAt: submission?.acknowledgedAt || null,
        };
      });

      total = tracking.length;

      submitted = tracking.filter(
        (item) => item.status === "Submitted"
      ).length;
    }

    return res.status(200).json({
      success: true,
      total,
      submitted,
      pending: total - submitted,
      tracking,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
