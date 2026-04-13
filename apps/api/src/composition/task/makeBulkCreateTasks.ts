import { MongooseTaskRepository } from "../../adapters/secondaryAdapter/MongooseTaskRepository";
import { BulkCreateTasks } from "../../core/use-cases/task/BulkCreateTasks";

export function makeBulkCreateTasks(): BulkCreateTasks {
  return new BulkCreateTasks(new MongooseTaskRepository());
}
