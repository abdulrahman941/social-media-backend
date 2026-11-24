"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandlar = exports.tooManyRequestException = exports.ConflictException = exports.ForbiddenException = exports.UnAuthorizedException = exports.BadRequestException = exports.NotFoundException = exports.ApplicationException = void 0;
const config_services_1 = require("../../config/config.services");
const mood = config_services_1.env.mood;
class ApplicationException extends Error {
    statusCode;
    constructor(message, statusCode = 400, options) {
        super(message, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.ApplicationException = ApplicationException;
class NotFoundException extends ApplicationException {
    constructor(message, options) {
        super(message, 404, options);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends ApplicationException {
    constructor(message, options) {
        super(message, 400, options);
    }
}
exports.BadRequestException = BadRequestException;
class UnAuthorizedException extends ApplicationException {
    constructor(message, options) {
        super(message, 401, options);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class ForbiddenException extends ApplicationException {
    constructor(message, options) {
        super(message, 403, options);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends ApplicationException {
    constructor(message, options) {
        super(message, 409, options);
    }
}
exports.ConflictException = ConflictException;
class tooManyRequestException extends ApplicationException {
    constructor(message, options) {
        super(message, 429, options);
    }
}
exports.tooManyRequestException = tooManyRequestException;
const globalErrorHandlar = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDev = mood === "development" || "production";
    if (statusCode >= 500) {
        console.error(err);
    }
    res.status(statusCode).json({ message: err.message || "something went wrong", ...(isDev && { stack: err.stack }),
        cause: err.cause,
    });
};
exports.globalErrorHandlar = globalErrorHandlar;
