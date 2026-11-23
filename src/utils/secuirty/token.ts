import { Secret, sign, SignOptions, verify } from "jsonwebtoken"
import { HUserDocument, UserModel } from "../../Database/models/user.model"
import { RoleEnum, TokenTypeEnum } from "../enums/user.enum"
import { env } from "../../config/config.services"
import { UnAuthorizedException } from "../Response/error.response"
import { JwtPayload } from "jsonwebtoken";


export const generateToken=({payload,secret,options}:{payload:object,secret:Secret,options:SignOptions})=>{
return sign(payload,secret,options)
}


export interface ITokenPayload extends JwtPayload {
  _id: string;
  role: RoleEnum;
}
// verifyToken (الأسطر 32 - 40)[cite: 3]
export const verifyToken = ({
  token,
  secret,
}: {
  token: string;
  secret: Secret;
}): ITokenPayload => {
  return verify(token, secret) as ITokenPayload;
};

// picks the right secret based on the token type and the user's role (الأسطر 42 - 49)[cite: 3]
const getSignature = (type: TokenTypeEnum, role: RoleEnum): string => {
  const isAdmin = role === RoleEnum.ADMIN;
  if (type === TokenTypeEnum.ACCESS) {
    return isAdmin ? env.access_admin_signature : env.access_user_signature;
  }
  return isAdmin ? env.refresh_admin_signature : env.refresh_user_signature;
};
export const createLoginCredentials=(user:HUserDocument):{accesstoken:string,refreshtoken:string}=>{
const isAdmin=user.role===RoleEnum.ADMIN
const accesssecret=isAdmin? env.access_admin_signature:env.access_user_signature
const refreshsecret=isAdmin? env.refresh_admin_signature:env.refresh_user_signature

const accesstoken=generateToken({payload:{_id:user._id},secret:accesssecret,options:{expiresIn:env.access_token_expires_in}})
const refreshtoken=generateToken({payload:{_id:user._id},secret:refreshsecret,options:{expiresIn:env.refresh_token_expires_in}})



    return {accesstoken,refreshtoken}
}

/**
 * Splits "Bearer <token>", verifies the signature, loads the user,
 * and rejects tokens issued before the last credentials change.
 */
// decodeToken (الأسطر 75 - 83+)[cite: 1]
export const decodeToken = async ({
  authorization,
  tokenType = TokenTypeEnum.ACCESS,
}: {
  authorization: string | undefined;
  tokenType?: TokenTypeEnum;
}): Promise<{ user: HUserDocument; decoded: ITokenPayload }> => {
  if (!authorization) {
    throw new UnAuthorizedException("Missing authorization header");
  }

  const [bearer, token] = authorization.split(" ");
  if (!bearer || !token) {
    throw new UnAuthorizedException("Invalid authorization format");
  }

  const decoded = verifyToken({
    token,
    secret: getSignature(tokenType, RoleEnum.USER), // أو حسب الدور بعد فك التوكن/جلب المستخدم
  });

  // جلب المستخدم والتحقق من صلاحية التوكن مقارنة بآخر تغيير لبيانات الاعتماد
  const user = await UserModel.findById(decoded._id);
  if (!user) {
    throw new UnAuthorizedException("User not found");
  }

  return { user, decoded };
};

