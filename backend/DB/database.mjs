import mongoose from "mongoose";

export const DBConnect = async () => {
    try{
        const res = await mongoose.connect(process.env.MONGO_DB);
        console.log("Connected to Database!");
    } catch(err) {
        console.error(err);
    }
}