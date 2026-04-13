import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { LoginUser } from "../../../core/use-cases/auth/LoginUser";
import { RegisterUser } from "../../../core/use-cases/auth/RegisterUser";
import { errorResponse, successResponse } from "../../../shared/http/ApiResponse";

import { loginSchema, registerSchema } from "../validators/auth.schema";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = registerSchema.parse(req.body);
      const result = await this.registerUser.execute(input);
      res.status(201).json(successResponse(result));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(errorResponse("VALIDATION_ERROR", "Invalid request body", error.flatten()));
        return;
      }

      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = loginSchema.parse(req.body);
      const result = await this.loginUser.execute(input);
      res.status(200).json(successResponse(result));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(errorResponse("VALIDATION_ERROR", "Invalid request body", error.flatten()));
        return;
      }

      next(error);
    }
  };
}
