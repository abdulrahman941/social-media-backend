import { compare, hash } from "bcrypt";
import { env } from "../../config/config.services";

const salt=Number(env.salt)



export const generateHash=async(plaintext:string,saltRounds:number=Number(salt)):Promise<string>=>{
return await hash(plaintext,saltRounds)
}

export const compareHash=async(plaintext:string,hashValue:string):Promise<boolean>=>{
return await compare(plaintext,hashValue)
}