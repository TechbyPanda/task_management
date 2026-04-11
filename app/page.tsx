'use client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NewTask from "@/components/NewTask";
import TaskList from "@/components/TaskList";
import { getTasks } from "@/services/taskService";
import Task from "@/types/task";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks();
      setTasks(tasks)
    }
    fetchTasks();
  }, [])

  return (
    <>
      <Navbar />

      <main className="flex-grow p-6 lg:p-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <NewTask />

          <TaskList tasks={tasks} />
        </div>
      </main>

      <Footer />
    </>
  );
}