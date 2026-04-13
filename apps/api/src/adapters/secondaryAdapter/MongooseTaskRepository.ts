import { Task } from "../../core/entity/Task";
import { TaskRepositoryPort } from "../../core/ports/TaskRepositoryPort";
import { TaskModel } from "../database/mongoose/models/TaskModel";

function mapToTask(document: any): Task {
  return {
    id: document._id.toString(),
    title: document.title,
    description: document.description,
    status: document.status,
    ownerId: document.ownerId.toString(),
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt)
  };
}

export class MongooseTaskRepository implements TaskRepositoryPort {
  async create(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    const created = await TaskModel.create(task);
    return mapToTask(created.toObject());
  }

  async createMany(tasks: Array<Omit<Task, "id" | "createdAt" | "updatedAt">>): Promise<Task[]> {
    const created = await TaskModel.insertMany(tasks);
    return created.map((item) => mapToTask(item.toObject()));
  }

  async findById(taskId: string): Promise<Task | null> {
    const task = await TaskModel.findById(taskId).lean();
    return task ? mapToTask(task) : null;
  }

  async findByOwner(ownerId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ ownerId }).sort({ createdAt: -1 }).lean();
    return tasks.map(mapToTask);
  }

  async update(taskId: string, data: Partial<Pick<Task, "title" | "description" | "status">>): Promise<Task | null> {
    const sanitized: Partial<Pick<Task, "title" | "description" | "status">> = {};
    if (data.title !== undefined) sanitized.title = data.title;
    if (data.description !== undefined) sanitized.description = data.description;
    if (data.status !== undefined) sanitized.status = data.status;

    const updated = await TaskModel.findByIdAndUpdate(
      taskId,
      { $set: sanitized },
      { new: true }
    ).lean();

    return updated ? mapToTask(updated) : null;
  }

  async delete(taskId: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(taskId);
    return !!result;
  }
}
