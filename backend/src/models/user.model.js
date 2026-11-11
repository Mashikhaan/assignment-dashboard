import mongoose from "mongoose";



//user schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        trim: true,

    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["student", "professor"],
        default: "student",
        required: [true, "Role is required"],
    }
},
 { timestamps: true }
);


//user model
const userModel = mongoose.model("User", userSchema);


export default userModel;