import { NextFunction, Request, Response } from "express";
import { RoleEnum, TokenTypeEnum } from "../utils/enums/user.enum";
import { decodeToken } from "../utils/secuirty/token";
import { ForbiddenException } from "../utils/Response/error.response";

/**
 * Verifies the Bearer token and attaches the user to the request.
 * Use TokenTypeEnum.REFRESH on the refresh-token endpoint.
 */
export const authentication = (
  tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { user, decoded } = await decodeToken({
      authorization: req.headers.authorization,
      tokenType,
    });

    req.user = user;
    req.decoded = decoded;
    next();
  };
};

/**
 * Role guard - must run after `authentication`.
 * Example: router.get("/admin", authentication(), authorization([RoleEnum.ADMIN]))
 */
export const authorization = (allowedRoles: RoleEnum[] = []) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ForbiddenException("You are not authorized to access this resource");
    }
    next();
  };
};