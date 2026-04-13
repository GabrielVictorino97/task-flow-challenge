import { TaskController } from "../../adapters/http/controllers/TaskController";
import { makeBulkCreateTasks } from "./makeBulkCreateTasks";
import { makeCreateTask } from "./makeCreateTask";
import { makeDeleteTask } from "./makeDeleteTask";
import { makeGetTaskById } from "./makeGetTaskById";
import { makeGetTasksByOwner } from "./makeGetTasksByOwner";
import { makeUpdateTask } from "./makeUpdateTask";

export function makeTaskController(): TaskController {
  return new TaskController(
    makeCreateTask(),
    makeBulkCreateTasks(),
    makeGetTaskById(),
    makeGetTasksByOwner(),
    makeUpdateTask(),
    makeDeleteTask()
  );
}
