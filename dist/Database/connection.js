"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.mongo_uri;
        if (!uri) {
            console.error("Database UR is missing (mongo_uri)");
            throw new Error("mongo_uri is not defined in environment variables");
        }
        console.log("DB URI exists:", Boolean(uri));
        const connection = await mongoose_1.default.connect(uri, {
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
