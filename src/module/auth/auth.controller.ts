import { validation } from "../../middleware/validation.middleware";
import * as validators from "./auth.validation"
import authServices from "./auth.services";
import {Router} from "express"

const router=Router()

router.post("/signup",validation(validators.signupSchema),authServices.signup)
router.patch("/confirm-email",validation(validators.confirmEmailSchema),authServices.confirmEmail)
router.post("/login",validation(validators.loginSchema),authServices.Login)




export default router