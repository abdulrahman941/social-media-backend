"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../Database/models/user.model");
const error_response_1 = require("../../utils/Response/error.response");
const generateOTP_1 = require("../../utils/generateOTP");
const hash_1 = require("../../utils/secuirty/hash");
const email_event_1 = require("../../utils/events/email.event");
const token_1 = require("../../utils/secuirty/token");
class AuthService {
    constructor() { }
    signup = async (req, res) => {
        const { username, email, password } = req.body;
        const checkUserExists = await user_model_1.UserModel.findOne({ email }).select("email");
        if (checkUserExists)
            throw new error_response_1.ConflictException("user already exist");
        const otp = (0, generateOTP_1.generateOTP)();
        const [user] = await user_model_1.UserModel.create([
            {
                username,
                email,
                password: await (0, hash_1.generateHash)(password),
                confirmEmailOTP: await (0, hash_1.generateHash)(otp)
            },
        ], { validateBeforeSave: true });
        email_event_1.EmailEvents.emit("confirmEmail", {
            to: email,
            username,
            otp,
        });
        return res.status(201).json({ message: "Done", user });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await user_model_1.UserModel.findOne({ email, confirmEmailOTP: { $exists: true }, confirmedAt: { $exists: false } });
        if (!user || !user.confirmEmailOTP)
            throw new error_response_1.NotFoundException("Invalid account");
        if (!await (0, hash_1.compareHash)(otp, user.confirmEmailOTP))
            throw new error_response_1.BadRequestException("Invalid OTP");
        await user_model_1.UserModel.updateOne({ email }, { confirmedAt: new Date(), $unset: { confirmEmailOTP: true }, $inc: { _v: 1 } });
        return res.status(200).json({ message: "user confirmed successfully" });
    };
    Login = async (req, res) => {
        const { email, password } = req.body;
        const user = await user_model_1.UserModel.findOne({ email, confirmedAt: { $exists: true } });
        if (!user)
            throw new error_response_1.NotFoundException("Invalid account");
        if (!await (0, hash_1.compareHash)(password, user.password))
            throw new error_response_1.BadRequestException("Invalid password");
        const credentials = (0, token_1.createLoginCredentials)(user);
        return res.status(200).json({ message: "Done", credentials });
    };
}
exports.default = new AuthService();
//DTO Data tranfer object
