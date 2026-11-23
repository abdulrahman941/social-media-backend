import { env } from "node:process";
import { bootstrap } from "./app.controller";
import express, { Express} from 'express';

const app:Express=express()

bootstrap(app).catch((error:unknown)=>{
    console.log("failed to srart application",error);
    process.exit(1)
})

app.listen(env.port,()=>{
    console.log(`server is running on port http://127.0.0.1:${env.port}`);
    
})