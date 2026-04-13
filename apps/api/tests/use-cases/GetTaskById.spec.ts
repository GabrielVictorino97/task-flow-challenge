import { GetTaskById } from "../../src/core/use-cases/task/GetTaskById";
import { TaskRepositoryPort } from "../../src/core/ports/TaskRepositoryPort";
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

function makeUseCase() {
  const repository = {
    create: jest.fn(),
    createMany: jest.fn(),
    findById: jest.fn(),
    findByOwner: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  } as jest.Mocked<TaskRepositoryPort>;

  return { useCase: new GetTaskById(repository), repository };
}

describe("GetTaskById", () => {
  it("should return task when found and owner matches", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(mockTask);

    const result = await useCase.execute("task-1", "user-1");

    expect(result).toEqual(mockTask);
  });

  it("should throw NotFoundError when task does not exist", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute("task-1", "user-1")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw ForbiddenError when task belongs to another user", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(mockTask);

    await expect(useCase.execute("task-1", "other-user")).rejects.toBeInstanceOf(ForbiddenError);
  });
});
