import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BulkCreateTasks } from "../../../core/use-cases/task/BulkCreateTasks";
import { CreateTask } from "../../../core/use-cases/task/CreateTask";
import { DeleteTask } from "../../../core/use-cases/task/DeleteTask";
import { GetTaskById } from "../../../core/use-cases/task/GetTaskById";
import { GetTasksByOwner } from "../../../core/use-cases/task/GetTasksByOwner";
import { UpdateTask } from "../../../core/use-cases/task/UpdateTask";
import { errorResponse, successResponse } from "../../../shared/http/ApiResponse";
import { bulkCreateTaskSchema, createTaskSchema, taskParamsSchema, updateTaskSchema } from "../validators/task.schema";

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTask,
    private readonly bulkCreateTasksUseCase: BulkCreateTasks,
    private readonly getTaskByIdUseCase: GetTaskById,
    private readonly getTasksByOwnerUseCase: GetTasksByOwner,
    private readonly updateTaskUseCase: UpdateTask,
    private readonly deleteTaskUseCase: DeleteTask
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = createTaskSchema.parse(req.body);
      const result = await this.createTaskUseCase.execute({
        ...input,
        ownerId: req.auth!.userId
      });

      res.status(201).json(successResponse(result));
    } catch (error) {
      this.handleValidationError(error, res, next);
    }
  };

  bulkCreate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = bulkCreateTaskSchema.parse(req.body);
      const result = await this.bulkCreateTasksUseCase.execute({
        ownerId: req.auth!.userId,
        tasks: input.tasks
      });

      res.status(201).json(successResponse(result));
    } catch (error) {
      this.handleValidationError(error, res, next);
    }
  };

  getAllByOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getTasksByOwnerUseCase.execute(req.auth!.userId);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = taskParamsSchema.parse(req.params);
      const result = await this.getTaskByIdUseCase.execute(params.id, req.auth!.userId);
      res.status(200).json(successResponse(result));
    } catch (error) {
      this.handleValidationError(error, res, next);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = taskParamsSchema.parse(req.params);
      const input = updateTaskSchema.parse(req.body);

      const result = await this.updateTaskUseCase.execute({
        taskId: params.id,
        ownerId: req.auth!.userId,
        ...input
      });

      res.status(200).json(successResponse(result));
    } catch (error) {
      this.handleValidationError(error, res, next);
    }
  };

  getStatus = (_req: Request, res: Response): void => {
    res.status(200).json(successResponse(["pending", "in_progress", "done"]));
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = taskParamsSchema.parse(req.params);
      await this.deleteTaskUseCase.execute(params.id, req.auth!.userId);
      res.status(204).send();
    } catch (error) {
      this.handleValidationError(error, res, next);
    }
  };

  private handleValidationError(error: unknown, res: Response, next: NextFunction): void {
    if (error instanceof ZodError) {
      res.status(400).json(errorResponse("VALIDATION_ERROR", "Invalid request data", error.flatten()));
      return;
    }

    next(error);
  }
}
