import mongoose from "mongoose";


const connectDB=async():Promise<void>=>{
    try {
    const connection=await mongoose.connect("mongodb+srv://abdulrahman1999hemida_db_user:9February99@cluster0.ihxc9k2.mongodb.net/",{
        serverSelectionTimeoutMS:5000,
    })
    console.log(`mongodb connected:${connection.connection.host}`);
    
} catch (error) {
    console.error(`mongodb connection error:${(error as Error).message}`);
    throw error
    
}
}


export default connectDB