import { UnauthorizedError } from "../../src/core/errors/UnauthorizedError";
import { ValidationError } from "../../src/core/errors/ValidationError";

describe("AppErrors", () => {
  it("UnauthorizedError should use default message", () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe("Unauthorized");
    expect(error.statusCode).toBe(401);
  });

  it("ValidationError should use default message", () => {
    const error = new ValidationError();
    expect(error.message).toBe("Validation failed");
    expect(error.statusCode).toBe(400);
  });
});
