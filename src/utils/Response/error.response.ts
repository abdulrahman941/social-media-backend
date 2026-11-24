import { NextFunction, Request, Response } from "express"



const mood=process.env.mood

export interface IError extends Error{
    statusCode?:number

}


export class ApplicationException extends Error{


    constructor(message:string,public statusCode:number=400,options?:ErrorOptions){
     super(message,options)
     this.name=this.constructor.name

    }
}

export class NotFoundException extends ApplicationException{
    constructor(message:string,options?:ErrorOptions){
    super(message,404,options)
    }
}

export class BadRequestException extends ApplicationException{
    constructor(message:string,options?:ErrorOptions){
    super(message,400,options)
    }
}

export class UnAuthorizedException extends ApplicationException{
    constructor(message:string,options?:ErrorOptions){
    super(message,401,options)
    }
}

export class ForbiddenException extends ApplicationException{
    constructor(message:string,options?:ErrorOptions){
    super(message,403,options)
    }
}

export class ConflictException extends ApplicationException{
    constructor(message:string,options?:ErrorOptions){
    super(message,409,options)
    }
}

export class tooManyRequestException extends ApplicationException{
    constructor(message:string,options?:ErrorOptions){
    super(message,429,options)
    }
}



export const globalErrorHandlar=(err:IError,req:Request,res:Response,next:NextFunction):void=>{
const statusCode=err.statusCode ||500
const isDev=mood==="development" ||"production"

if(statusCode>=500){
    console.error(err);
    
}
 res.status(statusCode).json({message:err.message || "something went wrong", ...(isDev &&{stack:err.stack}),
cause:err.cause,


})
}