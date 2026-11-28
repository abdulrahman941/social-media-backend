import { Request, Response } from "express"
import { ICommentIdParamsDTO, ICreateCommentDTO, ICreatePostDTO, IPostIdParamsDTO, IUpdateCommentDTO, IUpdatePostDTO } from "./post.dto"
import { BadRequestException, ForbiddenException, NotFoundException } from "../../utils/Response/error.response"
import { PostModel } from "../../Database/models/post.model"
import { CommentModel } from "../../Database/models/comment.model"
import { uploadBufferToCloudinary } from "../../utils/multer/cloud.multer"


class postService{
    constructor(){}
    // داخل class postService:
createPost = async (req: Request, res: Response): Promise<Response> => {
  const { content }: ICreatePostDTO = req.body;
  const files = req.files as Express.Multer.File[] | undefined;

  if (!content && !files?.length) {
    throw new BadRequestException("post must have content or attachments");
  }

  let uploadedAttachments: string[] = [];
  if (files?.length) {
    const uploadResults = await Promise.all(
      files.map((file) => uploadBufferToCloudinary(file.buffer, "posts"))
    );
    uploadedAttachments = uploadResults.map((result) => result.secure_url);
  }

  const post = await PostModel.create({
    ...(typeof content === "string" && content ? { content } : {}),
    ...(uploadedAttachments.length ? { attachments: uploadedAttachments } : {}),
    createdBy: req.user!._id,
  });

  return res.status(201).json({ message: "post created successfully", data: { post } });
};
    //post
//       createPost=async(req:Request,res:Response):Promise<Response>=>{
//       const {content}:ICreatePostDTO=req.body
//       const attachments=req.files as Express.Multer.File[] | undefined
//       if(!content &&! attachments?.length) throw new BadRequestException("post must have content or attachments")
//        const post = await PostModel.create({
//   ...(typeof content === "string" && content ? { content } : {}),
//   ...(attachments?.length
//     ? {
//         attachments: attachments.map(
//           (file) => `uploads/posts/${file.filename}`
//         ),
//       }
//     : {}),
//   createdBy: req.user!._id,
// });
//       return res.status(201).json({message:"post created successfully",data:{post}})
//       }
      toggleLikePost=async(req:Request,res:Response):Promise<Response>=>{
        const{postId}:IPostIdParamsDTO=req.params as {postId:string}
        const userId=req.user!._id
        const post=await PostModel.findOne({_id:postId,freezedAt:{$exists:false}})
        if(!post)throw new NotFoundException("post not found") 
          const alreadyLike=post .likes?.some((id)=>id.equals(userId))
        const updated=await PostModel.findByIdAndUpdate(postId,alreadyLike?{$pull:{likes:userId}}:{$addToSet:{likes:userId}},{new:true},)


        return res.status(200).json({message:alreadyLike?"post unlike":"post liked",data:{updated}})
      }
      updatePost=async(req:Request,res:Response):Promise<Response>=>{
      const{postId}:IPostIdParamsDTO=req.params as {postId:string}
      const {content}:IUpdatePostDTO=req.body
      const post=await PostModel.findOneAndUpdate({_id:postId,createdBy:req.user!._id},{content,$inc:{_v:1}},{new:true})
      if(!post) throw new ForbiddenException("post not found or you are not the author")


        return res.status(200).json({message:"post updated successfully",data:{post}})

      }

      deletePost=async(req:Request,res:Response):Promise<Response>=>{
       const{postId}:IPostIdParamsDTO=req.params as {postId:string}
      const post=await PostModel.findOneAndDelete({_id:postId,createdBy:req.user!._id})
      if(!post) throw new ForbiddenException("post not found or you are not the author")

      //comment ---? remove related comments
        return res.status(200).json({message:"post deleted successfully"})
      }
      getSpecificPost=async(req:Request,res:Response):Promise<Response>=>{
      const{postId}:IPostIdParamsDTO=req.params as {postId:string}
      const post=await PostModel.findOne({_id:postId,freezedAt:{$exists:false},}).populate("createdBy","firstName lastName email -_id").lean()
      if(!post) throw new NotFoundException("post not found")
      //comments related with this post

      return res.status(200).json({message:"Done",data:{post}})
      }
      //comments ---> create comments
      createComments=async(req:Request,res:Response):Promise<Response>=>{
        const{postId}:IPostIdParamsDTO=req.params as {postId:string}
        const {content,parentId}:ICreateCommentDTO=req.body
        const post=await PostModel.findOne({_id:postId,freezedAt:{$exists:false},})
        if(!post) throw new NotFoundException("post not found")
        if(parentId){
          const parent=await CommentModel.findOne({_id:parentId,postId})
          if(!parent)throw new NotFoundException("parent comment not exists")
        }
        const comment=await CommentModel.create({postId,...(parentId&&{parentId}),content,createdBy:req.user!._id})

        return res.status(201).json({message:"comments created successfully",data:{comment}})
      }
      updateComment=async(req:Request,res:Response):Promise<Response>=>{
        const{commentId}:ICommentIdParamsDTO=req.params as {commentId:string}
        const{content}:IUpdateCommentDTO=req.body 
        const comment=await CommentModel.findOneAndUpdate({_id:commentId,createdBy:req.user!._id},{content},{new:true})
        if(!comment)throw new ForbiddenException("comment not found or you are not the author")
      return res.status(200).json({message:"comments updated successfully",data:{comment}})
      }
      deleteComment=async(req:Request,res:Response):Promise<Response>=>{
        const{commentId}:ICommentIdParamsDTO=req.params as {commentId:string}
        const userId=req.user!._id
        const comment=await CommentModel.findById(commentId)
        if(!comment)throw new NotFoundException("comment not found")
          const post=await PostModel.findById(comment.postId)
        const isCommentAuthor=comment.createdBy.equals(userId)
        const isPostOwner=post?.createdBy.equals(userId)
        if(!isCommentAuthor&&!isPostOwner)throw new ForbiddenException("not authorized to delete the comment")
          await Promise.all([
        CommentModel.deleteOne({_id:commentId}),
        CommentModel.deleteMany({parentId:commentId}),

        ])
      return res.status(200).json({message:"comments deleted successfully"})
      }


}


export default new postService()


//DTO Data tranfer object
//Toggle Like --> Like -->Reacts
//friends[]-->usermodel
//Blockeduser []-->usermodel