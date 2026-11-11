import mongoose from "mongoose";



//group schema
const groupSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    leader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
    ],
},{timestamps: true});


//group model
const groupModel = mongoose.model("Group", groupSchema);

export default groupModel;