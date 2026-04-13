import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { AuthController } from "../../src/adapters/http/controllers/AuthController";
import { errorHandlerMiddleware } from "../../src/adapters/http/middleware/ErrorHandler";
import { LoginUser } from "../../src/core/use-cases/auth/LoginUser";
import { RegisterUser } from "../../src/core/use-cases/auth/RegisterUser";

function makeApp(registerUseCase: RegisterUser, loginUseCase: LoginUser) {
  const controller = new AuthController(registerUseCase, loginUseCase);
  const app = express();
  app.use(express.json());
  app.post("/register", controller.register);
  app.post("/login", controller.login);
  app.use(errorHandlerMiddleware);
  return app;
}

describe("AuthController", () => {
  const validRegisterBody = { fullName: "John Doe", email: "john@example.com", password: "password123" };
  const validLoginBody = { email: "john@example.com", password: "password123" };

  describe("register", () => {
    it("should return 400 when payload is invalid", async () => {
      const app = makeApp(
        { execute: jest.fn() } as unknown as RegisterUser,
        { execute: jest.fn() } as unknown as LoginUser
      );

      const res = await request(app).post("/register").send({ fullName: "", email: "invalid", password: "123" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 201 on success", async () => {
      const registerUseCase = { execute: jest.fn().mockResolvedValue({ id: "1", email: "john@example.com" }) } as unknown as RegisterUser;
      const app = makeApp(registerUseCase, { execute: jest.fn() } as unknown as LoginUser);

      const res = await request(app).post("/register").send(validRegisterBody);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should call next(error) on unexpected error", async () => {
      const registerUseCase = { execute: jest.fn().mockRejectedValue(new Error("unexpected")) } as unknown as RegisterUser;
      const app = makeApp(registerUseCase, { execute: jest.fn() } as unknown as LoginUser);

      const res = await request(app).post("/register").send(validRegisterBody);

      expect(res.status).toBe(500);
    });
  });

  describe("login", () => {
    it("should return 400 when payload is invalid", async () => {
      const app = makeApp(
        { execute: jest.fn() } as unknown as RegisterUser,
        { execute: jest.fn() } as unknown as LoginUser
      );

      const res = await request(app).post("/login").send({ email: "invalid" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 200 on success", async () => {
      const loginUseCase = { execute: jest.fn().mockResolvedValue({ token: "jwt-token" }) } as unknown as LoginUser;
      const app = makeApp({ execute: jest.fn() } as unknown as RegisterUser, loginUseCase);

      const res = await request(app).post("/login").send(validLoginBody);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should call next(error) on unexpected error", async () => {
      const loginUseCase = { execute: jest.fn().mockRejectedValue(new Error("unexpected")) } as unknown as LoginUser;
      const app = makeApp({ execute: jest.fn() } as unknown as RegisterUser, loginUseCase);

      const res = await request(app).post("/login").send(validLoginBody);

      expect(res.status).toBe(500);
    });
  });
});
