import { MongooseTaskRepository } from "../../adapters/secondaryAdapter/MongooseTaskRepository";
import { DeleteTask } from "../../core/use-cases/task/DeleteTask";

export function makeDeleteTask(): DeleteTask {
  return new DeleteTask(new MongooseTaskRepository());
}
