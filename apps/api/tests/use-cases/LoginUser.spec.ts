import { LoginUser } from "../../src/core/use-cases/auth/LoginUser";
import { UserRepositoryPort } from "../../src/core/ports/UserRepositoryPort";
import { HashServicePort } from "../../src/core/ports/HashServicePort";
import { TokenServicePort } from "../../src/core/ports/TokenServicePort";
import { UnauthorizedError } from "../../src/core/errors/UnauthorizedError";
import { User } from "../../src/core/entity/User";

const mockUser: User = {
  id: "user-1",
  fullName: "Gabriel Silva",
  email: "gabriel@email.com",
  passwordHash: "hashed_password",
  createdAt: new Date(),
  updatedAt: new Date()
};

function makeUseCase() {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn()
  } as jest.Mocked<UserRepositoryPort>;

  const hashService = {
    hash: jest.fn(),
    compare: jest.fn()
  } as jest.Mocked<HashServicePort>;

  const tokenService = {
    sign: jest.fn().mockReturnValue("jwt_token"),
    verify: jest.fn()
  } as jest.Mocked<TokenServicePort>;

  const useCase = new LoginUser(userRepository, hashService, tokenService);

  return { useCase, userRepository, hashService, tokenService };
}

describe("LoginUser", () => {
  it("should return token and user on valid credentials", async () => {
    const { useCase, userRepository, hashService } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);

    const result = await useCase.execute({ email: "gabriel@email.com", password: "senha123" });

    expect(result.token).toBe("jwt_token");
    expect(result.user.id).toBe("user-1");
    expect(result.user.email).toBe("gabriel@email.com");
  });

  it("should throw UnauthorizedError when user is not found", async () => {
    const { useCase, userRepository } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: "notfound@email.com", password: "senha123" })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should throw UnauthorizedError when password does not match", async () => {
    const { useCase, userRepository, hashService } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: "gabriel@email.com", password: "wrong_password" })
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should look up user by lowercased email", async () => {
    const { useCase, userRepository, hashService } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);

    await useCase.execute({ email: "GABRIEL@EMAIL.COM", password: "senha123" });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("gabriel@email.com");
  });
});
