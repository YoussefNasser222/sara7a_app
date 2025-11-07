import mongoose from "mongoose";
import dotenv from "dotenv"
const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("connected to MongoDB successfully");
    })
    .catch((err)=>{
        console.log(err.message);
        
    })
}
export {connectDB}; 