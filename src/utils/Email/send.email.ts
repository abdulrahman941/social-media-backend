import { createTransport } from "nodemailer";
import { BadRequestException } from "../Response/error.response";
import Mail from "nodemailer/lib/mailer";
import { env } from "../../config/config.services";

const email_username=env.email_username 
const email_password=env.email_password 

export const sendEmail=async(data:Mail.Options):Promise<void>=>{
    if(!data.html &&!data.attachments?.length &&!data.text){
        throw new BadRequestException("Missing Email content")
    }
    const transporter=createTransport({
        service:"gmail",
        auth:{
            user:email_username,
            pass:email_password
        }
    })
    await transporter.sendMail({
        ...data,
        from:`"Route academy <${email_username}>`,

    })
}
