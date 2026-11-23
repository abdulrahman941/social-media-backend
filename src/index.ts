import { bootstrap } from "./app.controller";


bootstrap().catch((error:unknown)=>{
    console.log("failed to srart application",error);
    process.exit(1)
})