import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../core/errors/AppError";
import { errorResponse } from "../../../shared/http/ApiResponse";

export function errorHandlerMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.code, error.message));
    return;
  }

  console.error(error);
  res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Unexpected internal server error"));
}
