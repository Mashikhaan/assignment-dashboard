import mongoose from "mongoose";



//assignment schema
const assignmentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    professor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    dueDate:{
        type:Date,
        required:true,
    }
},{timestamps:true});


//assignment model
const assignmentModel = mongoose.model("Assignment",assignmentSchema);

export default assignmentModel;