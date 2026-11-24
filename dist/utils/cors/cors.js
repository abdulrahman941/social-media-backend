"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const whitelist = (process.env.whitelist || "").split(",");
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
