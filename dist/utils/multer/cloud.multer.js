"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localFileUpload = exports.uploadDir = exports.fileValidation = void 0;
const multer_1 = __importDefault(require("multer"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const error_response_1 = require("../Response/error.response");
exports.fileValidation = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    document: ["application/pdf", "application/msword"],
    video: ["video/mp4", "video/quicktime"],
};
exports.uploadDir = (0, node_path_1.resolve)("./uploads");
/**
 * Local disk storage. To move to S3/Cloudinary later,
 * swap this for multer.memoryStorage() and upload the buffer in the service.
 */
const localFileUpload = ({ validation = exports.fileValidation.image, maxSizeMB = 5, folder = "general", } = {}) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const destPath = (0, node_path_1.resolve)(exports.uploadDir, folder);
            if (!(0, node_fs_1.existsSync)(destPath)) {
                (0, node_fs_1.mkdirSync)(destPath, { recursive: true });
            }
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            // unique name prevents overwrites and hides the original filename
            const ext = file.originalname.split(".").pop();
            cb(null, `${Date.now()}_${(0, node_crypto_1.randomUUID)()}.${ext}`);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (!validation.includes(file.mimetype)) {
            return cb(new error_response_1.BadRequestException(`Invalid file format: ${file.mimetype}`));
        }
        cb(null, true);
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
    });
};
exports.localFileUpload = localFileUpload;
