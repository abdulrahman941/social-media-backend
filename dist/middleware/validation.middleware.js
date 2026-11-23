"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const error_response_1 = require("../utils/Response/error.response");
const validation = (Schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(Schema)) {
            const keySchema = Schema[key];
            if (!keySchema)
                continue;
            const validationResults = keySchema.safeParse(req[key]);
            if (!validationResults.success) {
                validationErrors.push({ key, issues: validationResults.error.issues.map((issue) => ({
                        message: issue.message,
                        path: issue.path,
                    })),
                });
            }
            continue;
        }
        if (validationErrors.length > 0) {
            throw new error_response_1.BadRequestException("validation Error", { cause: validationErrors });
        }
        next();
    };
};
exports.validation = validation;
