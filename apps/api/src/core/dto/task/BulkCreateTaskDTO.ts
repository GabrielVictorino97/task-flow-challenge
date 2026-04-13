import { TaskStatus } from "../../entity/Task";

export interface BulkCreateTaskItemDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface BulkCreateTaskDTO {
  ownerId: string;
  tasks: BulkCreateTaskItemDTO[];
}
