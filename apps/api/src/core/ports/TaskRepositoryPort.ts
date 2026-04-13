import { Task } from "../entity/Task";

export interface TaskRepositoryPort {
  create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>;
  createMany(tasks: Array<Omit<Task, "id" | "createdAt" | "updatedAt">>): Promise<Task[]>;
  findById(taskId: string): Promise<Task | null>;
  findByOwner(ownerId: string): Promise<Task[]>;
  update(taskId: string, data: Partial<Pick<Task, "title" | "description" | "status">>): Promise<Task | null>;
  delete(taskId: string): Promise<boolean>;
}
