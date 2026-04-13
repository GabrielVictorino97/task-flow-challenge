import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { TaskRepositoryPort } from "../../ports/TaskRepositoryPort";

export class DeleteTask {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(taskId: string, ownerId: string): Promise<void> {
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }

    if (existingTask.ownerId !== ownerId) {
      throw new ForbiddenError("You can only delete your own tasks");
    }

    const deleted = await this.taskRepository.delete(taskId);

    if (!deleted) {
      throw new NotFoundError("Task not found");
    }
  }
}
