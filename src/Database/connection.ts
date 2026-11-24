import mongoose from "mongoose";
import { env } from "../config/config.services";


const connectDB=async():Promise<void>=>{
 // تجنب إعادة الاتصال إذا كان متصلاً بالفعل
  if (mongoose.connection.readyState === 1) {
    return;
  }
    try {
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