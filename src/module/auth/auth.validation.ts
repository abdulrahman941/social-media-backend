import {z} from "zod"


export const loginSchema={
    body:z.strictObject({
        email:z.email({error:"invalid email address"}),
        password:z.string().regex(/^\d{6}$/) ,
    })
}


export const confirmEmailSchema={
    body:z.strictObject({
        email:z.email({error:"invalid email address"}),
        otp:z.string({error:"password must be required"}).min(6,{error:"password must be at least 6 character long"}).max(64,{error:"password must be at most 64 character long"}),
    })
}



export const signupSchema={
body:loginSchema.body.extend({
    username:z.string({error:"username must be required"}).min(2,{error:"username must be at least 2 character long"}).max(25,{error:"username must be at most 25 character long"}),
    confirmpassword:z.string({error:"password must be required"}).min(6,{error:"password must be at least 6 character long"}).max(64,{error:"password must be at most 64 character long"}),
    // otp:z.string().regex(/^\d{6}$/),
    // role:z.enum(["USER","ADMIN"]).default("USER"),
    // gender:z.enum(["MALE","FEMALE"]).default("MALE"),
}).superRefine((data,ctx)=>{
    if(data.confirmpassword!==data.password){
        ctx.addIssue({
            code:"custom",
            path:["confirmpassword"],
            message:"password misMatch",

        })
    }
})
}


// export const signupschema={
// body:z.strictObject({
//     username:z.string({error:"username must be required"}).min(2,{error:"username must be at least 2 character long"}).max(25,{error:"username must be at most 25 character long"}),
//     email:z.email({error:"invalid email address"}),
//     password:z.string({error:"password must be required"}).min(8,{error:"password must be at least 8 character long"}).max(64,{error:"password must be at most 64 character long"}),
//     confirmpassword:z.string({error:"password must be required"}).min(8,{error:"password must be at least 8 character long"}).max(64,{error:"password must be at most 64 character long"}),
//     otp:z.string().regex(/^\d{6}$/),
//     role:z.enum(["USER","ADMIN"]).default("USER"),
//     gender:z.enum(["MALE","FEMALE"]).default("MALE"),
// }).superRefine((data,ctx)=>{
//     if(data.password!==data.confirmpassword){
//         ctx.addIssue({
//             code:"custom",
//             path:["confirmpassword"],
//             message:"password misMatch",

//         })
//     }
// })
// }