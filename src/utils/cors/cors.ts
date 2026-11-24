import {CorsOptions} from "cors"
import { env } from "../../config/config.services"


const whitelist:string[]=env.whitelist.split(",")

export const corsOptions:CorsOptions ={
origin:(origin,callback)=>{
    if(!origin){
    return callback(null,true)

    }
    if(whitelist.includes(origin)){
        return callback(null,true)
    }
    return callback(new Error("not allowed by cors"))
}
}
