import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../Response/error.response";
import { env } from "../../config/config.services";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf", "application/msword"],
  video: ["video/mp4", "video/quicktime"],
};

// تهيئة Cloudinary من متغيرات البيئة
cloudinary.config({
  cloud_name:env.CLOUDINARY_CLOUD_NAME,
  api_key:env.CLOUDINARY_API_KEY,
  api_secret:env.CLOUDINARY_API_SECRET,
});

/**
 * Multer middleware باستخدام memoryStorage لتجهيز الملف في الذاكرة (Buffer)
 * ثم رفعه إلى Cloudinary داخل الـ Service أو Controller.
 */
export const cloudFileUpload = ({
  validation = fileValidation.image,
  maxSizeMB = 5,
}: {
  validation?: string[];
  maxSizeMB?: number;
} = {}) => {
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    if (!validation.includes(file.mimetype)) {
      return cb(
        new BadRequestException(`Invalid file format: ${file.mimetype}`)
      );
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};

/**
 * رفع Buffer واحد إلى Cloudinary وتحديد المجلد ونوع الملف تلقائياً
 */
export const uploadBufferToCloudinary = (
  fileBuffer: Buffer,
  folder = "general"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}_${randomUUID()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "auto", // يدعم الصور، الفيديوهات، والملفات
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned empty result"));
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export { cloudinary };











































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