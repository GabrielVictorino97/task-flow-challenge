import { TaskStatus } from "../../entity/Task";

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  ownerId: string;
  taskId: string;
}
