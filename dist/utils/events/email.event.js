"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEvents = void 0;
const node_events_1 = __importDefault(require("node:events"));
const verify_email_template_1 = require("../Email/verify.email.template");
const send_email_1 = require("../Email/send.email");
exports.EmailEvents = new node_events_1.default();
exports.EmailEvents.on("confirmEmail", async (data) => {
    try {
        data.subject = "confirm your email";
        data.html = (0, verify_email_template_1.template)(data.otp, data.username, data.subject);
        console.log(data.otp);
        await (0, send_email_1.sendEmail)(data);
    }
    catch (error) {
        console.error("failed to send email", error);
    }
});
