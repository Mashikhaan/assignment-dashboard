import mongoose from 'mongoose';



//connect to db
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected db");
    }catch(err){
        console.log("Mongodb error" , err)
    }
}


export default connectDB;