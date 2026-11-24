"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const error_response_1 = require("../Response/error.response");
const config_services_1 = require("../../config/config.services");
const email_username = config_services_1.env.email_username;
const email_password = config_services_1.env.email_password;
const sendEmail = async (data) => {
    if (!data.html && !data.attachments?.length && !data.text) {
        throw new error_response_1.BadRequestException("Missing Email content");
    }
    const transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: {
            user: email_username,
            pass: email_password
        }
    });
    await transporter.sendMail({
        ...data,
        from: `"Route academy <${email_username}>`,
    });
};
exports.sendEmail = sendEmail;
