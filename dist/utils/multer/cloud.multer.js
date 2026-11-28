"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.uploadBufferToCloudinary = exports.cloudFileUpload = exports.fileValidation = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const node_crypto_1 = require("node:crypto");
const error_response_1 = require("../Response/error.response");
const config_services_1 = require("../../config/config.services");
exports.fileValidation = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    document: ["application/pdf", "application/msword"],
    video: ["video/mp4", "video/quicktime"],
};
// تهيئة Cloudinary من متغيرات البيئة
cloudinary_1.v2.config({
    cloud_name: config_services_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: config_services_1.env.CLOUDINARY_API_KEY,
    api_secret: config_services_1.env.CLOUDINARY_API_SECRET,
});
/**
 * Multer middleware باستخدام memoryStorage لتجهيز الملف في الذاكرة (Buffer)
 * ثم رفعه إلى Cloudinary داخل الـ Service أو Controller.
 */
const cloudFileUpload = ({ validation = exports.fileValidation.image, maxSizeMB = 5, } = {}) => {
    const storage = multer_1.default.memoryStorage();
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
exports.cloudFileUpload = cloudFileUpload;
/**
 * رفع Buffer واحد إلى Cloudinary وتحديد المجلد ونوع الملف تلقائياً
 */
const uploadBufferToCloudinary = (fileBuffer, folder = "general") => {
    return new Promise((resolve, reject) => {
        const publicId = `${Date.now()}_${(0, node_crypto_1.randomUUID)()}`;
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            public_id: publicId,
            resource_type: "auto", // يدعم الصور، الفيديوهات، والملفات
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Cloudinary upload returned empty result"));
            }
            resolve(result);
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
// import { Request } from "express";
// import multer, { FileFilterCallback, StorageEngine } from "multer";
// import { existsSync, mkdirSync } from "node:fs";
// import { resolve } from "node:path";
// import { randomUUID } from "node:crypto";
// import { BadRequestException } from "../Response/error.response";
// export const fileValidation = {
//   image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
//   document: ["application/pdf", "application/msword"],
//   video: ["video/mp4", "video/quicktime"],
// };
// export const uploadDir = resolve("./uploads");
// /**
//  * Local disk storage. To move to S3/Cloudinary later,
//  * swap this for multer.memoryStorage() and upload the buffer in the service.
//  */
// export const localFileUpload = ({
//   validation = fileValidation.image,
//   maxSizeMB = 5,
//   folder = "general",
// }: {
//   validation?: string[];
//   maxSizeMB?: number;
//   folder?: string;
// } = {}) => {
//   const storage: StorageEngine = multer.diskStorage({
//     destination: (req: Request, file, cb) => {
//       const destPath = resolve(uploadDir, folder);
//       if (!existsSync(destPath)) {
//         mkdirSync(destPath, { recursive: true });
//       }
//       cb(null, destPath);
//     },
//     filename: (req: Request, file, cb) => {
//       // unique name prevents overwrites and hides the original filename
//       const ext = file.originalname.split(".").pop();
//       cb(null, `${Date.now()}_${randomUUID()}.${ext}`);
//     },
//   });
//   const fileFilter = (
//     req: Request,
//     file: Express.Multer.File,
//     cb: FileFilterCallback
//   ): void => {
//     if (!validation.includes(file.mimetype)) {
//       return cb(
//         new BadRequestException(`Invalid file format: ${file.mimetype}`)
//       );
//     }
//     cb(null, true);
//   };
//   return multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: maxSizeMB * 1024 * 1024 },
//   });
// };
