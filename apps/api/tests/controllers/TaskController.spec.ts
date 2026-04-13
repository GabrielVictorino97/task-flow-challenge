import express from "express";
import request from "supertest";
import { TaskController } from "../../src/adapters/http/controllers/TaskController";
import { CreateTask } from "../../src/core/use-cases/task/CreateTask";
import { BulkCreateTasks } from "../../src/core/use-cases/task/BulkCreateTasks";
import { GetTaskById } from "../../src/core/use-cases/task/GetTaskById";
import { GetTasksByOwner } from "../../src/core/use-cases/task/GetTasksByOwner";
import { UpdateTask } from "../../src/core/use-cases/task/UpdateTask";
import { DeleteTask } from "../../src/core/use-cases/task/DeleteTask";
import { errorHandlerMiddleware } from "../../src/adapters/http/middleware/ErrorHandler";
import { NotFoundError } from "../../src/core/errors/NotFoundError";
import { ForbiddenError } from "../../src/core/errors/ForbiddenError";
import { Task } from "../../src/core/entity/Task";

const mockTask: Task = {
  id: "task-1",
  title: "Test task",
  status: "pending",
  ownerId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date()
};

function makeApp() {
  const createTask = { execute: jest.fn() } as unknown as jest.Mocked<CreateTask>;
  const bulkCreateTasks = { execute: jest.fn() } as unknown as jest.Mocked<BulkCreateTasks>;
  const getTaskById = { execute: jest.fn() } as unknown as jest.Mocked<GetTaskById>;
  const getTasksByOwner = { execute: jest.fn() } as unknown as jest.Mocked<GetTasksByOwner>;
  const updateTask = { execute: jest.fn() } as unknown as jest.Mocked<UpdateTask>;
  const deleteTask = { execute: jest.fn() } as unknown as jest.Mocked<DeleteTask>;

  const controller = new TaskController(
    createTask,
    bulkCreateTasks,
    getTaskById,
    getTasksByOwner,
    updateTask,
    deleteTask
  );

  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.auth = { userId: "user-1", email: "gabriel@email.com" };
    next();
  });

  app.post("/tasks", controller.create);
  app.post("/tasks/bulk", controller.bulkCreate);
  app.get("/tasks/status", controller.getStatus);
  app.get("/tasks", controller.getAllByOwner);
  app.get("/tasks/:id", controller.getById);
  app.patch("/tasks/:id", controller.update);
  app.delete("/tasks/:id", controller.delete);
  app.use(errorHandlerMiddleware);

  return { app, createTask, bulkCreateTasks, getTaskById, getTasksByOwner, updateTask, deleteTask };
}

describe("TaskController", () => {
  describe("POST /tasks", () => {
    it("should return 201 on success", async () => {
      const { app, createTask } = makeApp();
      (createTask.execute as jest.Mock).mockResolvedValue(mockTask);

      const res = await request(app).post("/tasks").send({ title: "Test task" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("task-1");
    });

    it("should return 400 when title is missing", async () => {
      const { app } = makeApp();

      const res = await request(app).post("/tasks").send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /tasks/bulk", () => {
    it("should return 201 on success", async () => {
      const { app, bulkCreateTasks } = makeApp();
      (bulkCreateTasks.execute as jest.Mock).mockResolvedValue([mockTask]);

      const res = await request(app)
        .post("/tasks/bulk")
        .send({ tasks: [{ title: "Task 1" }] });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should return 400 when tasks array is missing", async () => {
      const { app } = makeApp();

      const res = await request(app).post("/tasks/bulk").send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /tasks/status", () => {
    it("should return 200 with all available statuses", async () => {
      const { app } = makeApp();

      const res = await request(app).get("/tasks/status");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(["pending", "in_progress", "done"]);
    });
  });

  describe("GET /tasks", () => {
    it("should return 200 with task list", async () => {
      const { app, getTasksByOwner } = makeApp();
      (getTasksByOwner.execute as jest.Mock).mockResolvedValue([mockTask]);

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it("should call next(error) on unexpected error", async () => {
      const { app, getTasksByOwner } = makeApp();
      (getTasksByOwner.execute as jest.Mock).mockRejectedValue(new Error("unexpected"));

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(500);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return 200 when task is found", async () => {
      const { app, getTaskById } = makeApp();
      (getTaskById.execute as jest.Mock).mockResolvedValue(mockTask);

      const res = await request(app).get("/tasks/task-1");

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("task-1");
    });

    it("should return 404 when task is not found", async () => {
      const { app, getTaskById } = makeApp();
      (getTaskById.execute as jest.Mock).mockRejectedValue(new NotFoundError());

      const res = await request(app).get("/tasks/task-1");

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should return 403 when task belongs to another user", async () => {
      const { app, getTaskById } = makeApp();
      (getTaskById.execute as jest.Mock).mockRejectedValue(new ForbiddenError());

      const res = await request(app).get("/tasks/task-1");

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should return 200 on success", async () => {
      const { app, updateTask } = makeApp();
      (updateTask.execute as jest.Mock).mockResolvedValue({ ...mockTask, status: "done" });

      const res = await request(app).patch("/tasks/task-1").send({ status: "done" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("done");
    });

    it("should return 400 when body is empty", async () => {
      const { app } = makeApp();

      const res = await request(app).patch("/tasks/task-1").send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 404 when task is not found", async () => {
      const { app, updateTask } = makeApp();
      (updateTask.execute as jest.Mock).mockRejectedValue(new NotFoundError());

      const res = await request(app).patch("/tasks/task-1").send({ title: "New title" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should return 204 on success", async () => {
      const { app, deleteTask } = makeApp();
      (deleteTask.execute as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete("/tasks/task-1");

      expect(res.status).toBe(204);
    });

    it("should return 404 when task is not found", async () => {
      const { app, deleteTask } = makeApp();
      (deleteTask.execute as jest.Mock).mockRejectedValue(new NotFoundError());

      const res = await request(app).delete("/tasks/task-1");

      expect(res.status).toBe(404);
    });

    it("should return 403 when task belongs to another user", async () => {
      const { app, deleteTask } = makeApp();
      (deleteTask.execute as jest.Mock).mockRejectedValue(new ForbiddenError());

      const res = await request(app).delete("/tasks/task-1");

      expect(res.status).toBe(403);
    });
  });
});
