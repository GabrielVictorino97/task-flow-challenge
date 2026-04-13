import { CreateTask } from "../../src/core/use-cases/task/CreateTask";
import { TaskRepositoryPort } from "../../src/core/ports/TaskRepositoryPort";
import { Task } from "../../src/core/entity/Task";

describe("CreateTask", () => {
  it("should create a task with pending as default status", async () => {
    const repository: jest.Mocked<TaskRepositoryPort> = {
      create: jest.fn(),
      createMany: jest.fn(),
      findById: jest.fn(),
      findByOwner: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    const createdTask: Task = {
      id: "task-1",
      title: "Study hexagonal architecture",
      description: "Read and implement",
      status: "pending",
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    repository.create.mockResolvedValue(createdTask);

    const useCase = new CreateTask(repository);

    const result = await useCase.execute({
      title: "Study hexagonal architecture",
      description: "Read and implement",
      ownerId: "user-1"
    });

    expect(repository.create).toHaveBeenCalledWith({
      title: "Study hexagonal architecture",
      description: "Read and implement",
      status: "pending",
      ownerId: "user-1"
    });
    expect(result).toEqual(createdTask);
  });
});
