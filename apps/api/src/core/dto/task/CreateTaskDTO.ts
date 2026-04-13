import { TaskStatus } from "../../entity/Task";

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  ownerId: string;
}
