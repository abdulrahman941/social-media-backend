import {Router} from "express"
import { authentication } from "../../middleware/authentication.middleware"
import { validation } from "../../middleware/validation.middleware"
import * as validators from "./user.validation"
import userServices from "./user.services"


const router=Router()

router.use(authentication())
router.post("/friend-request/:userId",validation(validators.userIdParamsSchema),userServices.sendFriendRequest)
router.get("/friend-request",userServices.listFriendRequest)
router.patch("/friend-request/:requestId/accept",validation(validators.requestIdParamsSchema),userServices.acceptFriendRequest)
router.delete("/friend-request/:requestId/reject",validation(validators.requestIdParamsSchema),userServices.rejectFriendRequest)
router.delete("/friend/:userId",validation(validators.userIdParamsSchema),userServices.removeFriend)
router.patch("/block/:userId",validation(validators.userIdParamsSchema),userServices.blockUser)
router.patch("/unblock/:userId",validation(validators.userIdParamsSchema),userServices.unblockUser)

export default router