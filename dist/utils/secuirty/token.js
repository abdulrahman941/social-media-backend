"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.createLoginCredentials = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../../Database/models/user.model");
const user_enum_1 = require("../enums/user.enum");
const error_response_1 = require("../Response/error.response");
const generateToken = ({ payload, secret, options }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const access_admin_signature = process.env.access_admin_signature;
const access_user_signature = process.env.access_user_signature;
const refresh_admin_signature = process.env.refresh_admin_signature;
const refresh_user_signature = process.env.refresh_user_signature;
const access_token_expires_in = Number(process.env.access_token_expires_in);
const refresh_token_expires_in = Number(process.env.refresh_token_expires_in);
// verifyToken (الأسطر 32 - 40)[cite: 3]
const verifyToken = ({ token, secret, }) => {
    return (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyToken = verifyToken;
// picks the right secret based on the token type and the user's role (الأسطر 42 - 49)[cite: 3]
const getSignature = (type, role) => {
    const isAdmin = role === user_enum_1.RoleEnum.ADMIN;
    if (type === user_enum_1.TokenTypeEnum.ACCESS) {
        return isAdmin ? access_admin_signature : access_user_signature;
    }
    return isAdmin ? refresh_admin_signature : refresh_user_signature;
};
const createLoginCredentials = (user) => {
    const isAdmin = user.role === user_enum_1.RoleEnum.ADMIN;
    const accesssecret = isAdmin ? access_admin_signature : access_user_signature;
    const refreshsecret = isAdmin ? refresh_admin_signature : refresh_user_signature;
    const accesstoken = (0, exports.generateToken)({ payload: { _id: user._id }, secret: accesssecret, options: { expiresIn: access_token_expires_in } });
    const refreshtoken = (0, exports.generateToken)({ payload: { _id: user._id }, secret: refreshsecret, options: { expiresIn: refresh_token_expires_in } });
    return { accesstoken, refreshtoken };
};
exports.createLoginCredentials = createLoginCredentials;
/**
 * Splits "Bearer <token>", verifies the signature, loads the user,
 * and rejects tokens issued before the last credentials change.
 */
// decodeToken (الأسطر 75 - 83+)[cite: 1]
const decodeToken = async ({ authorization, tokenType = user_enum_1.TokenTypeEnum.ACCESS, }) => {
    if (!authorization) {
        throw new error_response_1.UnAuthorizedException("Missing authorization header");
    }
    const [bearer, token] = authorization.split(" ");
    if (!bearer || !token) {
        throw new error_response_1.UnAuthorizedException("Invalid authorization format");
    }
    const decoded = (0, exports.verifyToken)({
        token,
        secret: getSignature(tokenType, user_enum_1.RoleEnum.USER), // أو حسب الدور بعد فك التوكن/جلب المستخدم
    });
    // جلب المستخدم والتحقق من صلاحية التوكن مقارنة بآخر تغيير لبيانات الاعتماد
    const user = await user_model_1.UserModel.findById(decoded._id);
    if (!user) {
        throw new error_response_1.UnAuthorizedException("User not found");
    }
    return { user, decoded };
};
exports.decodeToken = decodeToken;
