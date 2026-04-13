import { BulkCreateTaskDTO } from "../../dto/task/BulkCreateTaskDTO";
import { ValidationError } from "../../errors/ValidationError";
import { Task } from "../../entity/Task";
import { TaskRepositoryPort } from "../../ports/TaskRepositoryPort";

export class BulkCreateTasks {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(input: BulkCreateTaskDTO): Promise<Task[]> {
    if (input.tasks.length === 0) {
      throw new ValidationError("At least one task is required");
    }

    if (input.tasks.length > 1000) {
      throw new ValidationError("Bulk create supports up to 1000 tasks");
    }

    return this.taskRepository.createMany(
      input.tasks.map((task) => ({
        title: task.title,
        description: task.description,
        status: task.status ?? "pending",
        ownerId: input.ownerId
      }))
    );
  }
}
