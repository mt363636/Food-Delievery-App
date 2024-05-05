import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://mterniak:02092001@cluster0.sqxut2u.mongodb.net/food-del').then(() =>console.log("DB connected")); 
           
}