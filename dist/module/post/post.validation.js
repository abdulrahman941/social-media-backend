"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentIdParamsSchema = exports.updateCommentSchema = exports.createCommentSchema = exports.updatePostSchema = exports.postIdParamsSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
//post
exports.createPostSchema = {
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000).optional(),
    })
};
//post
exports.postIdParamsSchema = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    })
};
//post
exports.updatePostSchema = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000),
    })
};
//comment--->create comment
exports.createCommentSchema = {
    params: zod_1.z.strictObject({
        postId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000),
        parentId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }).optional(),
    })
};
//update comment
exports.updateCommentSchema = {
    params: zod_1.z.strictObject({
        commentId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().min(2).max(50000),
    })
};
//delete comment
exports.commentIdParamsSchema = {
    params: zod_1.z.strictObject({
        commentId: zod_1.z.string().regex(/^[0-91-fA-F]{24}$/, { error: "Invalid Id format" }),
    })
};
