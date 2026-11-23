import { Request, Response } from "express"
import { IRequestIdParamsDTO, IUserIdParamsDTO } from "./user.dto"
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from "../../utils/Response/error.response"
import { UserModel } from "../../Database/models/user.model"
import { FriendRequestModel } from "../../Database/models/FriendRequest.model"
import { Types } from "mongoose"



class userService{
    constructor(){}
      sendFriendRequest=async(req:Request,res:Response):Promise<Response>=>{
       const{userId}:IUserIdParamsDTO=req.params as {userId:string}
       const senderId=req.user?._id
       if(userId===senderId.toString())throw new BadRequestException("yuo cannot add youself")
        const target=await UserModel.findById(userId)
      if(!target)throw new NotFoundException("user not found")
      if(target.blockedusers?.some((id)=>id.equals(senderId))||req.user?.blockedusers?.some((id:Types.ObjectId)=>id.equals(target._id))) throw new ForbiddenException("cannot send request to this user")
      if(target.friends?.some((id)=>id.equals(senderId)))throw new ConflictException("yuo are already friends")
      const existing=await FriendRequestModel.findOne({$or:[{sendBy:senderId,sendTo:userId},{sendBy:userId,sendTo:senderId}],})
      if(existing)throw new ConflictException("Friend request already exists")
      const friendRequest=await FriendRequestModel.create({sendBy:senderId,sendTo:userId})


      return res.status(201).json({message:"friend request sent",data:{friendRequest}})

      
      }
      listFriendRequest=async(req:Request,res:Response):Promise<Response>=>{
        const friendRequest=await FriendRequestModel.find({sendTo:req.user?._id}).populate("sendBy","firstName lastName email -_id").lean()
        return res.status(200).json({message:"Done",data:{friendRequest}})
      }
      acceptFriendRequest=async(req:Request,res:Response):Promise<Response>=>{
      const{requestId}:IRequestIdParamsDTO=req.params as {requestId:string}
      const friendRequest=await FriendRequestModel.findOne({_id:requestId,sendTo:req.user!._id,})
      if(!friendRequest)throw new NotFoundException("friend request not found")
      //update parallel in two person
      await Promise.all([
        UserModel.updateOne({_id:friendRequest.sendBy},{$addToSet:{friends:friendRequest.sendTo}}),
        UserModel.updateOne({_id:friendRequest.sendTo},{$addToSet:{friends:friendRequest.sendBy}}),
        ])
      
      await FriendRequestModel.deleteOne({_id:requestId})

      return res.status(200).json({message:"friend request accpted"})
      }
      rejectFriendRequest=async(req:Request,res:Response):Promise<Response>=>{
      const{requestId}:IRequestIdParamsDTO=req.params as {requestId:string}
      const friendRequest=await FriendRequestModel.findOneAndDelete({_id:requestId,$or:[{sendTo:req.user!._id},{sendBy:req.user!._id}]})
      if(!friendRequest)throw new NotFoundException("friend request not found")
      return res.status(200).json({message:"friend request removed"})
      }
      removeFriend=async(req:Request,res:Response):Promise<Response>=>{
      const{userId}:IUserIdParamsDTO=req.params as {userId:string}
      const myId=req.user!._id 
      await Promise.all([
        UserModel.updateOne({_id:myId},{$pull:{friends:userId}}),
        UserModel.updateOne({_id:userId},{$pull:{friends:myId}}),
      ])
      return res.status(200).json({message:"friend removed successfully"})
      }
      blockUser=async(req:Request,res:Response):Promise<Response>=>{
        const{userId}:IUserIdParamsDTO=req.params as {userId:string}
        const myId=req.user!._id
        if(userId===myId.toString())throw new BadRequestException("you cannot block yourself")
          const target=await UserModel.findById(userId)
        if(!target) throw new NotFoundException("user not found")
          //push blockeduser ---$pull friends
        await Promise.all([
          UserModel.updateOne(
            {_id:myId},
            {$addToSet:{blockedusers:userId},$pull:{friends:userId}},
          ),
           UserModel.updateOne(
            {_id:userId},
            {$pull:{friends:myId}},
          ),
           FriendRequestModel.deleteMany({
          $or:[
            {sendBy:myId,sendTo:userId},
            {sendBy:userId,sendTo:myId}
          ],
        }),
        ])
       
      return res.status(200).json({message:"user blocked successfully"})
      }
      unblockUser=async(req:Request,res:Response):Promise<Response>=>{
        const{userId}:IUserIdParamsDTO=req.params as {userId:string}
        const updated=await UserModel.updateOne({_id:req.user!._id},{$pull:{blockedusers:userId}})
       if(!updated)throw new BadRequestException("user not found or invalid unblocked user")

      return res.status(200).json({message:"user unblocked successfully"})
      }
}


export default new userService()


//DTO Data tranfer object
//Toggle Like --> Like -->Reacts
//friends[]-->usermodel
//Blockeduser []-->usermodel