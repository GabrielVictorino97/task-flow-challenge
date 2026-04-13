import bcrypt from "bcryptjs";
import { HashServicePort } from "../../core/ports/HashServicePort";
import { env } from "./env";

export class BcryptHashService implements HashServicePort {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, env.BCRYPT_SALT_ROUNDS);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
