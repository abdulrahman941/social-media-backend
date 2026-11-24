import { createTransport } from "nodemailer";
import { BadRequestException } from "../Response/error.response";
import Mail from "nodemailer/lib/mailer";

const email_username=process.env.email_username as string
const email_password=process.env.email_password as string

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
