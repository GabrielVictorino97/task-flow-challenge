import { BcryptHashService } from "../../adapters/helpers/encrypt";
import { JwtTokenService } from "../../adapters/helpers/jwt";
import { MongooseUserRepository } from "../../adapters/secondaryAdapter/MongooseUserRepository";
import { LoginUser } from "../../core/use-cases/auth/LoginUser";

export function makeLoginUser(): LoginUser {
  const userRepository = new MongooseUserRepository();
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();

  return new LoginUser(userRepository, hashService, tokenService);
}
