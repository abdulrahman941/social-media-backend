import {z} from "zod"

//post
export const createPostSchema={
    body:z.strictObject({
       content:z.string().min(2).max(50000).optional(),
    })
}

//post
export const postIdParamsSchema={
    params:z.strictObject({
       postId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    })
    
}

//post
export const updatePostSchema={
    params:z.strictObject({
       postId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    }),
     body:z.strictObject({
       content:z.string().min(2).max(50000),
    })
}
//comment--->create comment
export const createCommentSchema={
    params:z.strictObject({
       postId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    }),
     body:z.strictObject({
       content:z.string().min(2).max(50000),
     parentId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}).optional(),
    })
}
//update comment
export const updateCommentSchema={
    params:z.strictObject({
       commentId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    }),
     body:z.strictObject({
       content:z.string().min(2).max(50000),
    })
}
//delete comment
export const commentIdParamsSchema={
    params:z.strictObject({
       commentId:z.string().regex(/^[0-91-fA-F]{24}$/,{error:"Invalid Id format"}),
    })
}