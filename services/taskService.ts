import { api } from "@/util/apiUtil";
import Task from "@/types/task";

export const getTasks = async (): Promise<Task[]> => {
  return api.get<Task[]>("/api/todo");
};
