import { Request } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { BadRequestException } from "../Response/error.response";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf", "application/msword"],
  video: ["video/mp4", "video/quicktime"],
};

export const uploadDir = resolve("./uploads");

/**
 * Local disk storage. To move to S3/Cloudinary later,
 * swap this for multer.memoryStorage() and upload the buffer in the service.
 */
export const localFileUpload = ({
  validation = fileValidation.image,
  maxSizeMB = 5,
  folder = "general",
}: {
  validation?: string[];
  maxSizeMB?: number;
  folder?: string;
} = {}) => {
  const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const destPath = resolve(uploadDir, folder);
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
      }
      cb(null, destPath);
    },
    filename: (req: Request, file, cb) => {
      // unique name prevents overwrites and hides the original filename
      const ext = file.originalname.split(".").pop();
      cb(null, `${Date.now()}_${randomUUID()}.${ext}`);
    },
  });

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