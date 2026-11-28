import { CorsOptions } from "cors";
import { env } from "../../config/config.services";

const whitelist: string[] = (env.whitelist || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("not allowed by cors"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};













// import {CorsOptions} from "cors"
// import { env } from "../../config/config.services"


// const whitelist:string[]=env.whitelist.split(",")

// export const corsOptions:CorsOptions ={
// origin:(origin,callback)=>{
//     if(!origin){
//     return callback(null,true)

//     }
//     if(whitelist.includes(origin)){
//         return callback(null,true)
//     }
//     return callback(new Error("not allowed by cors"))
// }
// }
