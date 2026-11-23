"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const config_services_1 = require("../../config/config.services");
const whitelist = config_services_1.env.whitelist.split(",");
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("not allowed by cors"));
    }
};
