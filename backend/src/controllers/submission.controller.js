import assignmentModel from "../models/assignment.model.js";
import courseModel from "../models/course.model.js";
import groupModel from "../models/group.model.js";
import submissionModel from "../models/submission.model.js";





// Acknowledge individual assignment submission
export const acknowledgeIndividualAssignmentController = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find assignment and populate course students
    const assignment = await assignmentModel
      .findById(assignmentId)
      .populate("course", "students");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (!assignment.course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check submission type
    if (assignment.submissionType !== "Individual") {
      return res.status(400).json({
        success: false,
        message: "This assignment is not an individual assignment",
      });
    }

    // Check course enrollment
    const isEnrolled = assignment.course.students.some(
      (studentId) => String(studentId) === String(userId)
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Check existing submission
    const existingSubmission = await submissionModel.findOne({
      assignment: assignmentId,
      student: userId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this assignment",
      });
    }

    // Create submission
    const submission = await submissionModel.create({
      assignment: assignmentId,
      student: userId,
      acknowledgedBy: userId,
      acknowledgedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Assignment acknowledged successfully",
      submission,
    });

  } catch (err) {
    // Handle duplicate index error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this assignment",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




// Acknowledge group assignment by group leader
export const acknowledgeGroupAssignmentController = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { groupId } = req.body;

    const userId = req.user?._id || req.user?.id;

    // Validate required fields
    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required",
      });
    }

    // Find assignment
    const assignment = await assignmentModel.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check submission type
    if (assignment.submissionType !== "Group") {
      return res.status(400).json({
        success: false,
        message: "This is not a group assignment",
      });
    }

    // Find group
    const group = await groupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check whether group belongs to assignment course
    if (
      String(group.course) !== String(assignment.course)
    ) {
      return res.status(400).json({
        success: false,
        message: "Group does not belong to this assignment's course",
      });
    }

    // Check whether the requester is the group leader
    if (String(group.leader) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only group leader can acknowledge this assignment",
      });
    }

    // Check whether group leader is enrolled in the course
    const course = await courseModel.findById(assignment.course)
      .select("students");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isEnrolled = course.students.some(
      (studentId) => String(studentId) === String(userId)
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "Group leader is not enrolled in this course",
      });
    }

    // Check existing submission
    const existingSubmission = await submissionModel.findOne({
      assignment: assignmentId,
      group: groupId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "Group has already acknowledged this assignment",
      });
    }

    // Create submission
    const submission = await submissionModel.create({
      assignment: assignmentId,
      group: groupId,
      acknowledgedBy: userId,
      acknowledgedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Group assignment acknowledged successfully",
      submission,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



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
    const userId = req.user?._id || req.user?.id;

    // Find assignment
    const assignment = await assignmentModel.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check professor authorization
    if (String(assignment.professor) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assignment",
      });
    }

    let tracking = [];
    let total = 0;
    let submitted = 0;

    // Individual assignment tracking
    if (assignment.submissionType === "Individual") {
      const course = await courseModel
        .findById(assignment.course)
        .populate("students", "name email");

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const submissions = await submissionModel.find({
        assignment: assignmentId,
      });

      tracking = course.students.map((student) => {
        const submission = submissions.find(
          (item) => String(item.student) === String(student._id)
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
    }

    // Group assignment tracking
    else if (assignment.submissionType === "Group") {
      const groups = await groupModel
        .find({
          course: assignment.course,
        })
        .populate("leader", "name email")
        .populate("members", "name email");

      const submissions = await submissionModel
        .find({
          assignment: assignmentId,
        })
        .populate("acknowledgedBy", "name email")
        .populate("group");

      tracking = groups.map((group) => {
        const submission = submissions.find(
          (item) => String(item.group?._id || item.group) === String(group._id)
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
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment submission type",
      });
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
};
