'use client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NewTask from "@/components/NewTask";
import TaskList from "@/components/TaskList";
import { getStatuses } from "@/services/statusService";
import { deleteTask, getTasks, updateTask } from "@/services/taskService";
import Status from "@/types/Status";
import Task from "@/types/Task";
import { useCallback, useEffect, useState } from "react";

function useEscapeClose(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = await getStatuses();
      setStatuses(statuses)
    }
    fetchStatuses();

    const fetchTasks = async () => {
      const tasks = await getTasks();
      setTasks(tasks)
    }
    fetchTasks();
  }, []);

  const handleUpdateTask = async (
    id: number,
    updates: { title?: string; status?: number }
  ) => {
    const updated = await updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setAddTaskOpen(false);
  };

  const closeAddTaskModal = useCallback(() => setAddTaskOpen(false), []);
  useEscapeClose(addTaskOpen, closeAddTaskModal);

  return (
    <>
      <Navbar />

      <main className="grow p-6 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Tasks
            </h1>
            <button
              type="button"
              onClick={() => setAddTaskOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add task
            </button>
          </div>

          <TaskList
            tasks={tasks}
            statuses={statuses}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </main>

      {addTaskOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-task-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            aria-label="Close dialog"
            onClick={() => setAddTaskOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2
                id="add-task-modal-title"
                className="text-lg font-bold text-slate-800"
              >
                Add new task
              </h2>
              <button
                type="button"
                onClick={() => setAddTaskOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <NewTask
              onTaskCreated={handleTaskCreated}
              variant="modal"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}