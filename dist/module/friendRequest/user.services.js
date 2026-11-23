"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../../utils/Response/error.response");
const user_model_1 = require("../../Database/models/user.model");
const FriendRequest_model_1 = require("../../Database/models/FriendRequest.model");
class userService {
    constructor() { }
    sendFriendRequest = async (req, res) => {
        const { userId } = req.params;
        const senderId = req.user?._id;
        if (userId === senderId.toString())
            throw new error_response_1.BadRequestException("yuo cannot add youself");
        const target = await user_model_1.UserModel.findById(userId);
        if (!target)
            throw new error_response_1.NotFoundException("user not found");
        if (target.blockedusers?.some((id) => id.equals(senderId)) || req.user?.blockedusers?.some((id) => id.equals(target._id)))
            throw new error_response_1.ForbiddenException("cannot send request to this user");
        if (target.friends?.some((id) => id.equals(senderId)))
            throw new error_response_1.ConflictException("yuo are already friends");
        const existing = await FriendRequest_model_1.FriendRequestModel.findOne({ $or: [{ sendBy: senderId, sendTo: userId }, { sendBy: userId, sendTo: senderId }], });
        if (existing)
            throw new error_response_1.ConflictException("Friend request already exists");
        const friendRequest = await FriendRequest_model_1.FriendRequestModel.create({ sendBy: senderId, sendTo: userId });
        return res.status(201).json({ message: "friend request sent", data: { friendRequest } });
    };
    listFriendRequest = async (req, res) => {
        const friendRequest = await FriendRequest_model_1.FriendRequestModel.find({ sendTo: req.user?._id }).populate("sendBy", "firstName lastName email -_id").lean();
        return res.status(200).json({ message: "Done", data: { friendRequest } });
    };
    acceptFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const friendRequest = await FriendRequest_model_1.FriendRequestModel.findOne({ _id: requestId, sendTo: req.user._id, });
        if (!friendRequest)
            throw new error_response_1.NotFoundException("friend request not found");
        //update parallel in two person
        await Promise.all([
            user_model_1.UserModel.updateOne({ _id: friendRequest.sendBy }, { $addToSet: { friends: friendRequest.sendTo } }),
            user_model_1.UserModel.updateOne({ _id: friendRequest.sendTo }, { $addToSet: { friends: friendRequest.sendBy } }),
        ]);
        await FriendRequest_model_1.FriendRequestModel.deleteOne({ _id: requestId });
        return res.status(200).json({ message: "friend request accpted" });
    };
    rejectFriendRequest = async (req, res) => {
        const { requestId } = req.params;
        const friendRequest = await FriendRequest_model_1.FriendRequestModel.findOneAndDelete({ _id: requestId, $or: [{ sendTo: req.user._id }, { sendBy: req.user._id }] });
        if (!friendRequest)
            throw new error_response_1.NotFoundException("friend request not found");
        return res.status(200).json({ message: "friend request removed" });
    };
    removeFriend = async (req, res) => {
        const { userId } = req.params;
        const myId = req.user._id;
        await Promise.all([
            user_model_1.UserModel.updateOne({ _id: myId }, { $pull: { friends: userId } }),
            user_model_1.UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
        ]);
        return res.status(200).json({ message: "friend removed successfully" });
    };
    blockUser = async (req, res) => {
        const { userId } = req.params;
        const myId = req.user._id;
        if (userId === myId.toString())
            throw new error_response_1.BadRequestException("you cannot block yourself");
        const target = await user_model_1.UserModel.findById(userId);
        if (!target)
            throw new error_response_1.NotFoundException("user not found");
        //push blockeduser ---$pull friends
        await Promise.all([
            user_model_1.UserModel.updateOne({ _id: myId }, { $addToSet: { blockedusers: userId }, $pull: { friends: userId } }),
            user_model_1.UserModel.updateOne({ _id: userId }, { $pull: { friends: myId } }),
            FriendRequest_model_1.FriendRequestModel.deleteMany({
                $or: [
                    { sendBy: myId, sendTo: userId },
                    { sendBy: userId, sendTo: myId }
                ],
            }),
        ]);
        return res.status(200).json({ message: "user blocked successfully" });
    };
    unblockUser = async (req, res) => {
        const { userId } = req.params;
        const updated = await user_model_1.UserModel.updateOne({ _id: req.user._id }, { $pull: { blockedusers: userId } });
        if (!updated)
            throw new error_response_1.BadRequestException("user not found or invalid unblocked user");
        return res.status(200).json({ message: "user unblocked successfully" });
    };
}
exports.default = new userService();
//DTO Data tranfer object
//Toggle Like --> Like -->Reacts
//friends[]-->usermodel
//Blockeduser []-->usermodel
