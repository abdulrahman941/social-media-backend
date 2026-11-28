import {Router} from "express"
import { authentication } from "../../middleware/authentication.middleware"
import { cloudFileUpload, fileValidation} from "../../utils/multer/cloud.multer"
import { validation } from "../../middleware/validation.middleware"
import * as validators from "./post.validation"
import postServices from "./post.services"


const router=Router()

router.use(authentication())
//post Api
//create post
router.post("/",cloudFileUpload({validation:fileValidation.image,maxSizeMB: 5,}).array("attachments",20),validation(validators.createPostSchema),postServices.createPost)
router.patch("/:postId/like",validation(validators.postIdParamsSchema),postServices.toggleLikePost)
router.patch("/:postId/update",validation(validators.updatePostSchema),postServices.updatePost)
router.delete("/:postId/delete",validation(validators.postIdParamsSchema),postServices.deletePost)
router.get("/:postId",validation(validators.postIdParamsSchema),postServices.getSpecificPost)
//comment api or merge params for search
//comments ---> create comment postId
router.post("/:postId/comment",validation(validators.createCommentSchema),postServices.createComments)
router.patch("/comment/:commentId",validation(validators.updateCommentSchema),postServices.updateComment)
router.delete("/comment/:commentId",validation(validators.commentIdParamsSchema),postServices.deleteComment)

export default router