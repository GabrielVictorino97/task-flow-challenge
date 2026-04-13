import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { errorHandlerMiddleware } from "../../src/adapters/http/middleware/ErrorHandler";
import { NotFoundError } from "../../src/core/errors/NotFoundError";
import { UnauthorizedError } from "../../src/core/errors/UnauthorizedError";
import { ForbiddenError } from "../../src/core/errors/ForbiddenError";
import { ConflictError } from "../../src/core/errors/ConflictError";
import { ValidationError } from "../../src/core/errors/ValidationError";

function makeApp(error: unknown) {
  const app = express();
  app.get("/test", (_req: Request, _res: Response, next: NextFunction) => next(error));
  app.use(errorHandlerMiddleware);
  return app;
}

describe("errorHandlerMiddleware", () => {
  it("should return 404 for NotFoundError", async () => {
    const res = await request(makeApp(new NotFoundError("Task not found"))).get("/test");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toBe("Task not found");
  });

  it("should return 401 for UnauthorizedError", async () => {
    const res = await request(makeApp(new UnauthorizedError("Unauthorized"))).get("/test");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should return 403 for ForbiddenError", async () => {
    const res = await request(makeApp(new ForbiddenError())).get("/test");

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("should return 409 for ConflictError", async () => {
    const res = await request(makeApp(new ConflictError("Email already in use"))).get("/test");

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
  });

  it("should return 400 for ValidationError", async () => {
    const res = await request(makeApp(new ValidationError("Invalid data"))).get("/test");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return 500 for unknown errors", async () => {
    const res = await request(makeApp(new Error("Unexpected error"))).get("/test");

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe("INTERNAL_SERVER_ERROR");
  });
});
