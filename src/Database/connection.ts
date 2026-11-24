import mongoose from "mongoose";
import { env } from "../config/config.services";


const connectDB=async():Promise<void>=>{
    try {
    const uri=env.mongo_uri
    if(!uri){
        throw new Error("mongo_uri is not defined in environment variables")
    }
    console.log("DB URI exists:", Boolean(process.env.MONGO_URI));
    const connection=await mongoose.connect(env.mongo_uri,{
        serverSelectionTimeoutMS:5000,
    })
    console.log(`mongodb connected:${connection.connection.host}`);
    
} catch (error) {
    console.error(`mongodb connection error:${(error as Error).message}`);
    throw error
    
}
}


export default connectDB