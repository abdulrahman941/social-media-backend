import express, { Express,Request,Response} from 'express';
import helmet from 'helmet';
import cors from "cors"
import { corsOptions } from './utils/cors/cors';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { globalErrorHandlar, NotFoundException } from './utils/Response/error.response';
import { authcontroller, postcontroller, usercontroller } from './module';
import connectDB from './Database/connection';

const application_name=process.env.application_name as string
//rate limit custom
const limiter:RateLimitRequestHandler=rateLimit({
    windowMs:15*60*1000,
    limit:100,
    message:{
        status:429,
        message:"too many requeusts,please try again later",
    },
    standardHeaders:"draft-8",
    legacyHeaders:false,
    
})


export const bootstrap=async(app:Express):Promise<void>=>{

app.get("/",(req:Request,res:Response)=>{
return res.status(200).json({message:`welcome to ${application_name} app`})
})

await connectDB()

app.use(express.json())
app.set("trust proxy", 1);
app.use(helmet(),limiter,cors(corsOptions))
app.use("/api/v1/auth",authcontroller)
app.use("/api/v1/post",postcontroller)
app.use("/api/v1/user",usercontroller)





app.use("/*dummy",(req:Request,res:Response)=>{
    throw new NotFoundException("Route not fonnd")
})
app.use(globalErrorHandlar)


}