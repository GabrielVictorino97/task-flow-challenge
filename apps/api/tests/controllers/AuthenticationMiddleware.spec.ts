import express from "express";
import request from "supertest";
import { authenticationMiddleware } from "../../src/adapters/http/middleware/Authentication";
import { errorHandlerMiddleware } from "../../src/adapters/http/middleware/ErrorHandler";
import { JwtTokenService } from "../../src/adapters/helpers/jwt";

function makeApp() {
  const app = express();
  app.get("/private", authenticationMiddleware, (req, res) => {
    res.status(200).json({ auth: req.auth });
  });
  app.use(errorHandlerMiddleware);
  return app;
}

describe("authenticationMiddleware", () => {
  it("should return 401 when bearer token is missing", async () => {
    const res = await request(makeApp()).get("/private");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should return 401 when authorization header has no Bearer prefix", async () => {
    const res = await request(makeApp()).get("/private").set("Authorization", "invalid_token");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("should return 401 when token is malformed", async () => {
    const res = await request(makeApp()).get("/private").set("Authorization", "Bearer malformed.token.here");

    expect(res.status).toBe(401);
  });

  it("should set req.auth and call next on valid token", async () => {
    const token = new JwtTokenService().sign({ sub: "user-1", email: "user@example.com" });
    const res = await request(makeApp()).get("/private").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.auth.userId).toBe("user-1");
    expect(res.body.auth.email).toBe("user@example.com");
  });
});
