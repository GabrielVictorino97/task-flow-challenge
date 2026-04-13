import { DeleteTask } from "../../src/core/use-cases/task/DeleteTask";
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

  return { useCase: new DeleteTask(repository), repository };
}

describe("DeleteTask", () => {
  it("should delete task successfully", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(mockTask);
    repository.delete.mockResolvedValue(true);

    await expect(useCase.execute("task-1", "user-1")).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("task-1");
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

  it("should throw NotFoundError when delete returns false", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(mockTask);
    repository.delete.mockResolvedValue(false);

    await expect(useCase.execute("task-1", "user-1")).rejects.toBeInstanceOf(NotFoundError);
  });
});
