"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.authentication = void 0;
const user_enum_1 = require("../utils/enums/user.enum");
const token_1 = require("../utils/secuirty/token");
const error_response_1 = require("../utils/Response/error.response");
/**
 * Verifies the Bearer token and attaches the user to the request.
 * Use TokenTypeEnum.REFRESH on the refresh-token endpoint.
 */
const authentication = (tokenType = user_enum_1.TokenTypeEnum.ACCESS) => {
    return async (req, res, next) => {
        try {
            console.log(req.headers.authorization);
            const { user, decoded } = await (0, token_1.decodeToken)({
                authorization: req.headers.authorization,
                tokenType,
            });
            console.log(req.headers.authorization);
            req.user = user;
            req.decoded = decoded;
            next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.authentication = authentication;
/**
 * Role guard - must run after `authentication`.
 * Example: router.get("/admin", authentication(), authorization([RoleEnum.ADMIN]))
 */
const authorization = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new error_response_1.ForbiddenException("You are not authorized to access this resource");
        }
        next();
    };
};
exports.authorization = authorization;
