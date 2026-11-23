"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_controller_1 = require("./app.controller");
const config_services_1 = require("./config/config.services");
const app = (0, express_1.default)();
const port = Number(config_services_1.env.port || process.env.PORT || 3000);
(0, app_controller_1.bootstrap)(app)
    .then(() => {
    if (!process.env.VERCEL) {
        app.listen(port, () => {
            console.log(`Server is running on port http://127.0.0.1:${port}`);
        });
    }
})
    .catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
});
exports.default = app;
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
