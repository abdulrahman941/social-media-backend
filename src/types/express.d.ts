import { IUser } from "../Database/models/user.model";
import { HUserDocument } from "../DB/models/User.model";
import { ITokenPayload } from "../utils/security/token";

// makes req.user / req.decoded available everywhere after authentication
declare global {
  namespace Express {
    interface Request {
      user?: HUserDocument<IUser>;
      decoded?: ITokenPayload;
    }
  }
}

export {};