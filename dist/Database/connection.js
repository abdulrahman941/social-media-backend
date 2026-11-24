"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_services_1 = require("../config/config.services");
const connectDB = async () => {
    try {
        const uri = config_services_1.env.mongo_uri;
        if (!uri) {
            throw new Error("mongo_uri is not defined in environment variables");
        }
        const connection = await mongoose_1.default.connect(config_services_1.env.mongo_uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`mongodb connected:${connection.connection.host}`);
    }
    catch (error) {
        console.error(`mongodb connection error:${error.message}`);
        throw error;
    }
};
exports.default = connectDB;
