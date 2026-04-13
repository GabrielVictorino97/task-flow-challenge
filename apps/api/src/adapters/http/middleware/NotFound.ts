import { Request, Response } from "express";
import { errorResponse } from "../../../shared/http/ApiResponse";

export function notFoundMiddleware(_req: Request, res: Response): void {
  res.status(404).json(errorResponse("NOT_FOUND", "Route not found"));
}
