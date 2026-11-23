import { compare, hash } from "bcrypt";
import { env } from "../../config/config.services";

export const generateHash=async(plaintext:string,saltRounds:number=Number(env.salt)):Promise<string>=>{
return await hash(plaintext,saltRounds)
}

export const compareHash=async(plaintext:string,hashValue:string):Promise<boolean>=>{
return await compare(plaintext,hashValue)
}