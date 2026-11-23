import express, { Express } from "express";
import { bootstrap } from "./app.controller";
import { env } from "./config/config.services";

const app: Express = express();
const port = Number(env.port || process.env.PORT || 3000);

bootstrap(app)
  .then(() => {
    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`Server is running on port http://127.0.0.1:${port}`);
      });
    }
  })
  .catch((error: unknown) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });

export default app;




















// import { env } from "node:process";
// import { bootstrap } from "./app.controller";
// import express, { Express} from 'express';

// const app:Express=express()

// bootstrap(app).catch((error:unknown)=>{
//     console.log("failed to srart application",error);
//     process.exit(1)
// })



// app.listen(env.port,()=>{
//     console.log(`server is running on port http://127.0.0.1:${env.port}`);
    
// })


// export default app