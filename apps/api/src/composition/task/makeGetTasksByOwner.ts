import { MongooseTaskRepository } from "../../adapters/secondaryAdapter/MongooseTaskRepository";
import { GetTasksByOwner } from "../../core/use-cases/task/GetTasksByOwner";

export function makeGetTasksByOwner(): GetTasksByOwner {
  return new GetTasksByOwner(new MongooseTaskRepository());
}
