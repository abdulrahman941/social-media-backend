"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_services_1 = require("./config/config.services");
const cors_2 = require("./utils/cors/cors");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_response_1 = require("./utils/Response/error.response");
const module_1 = require("./module");
const connection_1 = __importDefault(require("./Database/connection"));
//rate limit custom
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 429,
        message: "too many requeusts,please try again later",
    },
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
const bootstrap = async (app) => {
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)(), limiter, (0, cors_1.default)(cors_2.corsOptions));
    await (0, connection_1.default)();
    app.use("/api/v1/auth", module_1.authcontroller);
    app.use("/api/v1/post", module_1.postcontroller);
    app.use("/api/v1/user", module_1.usercontroller);
    app.get("/", (req, res) => {
        return res.status(200).json({ message: `welcome to ${config_services_1.env.application_name} app` });
    });
    app.use("/*dummy", (req, res) => {
        throw new error_response_1.NotFoundException("Route not fonnd");
    });
    app.use(error_response_1.globalErrorHandlar);
};
exports.bootstrap = bootstrap;
