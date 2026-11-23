import { IConfirmEmailDTO, ILoginDTO, ISignupDTO } from "./auth.dto"
import { UserModel } from "../../Database/models/user.model"
import { BadRequestException, ConflictException, NotFoundException } from "../../utils/Response/error.response"
import { generateOTP } from "../../utils/generateOTP"
import { compareHash, generateHash } from "../../utils/secuirty/hash"
import { EmailEvents } from "../../utils/events/email.event"
import { Request, Response } from "express"
import { createLoginCredentials } from "../../utils/secuirty/token"


class AuthService{
    constructor(){}
      signup=async(req:Request,res:Response):Promise<Response>=>{
        const{username,email,password}:ISignupDTO=req.body
        const checkUserExists=await UserModel.findOne({email}).select("email")
        if(checkUserExists) throw new ConflictException("user already exist")
        const otp=generateOTP()
        const [user]=await UserModel.create(
            [
            {
            username,
            email,
            password:await generateHash(password),
            confirmEmailOTP:await generateHash(otp)
        },
    ],
          {validateBeforeSave:true},
)
EmailEvents.emit("confirmEmail",{
    to:email,
    username,
    otp,
})
return res.status(201).json({message:"Done",user})
     }

      confirmEmail=async(req:Request,res:Response):Promise<Response>=>{
        const{email,otp}:IConfirmEmailDTO=req.body
        const user=await UserModel.findOne({email,confirmEmailOTP:{$exists:true},confirmedAt:{$exists:false}})
        if(!user ||!user.confirmEmailOTP) throw new NotFoundException("Invalid account")
        if(!await compareHash(otp,user.confirmEmailOTP)) throw new BadRequestException("Invalid OTP")
            await UserModel.updateOne({email},{confirmedAt:new Date(),$unset:{confirmEmailOTP:true},$inc:{_v:1}})
return res.status(200).json({message:"user confirmed successfully"})
     }
     Login=async(req:Request,res:Response):Promise<Response>=>{
        const{email,password}:ILoginDTO=req.body
        const user=await UserModel.findOne({email,confirmedAt:{$exists:true}})
        if(!user) throw new NotFoundException("Invalid account")
        if(!await compareHash(password,user.password)) throw new BadRequestException("Invalid password")
        const credentials=createLoginCredentials(user)
return res.status(200).json({message:"Done",credentials})
     }
}


export default new AuthService()


//DTO Data tranfer object