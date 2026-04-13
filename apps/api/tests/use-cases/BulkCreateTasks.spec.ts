import { BulkCreateTasks } from "../../src/core/use-cases/task/BulkCreateTasks";
import { TaskRepositoryPort } from "../../src/core/ports/TaskRepositoryPort";
import { ValidationError } from "../../src/core/errors/ValidationError";

function makeRepository(): jest.Mocked<TaskRepositoryPort> {
  return {
    create: jest.fn(),
    createMany: jest.fn(),
    findById: jest.fn(),
    findByOwner: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };
}

describe("BulkCreateTasks", () => {
  it("should reject empty task list", async () => {
    const useCase = new BulkCreateTasks(makeRepository());

    await expect(useCase.execute({ ownerId: "user-1", tasks: [] })).rejects.toBeInstanceOf(ValidationError);
  });

  it("should reject payloads above 1000 tasks", async () => {
    const useCase = new BulkCreateTasks(makeRepository());

    await expect(
      useCase.execute({ ownerId: "user-1", tasks: Array.from({ length: 1001 }, (_, i) => ({ title: `Task ${i}` })) })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("should call createMany with mapped tasks", async () => {
    const repository = makeRepository();
    repository.createMany.mockResolvedValue([]);
    const useCase = new BulkCreateTasks(repository);

    await useCase.execute({ ownerId: "user-1", tasks: [{ title: "Task A", status: "done" }, { title: "Task B" }] });

    expect(repository.createMany).toHaveBeenCalledWith([
      { title: "Task A", description: undefined, status: "done", ownerId: "user-1" },
      { title: "Task B", description: undefined, status: "pending", ownerId: "user-1" }
    ]);
  });
});
