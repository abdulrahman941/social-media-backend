import mongoose from "mongoose";


const connectDB=async():Promise<void>=>{
    try {
    const mongo_uri=process.env.mongo_uri as string
    if(!mongo_uri){
        console.error("Database UR is missing (mongo_uri)");
        throw new Error("mongo_uri is not defined in environment variables")
    }
    console.log("DB URI exists:", Boolean(mongo_uri));
    const connection=await mongoose.connect(mongo_uri,{
        serverSelectionTimeoutMS:5000,
    })
    console.log(`mongodb connected:${connection.connection.host}`);
    
} catch (error) {
    console.error(`mongodb connection error:${(error as Error).message}`);
    throw error
    
}
}


export default connectDB