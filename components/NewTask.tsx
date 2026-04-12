"use client";

import Task from "@/types/Task";
import { createTask } from "@/services/taskService";
import { FormEvent, useState } from "react";

type NewTaskProps = {
    onTaskCreated: (task: Task) => void;
    /** When used inside a dialog, omits outer card chrome and heading. */
    variant?: "default" | "modal";
};

export default function NewTask({
    onTaskCreated,
    variant = "default",
}: NewTaskProps) {
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) {
            return;
        }
        setSubmitting(true);
        try {
            const task = await createTask({ title: trimmed });
            onTaskCreated(task);
            setTitle("");
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Could not create task";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const form = (
        <form
            onSubmit={(e) => void handleSubmit(e)}
            className={
                variant === "modal"
                    ? "flex flex-col gap-3"
                    : "flex flex-col sm:flex-row gap-3"
            }
        >
            <input
                type="text"
                id="taskInput"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                disabled={submitting}
                autoComplete="off"
                className="grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-700 placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shrink-0"
            >
                <span>{submitting ? "Adding…" : "Add Task"}</span>
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
            </button>
        </form>
    );

    if (variant === "modal") {
        return <div className="pt-1">{form}</div>;
    }

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Add New Task
            </h2>
            {form}
        </section>
    );
}
