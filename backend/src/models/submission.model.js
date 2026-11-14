
import mongoose from "mongoose";

// Submission schema
const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: undefined,
    },

    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acknowledgedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure exactly one of student or group is provided
submissionSchema.pre("validate", function () {
  const hasStudent = !!this.student;
  const hasGroup = !!this.group;

  if (hasStudent === hasGroup) {
    this.invalidate(
      "student",
      "A submission must belong to either an individual student or a group, not both."
    );
  }
});

// Prevent duplicate individual submissions
submissionSchema.index(
  { assignment: 1, student: 1 },
  {
    unique: true,
    partialFilterExpression: {
      student: { $exists: true, $type: "objectId" },
    },
  }
);

// Prevent duplicate group submissions
submissionSchema.index(
  { assignment: 1, group: 1 },
  {
    unique: true,
    partialFilterExpression: {
      group: { $exists: true, $type: "objectId" },
    },
  }
);

// Submission model
const submissionModel = mongoose.model(
  "Submission",
  submissionSchema
);

export default submissionModel;
