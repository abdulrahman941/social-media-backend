"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const config_services_1 = require("../../config/config.services");
const whitelist = (config_services_1.env.whitelist || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
exports.corsOptions = {
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
