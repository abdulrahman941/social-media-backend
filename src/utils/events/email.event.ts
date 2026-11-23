import EventEmitter from "node:events";
import { template } from "../Email/verify.email.template";
import { sendEmail } from "../Email/send.email";
import Mail from "nodemailer/lib/mailer";



export const EmailEvents=new EventEmitter()


interface IEmail extends Mail.Options{
    otp:string
    username:string
    subject:string
    html:string
}


EmailEvents.on("confirmEmail",async(data:IEmail)=>{
    try {
        data.subject="confirm your email"
        data.html=template(data.otp,data.username,data.subject)
        console.log(data.otp);
                
        await sendEmail(data)
    } catch (error) {
        console.error("failed to send email",error);
        
    }
})
