import { Task } from "../../entity/Task";
import { TaskRepositoryPort } from "../../ports/TaskRepositoryPort";

export class GetTasksByOwner {
  constructor(private readonly taskRepository: TaskRepositoryPort) {}

  async execute(ownerId: string): Promise<Task[]> {
    return this.taskRepository.findByOwner(ownerId);
  }
}
