"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)("./config/dev.env") });
exports.env = {
    app_url: process.env.app_url,
    //application
    port: Number(process.env.port) || 3000,
    mood: process.env.mood,
    application_name: process.env.application_name,
    //database
    mongo_uri: process.env.mongo_uri,
    //email
    email_username: process.env.email_username,
    email_password: process.env.email_password,
    email_host: process.env.email_host,
    email_port: process.env.email_port || 587,
    //jwt
    access_user_signature: process.env.access_user_signature,
    access_admin_signature: process.env.access_admin_signature,
    refresh_user_signature: process.env.refresh_user_signature,
    refresh_admin_signature: process.env.refresh_admin_signature,
    access_token_expires_in: Number(process.env.access_token_expires_in) || 3600,
    refresh_token_expires_in: Number(process.env.refresh_token_expires_in) || 604800,
    secret: process.env.secret,
    //hashing
    salt: process.env.salt || 12,
    // encryption (aes-256-cbc needs exectly 32 character)
    encryption_secret_key: process.env.encryption_secret_key,
    whitelist: process.env.whitelist
};
