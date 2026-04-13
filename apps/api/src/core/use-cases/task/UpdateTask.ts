import { UpdateTaskDTO } from "../../dto/task/UpdateTaskDTO";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { Task } from "../../entity/Task";
import { TaskRepositoryPort } from "../../ports/TaskRepositoryPort";

export class UpdateTask {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(input: UpdateTaskDTO): Promise<Task> {
    const existingTask = await this.taskRepository.findById(input.taskId);

    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }

    if (existingTask.ownerId !== input.ownerId) {
      throw new ForbiddenError("You can only update your own tasks");
    }

    const updatedTask = await this.taskRepository.update(input.taskId, {
      title: input.title,
      description: input.description,
      status: input.status
    });

    if (!updatedTask) {
      throw new NotFoundError("Task not found");
    }

    return updatedTask;
  }
}
