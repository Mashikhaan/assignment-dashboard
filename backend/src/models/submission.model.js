import mongoose from "mongoose";





//submission schema
const submissionSchema = new mongoose.Schema({
    assignment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
     acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    acknowledgedAt:{
        type: Date,
        default: Date.now,
    },
},{timestamps: true});


//submission model
const submissionModel = mongoose.model("Submission", submissionSchema);

export default submissionModel;
