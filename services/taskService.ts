import { api } from "@/util/apiUtil";
import Task from "@/types/Task";

export const getTasks = async (): Promise<Task[]> => {
  return api.get<Task[]>("/api/todo");
};

export type CreateTaskInput = { title: string; status?: number };

export const createTask = async (body: CreateTaskInput): Promise<Task> => {
  return api.post<Task>("/api/todo", body);
};

export type TaskUpdate = { title?: string; status?: number };

export const updateTask = async (
  id: number,
  body: TaskUpdate
): Promise<Task> => {
  return api.patch<Task>(`/api/todo/${id}`, body);
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/api/todo/${id}`);
};
