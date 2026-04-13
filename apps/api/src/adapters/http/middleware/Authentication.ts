import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { UnauthorizedError } from "../../../core/errors/UnauthorizedError";
import { JwtTokenService } from "../../helpers/jwt";

const tokenService = new JwtTokenService();

export function authenticationMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing bearer token");
    }

    const token = authorization.slice("Bearer ".length).trim();
    const payload = tokenService.verify(token);

    req.auth = {
      userId: payload.sub,
      email: payload.email
    };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return next(new UnauthorizedError("Invalid or expired token"));
    }
    next(error);
  }
}
