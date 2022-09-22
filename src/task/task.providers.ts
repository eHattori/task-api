import { Task } from "./task.entity";

export const tasksProviders = [
  {
    provide: 'TASK_REPOSITORY',
    useValue: Task,
  }

]
