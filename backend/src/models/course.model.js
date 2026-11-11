import mongoose from "mongoose";




//course schema
const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Course title is required"],
        trim:true
    },
    courseCode:{
        type:String,
        required:[true,"Course code is required"],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    professor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
},{timestamps: true});


//course model
const courseModel = mongoose.model("Course",courseSchema);

export default courseModel;