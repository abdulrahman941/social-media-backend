import {z} from "zod"




export const userIdParamsSchema={
    params:z.strictObject({
       userId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    })
    
}


export const requestIdParamsSchema={
    params:z.strictObject({
       requestId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    })
    
}
