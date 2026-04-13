import { JwtTokenService } from "../../src/adapters/helpers/jwt";

describe("JwtTokenService", () => {
  const service = new JwtTokenService();
  const payload = { sub: "user-1", email: "user@example.com" };

  it("should sign and verify a token", () => {
    const token = service.sign(payload);
    const result = service.verify(token);

    expect(result.sub).toBe(payload.sub);
    expect(result.email).toBe(payload.email);
  });
});
