import { RegisterUser } from "../../src/core/use-cases/auth/RegisterUser";
import { UserRepositoryPort } from "../../src/core/ports/UserRepositoryPort";
import { HashServicePort } from "../../src/core/ports/HashServicePort";
import { TokenServicePort } from "../../src/core/ports/TokenServicePort";
import { ConflictError } from "../../src/core/errors/ConflictError";
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
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn()
  } as jest.Mocked<HashServicePort>;

  const tokenService = {
    sign: jest.fn().mockReturnValue("jwt_token"),
    verify: jest.fn()
  } as jest.Mocked<TokenServicePort>;

  const useCase = new RegisterUser(userRepository, hashService, tokenService);

  return { useCase, userRepository, hashService, tokenService };
}

describe("RegisterUser", () => {
  it("should create user and return token on success", async () => {
    const { useCase, userRepository } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute({
      fullName: "Gabriel Silva",
      email: "gabriel@email.com",
      password: "senha123"
    });

    expect(result.token).toBe("jwt_token");
    expect(result.user.id).toBe("user-1");
    expect(result.user.fullName).toBe("Gabriel Silva");
  });

  it("should throw ConflictError when email is already in use", async () => {
    const { useCase, userRepository } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      useCase.execute({
        fullName: "Gabriel Silva",
        email: "gabriel@email.com",
        password: "senha123"
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("should store email in lowercase", async () => {
    const { useCase, userRepository } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);

    await useCase.execute({
      fullName: "Gabriel Silva",
      email: "GABRIEL@EMAIL.COM",
      password: "senha123"
    });

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: "gabriel@email.com" })
    );
  });

  it("should hash the password before storing", async () => {
    const { useCase, userRepository, hashService } = makeUseCase();

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);

    await useCase.execute({
      fullName: "Gabriel Silva",
      email: "gabriel@email.com",
      password: "senha123"
    });

    expect(hashService.hash).toHaveBeenCalledWith("senha123");
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ passwordHash: "hashed_password" })
    );
  });
});
