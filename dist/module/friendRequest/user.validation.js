"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdParamsSchema = exports.userIdParamsSchema = void 0;
const zod_1 = require("zod");
exports.userIdParamsSchema = {
    params: zod_1.z.strictObject({
        userId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    })
};
exports.requestIdParamsSchema = {
    params: zod_1.z.strictObject({
        requestId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    })
};
