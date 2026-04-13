import { MongooseTaskRepository } from "../../adapters/secondaryAdapter/MongooseTaskRepository";
import { UpdateTask } from "../../core/use-cases/task/UpdateTask";

export function makeUpdateTask(): UpdateTask {
  return new UpdateTask(new MongooseTaskRepository());
}
