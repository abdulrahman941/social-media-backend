import {resolve} from "node:path"
import {config} from "dotenv"


config({path:resolve("./config/dev.env")})


export const env={
app_url:process.env.app_url as string,

    //application
port:Number(process.env.port)||3000,
mood:process.env.mood||"development",
application_name:process.env.application_name||"development",

//database
mongo_uri:process.env.mongo_uri as string,


//email
email_username:process.env.email_username as string,
email_password:process.env.email_password as string,
email_host:process.env.email_host as string,
email_port:process.env.email_port ||587,


//jwt
access_user_signature:process.env.access_user_signature as string,
access_admin_signature:process.env.access_admin_signature as string,
refresh_user_signature:process.env.refresh_user_signature as string,
refresh_admin_signature:process.env.refresh_admin_signature as string,
access_token_expires_in:Number(process.env.access_token_expires_in) ||3600 ,
refresh_token_expires_in:Number(process.env.refresh_token_expires_in)||604800,
secret:process.env.secret as string,
//hashing
salt:process.env.salt||12,

// encryption (aes-256-cbc needs exectly 32 character)
encryption_secret_key:process.env.encryption_secret_key as string,

whitelist:process.env.whitelist as string
}

export type Env=typeof env