import { UpdateTask } from "../../src/core/use-cases/task/UpdateTask";
import { TaskRepositoryPort } from "../../src/core/ports/TaskRepositoryPort";
import { NotFoundError } from "../../src/core/errors/NotFoundError";
import { ForbiddenError } from "../../src/core/errors/ForbiddenError";
import { Task } from "../../src/core/entity/Task";

const mockTask: Task = {
  id: "task-1",
  title: "Original title",
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

  return { useCase: new UpdateTask(repository), repository };
}

describe("UpdateTask", () => {
  it("should update and return the task on success", async () => {
    const { useCase, repository } = makeUseCase();

    const updatedTask: Task = { ...mockTask, title: "Updated title", status: "in_progress" };

    repository.findById.mockResolvedValue(mockTask);
    repository.update.mockResolvedValue(updatedTask);

    const result = await useCase.execute({
      taskId: "task-1",
      ownerId: "user-1",
      title: "Updated title",
      status: "in_progress"
    });

    expect(result).toEqual(updatedTask);
    expect(repository.update).toHaveBeenCalledWith("task-1", {
      title: "Updated title",
      status: "in_progress",
      description: undefined
    });
  });

  it("should throw NotFoundError when task does not exist", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ taskId: "task-1", ownerId: "user-1", title: "New title" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw ForbiddenError when task belongs to another user", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(mockTask);

    await expect(
      useCase.execute({ taskId: "task-1", ownerId: "other-user", title: "New title" })
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("should throw NotFoundError when update returns null", async () => {
    const { useCase, repository } = makeUseCase();

    repository.findById.mockResolvedValue(mockTask);
    repository.update.mockResolvedValue(null);

    await expect(
      useCase.execute({ taskId: "task-1", ownerId: "user-1", title: "New title" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
