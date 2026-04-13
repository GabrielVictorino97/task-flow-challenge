import { AuthController } from "../../adapters/http/controllers/AuthController";
import { makeLoginUser } from "./makeLoginUser";
import { makeRegisterUser } from "./makeRegisterUser";

export function makeAuthController(): AuthController {
  return new AuthController(makeRegisterUser(), makeLoginUser());
}
