import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { Task } from "../../entity/Task";
import { TaskRepositoryPort } from "../../ports/TaskRepositoryPort";

export class GetTaskById {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(taskId: string, ownerId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.ownerId !== ownerId) {
      throw new ForbiddenError("You can only access your own tasks");
    }

    return task;
  }
}
