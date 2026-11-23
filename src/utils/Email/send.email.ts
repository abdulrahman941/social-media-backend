import { createTransport } from "nodemailer";
import { BadRequestException } from "../Response/error.response";
import { env } from "../../config/config.services";
import Mail from "nodemailer/lib/mailer";


export const sendEmail=async(data:Mail.Options):Promise<void>=>{
    if(!data.html &&!data.attachments?.length &&!data.text){
        throw new BadRequestException("Missing Email content")
    }
    const transporter=createTransport({
        service:"gmail",
        auth:{
            user:env.email_username,
            pass:env.email_password
        }
    })
    await transporter.sendMail({
        ...data,
        from:`"Route academy <${env.email_username}>`,

    })
}
