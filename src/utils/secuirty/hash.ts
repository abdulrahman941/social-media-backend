import { compare, hash } from "bcrypt";

const salt=Number(process.env.salt) as number



export const generateHash=async(plaintext:string,saltRounds:number=Number(salt)):Promise<string>=>{
return await hash(plaintext,saltRounds)
}

export const compareHash=async(plaintext:string,hashValue:string):Promise<boolean>=>{
return await compare(plaintext,hashValue)
}