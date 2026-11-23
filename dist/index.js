"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = require("node:process");
const app_controller_1 = require("./app.controller");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
(0, app_controller_1.bootstrap)(app).catch((error) => {
    console.log("failed to srart application", error);
    process.exit(1);
});
app.listen(node_process_1.env.port, () => {
    console.log(`server is running on port http://127.0.0.1:${node_process_1.env.port}`);
});
exports.default = app;
