import { LoginDTO } from "../../dto/auth/LoginDTO";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { HashServicePort } from "../../ports/HashServicePort";
import { TokenServicePort } from "../../ports/TokenServicePort";
import { UserRepositoryPort } from "../../ports/UserRepositoryPort";

export interface LoginUserResult {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export class LoginUser {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashServicePort,
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(input: LoginDTO): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(input.email.toLowerCase());

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const passwordMatches = await this.hashService.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid credentials");
    }

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
