import { CreateTaskDTO } from "../../dto/task/CreateTaskDTO";
import { Task } from "../../entity/Task";
import { TaskRepositoryPort } from "../../ports/TaskRepositoryPort";

export class CreateTask {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(input: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.create({
      title: input.title,
      description: input.description,
      status: input.status ?? "pending",
      ownerId: input.ownerId
    });
  }
}
