import {CorsOptions} from "cors"


const whitelist:string[]=(process.env.whitelist||"").split(",")

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
