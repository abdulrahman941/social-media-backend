"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const encryption_secret_key = process.env.encryption_secret_key;
const IV_LENGTH = 16;
//key must be exactly 3 bytes for aes-256-cbc (validated by the config services)
const ENCRYPTION_KEY = Buffer.from(encryption_secret_key, "utf-8");
const encrypt = (text) => {
    const iv = node_crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = node_crypto_1.default.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encryptedData = cipher.update(text, "utf8", "hex");
    encryptedData += cipher.final("hex");
    return `${iv.toString("hex")}:${encryptedData}`;
};
exports.encrypt = encrypt;
const decrypt = (encryptedData) => {
    const [ivHex, encryptedText] = encryptedData.split(":");
    if (!ivHex || !encryptedText) {
        throw new Error("invalid encrypted Data format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const decipher = node_crypto_1.default.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decryptedData = decipher.update(encryptedText, "utf8", "hex");
    decryptedData += decipher.final("utf8");
    return decryptedData;
};
exports.decrypt = decrypt;
