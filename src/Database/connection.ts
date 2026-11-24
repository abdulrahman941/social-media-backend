import mongoose from "mongoose";


const connectDB=async():Promise<void>=>{
    try {
    const uri=process.env.mongo_uri as string
    if(!uri){
        console.error("Database UR is missing (mongo_uri)");
        throw new Error("mongo_uri is not defined in environment variables")
    }
    console.log("DB URI exists:", Boolean(uri));
    const connection=await mongoose.connect(uri,{
        serverSelectionTimeoutMS:5000,
    })
    console.log(`mongodb connected:${connection.connection.host}`);
    
} catch (error) {
    console.error(`mongodb connection error:${(error as Error).message}`);
    throw error
    
}
}


export default connectDB