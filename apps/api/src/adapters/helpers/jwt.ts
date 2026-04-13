import jwt from "jsonwebtoken";
import { TokenPayload, TokenServicePort } from "../../core/ports/TokenServicePort";
import { env } from "./env";

export class JwtTokenService implements TokenServicePort {
  sign(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;

    return {
      sub: String(decoded.sub),
      email: String(decoded.email)
    };
  }
}
