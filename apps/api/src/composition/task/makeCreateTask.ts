import { MongooseTaskRepository } from "../../adapters/secondaryAdapter/MongooseTaskRepository";
import { CreateTask } from "../../core/use-cases/task/CreateTask";

export function makeCreateTask(): CreateTask {
  return new CreateTask(new MongooseTaskRepository());
}
