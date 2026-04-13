import { RegisterDTO } from "../../dto/auth/RegisterDTO";
import { ConflictError } from "../../errors/ConflictError";
import { HashServicePort } from "../../ports/HashServicePort";
import { TokenServicePort } from "../../ports/TokenServicePort";
import { UserRepositoryPort } from "../../ports/UserRepositoryPort";

export interface RegisterUserResult {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashServicePort,
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(input: RegisterDTO): Promise<RegisterUserResult> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const passwordHash = await this.hashService.hash(input.password);

    const user = await this.userRepository.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash
    });

    const token = this.tokenService.sign({
      sub: user.id,
      email: user.email
    });

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    };
  }
}
