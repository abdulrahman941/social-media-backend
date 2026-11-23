"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = require("./app.controller");
const express_1 = __importDefault(require("express"));
const config_services_1 = require("./config/config.services");
const app = (0, express_1.default)();
(0, app_controller_1.bootstrap)(app).catch((error) => {
    console.log("failed to srart application", error);
    process.exit(1);
});
app.listen(config_services_1.env.port, () => {
    console.log(`server is running on port ${config_services_1.env.port}`);
});
exports.default = app;
