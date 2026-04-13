import { BcryptHashService } from "../../adapters/helpers/encrypt";
import { JwtTokenService } from "../../adapters/helpers/jwt";
import { MongooseUserRepository } from "../../adapters/secondaryAdapter/MongooseUserRepository";
import { RegisterUser } from "../../core/use-cases/auth/RegisterUser";

export function makeRegisterUser(): RegisterUser {
  const userRepository = new MongooseUserRepository();
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();

  return new RegisterUser(userRepository, hashService, tokenService);
}
