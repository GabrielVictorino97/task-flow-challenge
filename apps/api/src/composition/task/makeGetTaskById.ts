import { MongooseTaskRepository } from "../../adapters/secondaryAdapter/MongooseTaskRepository";
import { GetTaskById } from "../../core/use-cases/task/GetTaskById";

export function makeGetTaskById(): GetTaskById {
  return new GetTaskById(new MongooseTaskRepository());
}
