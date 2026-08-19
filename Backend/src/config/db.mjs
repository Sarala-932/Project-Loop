import mongoose from "mongoose";
import {config} from "./config.mjs";

const connectDB = async () => {
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB Connected");
};
export default connectDB;
