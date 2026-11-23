"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.postIdParamsSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = {
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000).optional(),
    })
};
exports.postIdParamsSchema = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    })
};
exports.updatePostSchema = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000),
    })
};
