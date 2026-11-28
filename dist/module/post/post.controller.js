"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const cloud_multer_1 = require("../../utils/multer/cloud.multer");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const validators = __importStar(require("./post.validation"));
const post_services_1 = __importDefault(require("./post.services"));
const router = (0, express_1.Router)();
router.use((0, authentication_middleware_1.authentication)());
//post Api
//create post
router.post("/", (0, cloud_multer_1.cloudFileUpload)({ validation: cloud_multer_1.fileValidation.image, maxSizeMB: 5, }).array("attachments", 20), (0, validation_middleware_1.validation)(validators.createPostSchema), post_services_1.default.createPost);
router.patch("/:postId/like", (0, validation_middleware_1.validation)(validators.postIdParamsSchema), post_services_1.default.toggleLikePost);
router.patch("/:postId/update", (0, validation_middleware_1.validation)(validators.updatePostSchema), post_services_1.default.updatePost);
router.delete("/:postId/delete", (0, validation_middleware_1.validation)(validators.postIdParamsSchema), post_services_1.default.deletePost);
router.get("/:postId", (0, validation_middleware_1.validation)(validators.postIdParamsSchema), post_services_1.default.getSpecificPost);
//comment api or merge params for search
//comments ---> create comment postId
router.post("/:postId/comment", (0, validation_middleware_1.validation)(validators.createCommentSchema), post_services_1.default.createComments);
router.patch("/comment/:commentId", (0, validation_middleware_1.validation)(validators.updateCommentSchema), post_services_1.default.updateComment);
router.delete("/comment/:commentId", (0, validation_middleware_1.validation)(validators.commentIdParamsSchema), post_services_1.default.deleteComment);
exports.default = router;
