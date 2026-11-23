import type { ZodType} from "zod"
import {Request,Response,NextFunction} from "express"
import { BadRequestException } from "../utils/Response/error.response"

type keyReqType=keyof Request
type schemaType=Partial<Record<keyReqType,ZodType>>
export const validation=(Schema:schemaType)=>{
  return (req:Request,res:Response,next:NextFunction)=>{
const validationErrors:Array<{key:keyReqType,issues:Array<{message:string,path:PropertyKey[]}>}>=[]
for(const key of Object.keys(Schema) as keyReqType[]){
    const keySchema=Schema[key]
    if(!keySchema)continue
    const validationResults=keySchema.safeParse(req[key])
    if(!validationResults.success){
    validationErrors.push({key,issues:validationResults.error.issues.map((issue)=>({
        message:issue.message,
        path:issue.path,
    })),
    })
}
    continue
    }
    if(validationErrors.length>0){
        throw new BadRequestException("validation Error",{cause:validationErrors})
}
    next()

  }
}