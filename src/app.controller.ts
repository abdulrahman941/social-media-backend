import express, { Express,Request,Response} from 'express';
import helmet from 'helmet';
import cors from "cors"
import { env } from './config/config.services';
import { corsOptions } from './utils/cors/cors';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { globalErrorHandlar, NotFoundException } from './utils/Response/error.response';
import { authcontroller, postcontroller, usercontroller } from './module';
import connectDB from './Database/connection';


//rate limit custom
const limiter:RateLimitRequestHandler=rateLimit({
    windowMs:15*60*1000,
    limit:50,
    message:{
        status:429,
        message:"too many requeusts,please try again later",
    },
    standardHeaders:"draft-8",
    legacyHeaders:false,
    
})


export const bootstrap=async(app:Express):Promise<void>=>{


app.use(helmet(), limiter, cors(corsOptions));
app.use(express.json());
app.use(helmet(),limiter,cors(corsOptions))
app.use(express.json())
await connectDB()
app.use("/api/v1/auth",authcontroller)
app.use("/api/v1/post",postcontroller)
app.use("/api/v1/user",usercontroller)



app.get("/",(req:Request,res:Response)=>{
return res.status(200).json({message:`welcome to ${env.application_name} app`})
})

app.use("/*dummy",(req:Request,res:Response)=>{
    throw new NotFoundException("Route not fonnd")
})
app.use(globalErrorHandlar)


}