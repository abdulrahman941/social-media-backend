import crypto from "node:crypto"
import { env } from "../../config/config.services"


const encryption_secret_key=env.encryption_secret_key

const IV_LENGTH=16
//key must be exactly 3 bytes for aes-256-cbc (validated by the config services)
const ENCRYPTION_KEY:Buffer=Buffer.from(encryption_secret_key,"utf-8")

export const encrypt = (text:string):string=>{
    const iv:Buffer=crypto.randomBytes(IV_LENGTH)
    const cipher=crypto.createCipheriv("aes-256-cbc",ENCRYPTION_KEY,iv)
    let encryptedData:string=cipher.update(text,"utf8","hex")
    encryptedData+=cipher.final("hex")
    return`${iv.toString("hex")}:${encryptedData}`
}
export const decrypt=(encryptedData:string):string=>{
    const[ivHex,encryptedText]=encryptedData.split(":")
    if(!ivHex || !encryptedText){
        throw new Error("invalid encrypted Data format")
    }
    const iv:Buffer=Buffer.from(ivHex,"hex")
    const decipher=crypto.createDecipheriv("aes-256-cbc",ENCRYPTION_KEY,iv)
    let decryptedData:string=decipher.update(encryptedText,"utf8","hex")
    decryptedData+=decipher.final("utf8")
    return decryptedData


}