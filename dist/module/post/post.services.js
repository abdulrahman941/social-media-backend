"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../../utils/Response/error.response");
const post_model_1 = require("../../Database/models/post.model");
const comment_model_1 = require("../../Database/models/comment.model");
class postService {
    constructor() { }
    //post
    createPost = async (req, res) => {
        const { content } = req.body;
        const attachments = req.files;
        if (!content && !attachments?.length)
            throw new error_response_1.BadRequestException("post must have content or attachments");
        const post = await post_model_1.PostModel.create({
            ...(typeof content === "string" && content ? { content } : {}),
            ...(attachments?.length
                ? {
                    attachments: attachments.map((file) => `uploads/posts/${file.filename}`),
                }
                : {}),
            createdBy: req.user._id,
        });
        return res.status(201).json({ message: "post created successfully", data: { post } });
    };
    toggleLikePost = async (req, res) => {
        const { postId } = req.params;
        const userId = req.user._id;
        const post = await post_model_1.PostModel.findOne({ _id: postId, freezedAt: { $exists: false } });
        if (!post)
            throw new error_response_1.NotFoundException("post not found");
        const alreadyLike = post.likes?.some((id) => id.equals(userId));
        const updated = await post_model_1.PostModel.findByIdAndUpdate(postId, alreadyLike ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } }, { new: true });
        return res.status(200).json({ message: alreadyLike ? "post unlike" : "post liked", data: { updated } });
    };
    updatePost = async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const post = await post_model_1.PostModel.findOneAndUpdate({ _id: postId, createdBy: req.user._id }, { content, $inc: { _v: 1 } }, { new: true });
        if (!post)
            throw new error_response_1.ForbiddenException("post not found or you are not the author");
        return res.status(200).json({ message: "post updated successfully", data: { post } });
    };
    deletePost = async (req, res) => {
        const { postId } = req.params;
        const post = await post_model_1.PostModel.findOneAndDelete({ _id: postId, createdBy: req.user._id });
        if (!post)
            throw new error_response_1.ForbiddenException("post not found or you are not the author");
        //comment ---? remove related comments
        return res.status(200).json({ message: "post deleted successfully" });
    };
    getSpecificPost = async (req, res) => {
        const { postId } = req.params;
        const post = await post_model_1.PostModel.findOne({ _id: postId, freezedAt: { $exists: false }, }).populate("createdBy", "firstName lastName email -_id").lean();
        if (!post)
            throw new error_response_1.NotFoundException("post not found");
        //comments related with this post
        return res.status(200).json({ message: "Done", data: { post } });
    };
    //comments ---> create comments
    createComments = async (req, res) => {
        const { postId } = req.params;
        const { content, parentId } = req.body;
        const post = await post_model_1.PostModel.findOne({ _id: postId, freezedAt: { $exists: false }, });
        if (!post)
            throw new error_response_1.NotFoundException("post not found");
        if (parentId) {
            const parent = await comment_model_1.CommentModel.findOne({ _id: parentId, postId });
            if (!parent)
                throw new error_response_1.NotFoundException("parent comment not exists");
        }
        const comment = await comment_model_1.CommentModel.create({ postId, ...(parentId && { parentId }), content, createdBy: req.user._id });
        return res.status(201).json({ message: "comments created successfully", data: { comment } });
    };
    updateComment = async (req, res) => {
        const { commentId } = req.params;
        const { content } = req.body;
        const comment = await comment_model_1.CommentModel.findOneAndUpdate({ _id: commentId, createdBy: req.user._id }, { content }, { new: true });
        if (!comment)
            throw new error_response_1.ForbiddenException("comment not found or you are not the author");
        return res.status(200).json({ message: "comments updated successfully", data: { comment } });
    };
    deleteComment = async (req, res) => {
        const { commentId } = req.params;
        const userId = req.user._id;
        const comment = await comment_model_1.CommentModel.findById(commentId);
        if (!comment)
            throw new error_response_1.NotFoundException("comment not found");
        const post = await post_model_1.PostModel.findById(comment.postId);
        const isCommentAuthor = comment.createdBy.equals(userId);
        const isPostOwner = post?.createdBy.equals(userId);
        if (!isCommentAuthor && !isPostOwner)
            throw new error_response_1.ForbiddenException("not authorized to delete the comment");
        await Promise.all([
            comment_model_1.CommentModel.deleteOne({ _id: commentId }),
            comment_model_1.CommentModel.deleteMany({ parentId: commentId }),
        ]);
        return res.status(200).json({ message: "comments deleted successfully" });
    };
}
exports.default = new postService();
//DTO Data tranfer object
//Toggle Like --> Like -->Reacts
//friends[]-->usermodel
//Blockeduser []-->usermodel
