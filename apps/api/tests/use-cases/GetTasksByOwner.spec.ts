import { GetTasksByOwner } from "../../src/core/use-cases/task/GetTasksByOwner";
import { TaskRepositoryPort } from "../../src/core/ports/TaskRepositoryPort";
import { Task } from "../../src/core/entity/Task";

function makeUseCase() {
  const repository = {
    create: jest.fn(),
    createMany: jest.fn(),
    findById: jest.fn(),
    findByOwner: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  } as jest.Mocked<TaskRepositoryPort>;

  return { useCase: new GetTasksByOwner(repository), repository };
}

describe("GetTasksByOwner", () => {
  it("should return tasks for the given owner", async () => {
    const { useCase, repository } = makeUseCase();

    const tasks: Task[] = [
      { id: "task-1", title: "Task 1", status: "pending", ownerId: "user-1", createdAt: new Date(), updatedAt: new Date() },
      { id: "task-2", title: "Task 2", status: "done", ownerId: "user-1", createdAt: new Date(), updatedAt: new Date() }
    ];

    repository.findByOwner.mockResolvedValue(tasks);

    const result = await useCase.execute("user-1");

    expect(result).toEqual(tasks);
    expect(repository.findByOwner).toHaveBeenCalledWith("user-1");
  });

  it("should return empty array when owner has no tasks", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findByOwner.mockResolvedValue([]);

    const result = await useCase.execute("user-1");

    expect(result).toEqual([]);
  });
});
