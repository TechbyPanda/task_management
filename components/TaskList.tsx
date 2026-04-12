"use client";

import Task from "@/types/Task";
import Status from "@/types/Status";
import { useCallback, useEffect, useRef, useState } from "react";

function formatStatusName(name: string): string {
    return name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusForValue(statuses: Status[], value: number): Status | undefined {
    return statuses.find((s) => s.value === value);
}

function statusLabel(status: number, statuses: Status[]): string {
    const s = getStatusForValue(statuses, status);
    if (s) return formatStatusName(s.name);
    return `Status ${status}`;
}

function isDoneStatus(status: number, statuses: Status[]): boolean {
    const s = getStatusForValue(statuses, status);
    if (!s) return false;
    const n = s.name.toLowerCase();
    return n === "done" || n === "completed" || n === "closed";
}

function statusStyles(status: number, statuses: Status[]): string {
    const s = getStatusForValue(statuses, status);
    const n = (s?.name ?? "").toLowerCase();
    if (n === "done" || n === "completed" || n === "closed") {
        return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60";
    }
    if (n === "pending" || n === "todo" || n === "to_do" || n === "open") {
        return "bg-amber-100 text-amber-800 ring-1 ring-amber-200/60";
    }
    if (n.includes("progress") || n === "in progress") {
        return "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/60";
    }
    return "bg-slate-100 text-slate-600 ring-1 ring-slate-200/60";
}

type TaskListProps = {
    tasks: Task[];
    statuses: Status[];
    onUpdateTask: (
        id: number,
        updates: { title?: string; status?: number }
    ) => Promise<void>;
    onDeleteTask: (id: number) => Promise<void>;
};

type TaskModalProps = {
    task: Task;
    statuses: Status[];
    sortedStatuses: Status[];
    busyId: number | null;
    onClose: () => void;
    onUpdateTask: TaskListProps["onUpdateTask"];
    onDeleteTask: TaskListProps["onDeleteTask"];
    runWithBusy: (id: number, fn: () => Promise<void>) => Promise<void>;
};

function TaskModal({
    task,
    statuses,
    sortedStatuses,
    busyId,
    onClose,
    onUpdateTask,
    onDeleteTask,
    runWithBusy,
}: TaskModalProps) {
    const [editTitle, setEditTitle] = useState(task.title);
    const panelRef = useRef<HTMLDivElement>(null);
    const isDone = isDoneStatus(task.status, statuses);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        panelRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    }, [task.id]);

    const saveTitle = async () => {
        const trimmed = editTitle.trim();
        if (!trimmed) {
            alert("Title cannot be empty");
            return;
        }
        await runWithBusy(task.id, async () => {
            await onUpdateTask(task.id, { title: trimmed });
            onClose();
        });
    };

    const handleStatusChange = async (value: string) => {
        const status = Number(value);
        if (!Number.isFinite(status)) return;
        await runWithBusy(task.id, async () => {
            await onUpdateTask(task.id, { status });
        });
    };

    const handleDelete = async () => {
        if (
            !confirm(
                `Delete "${task.title}"? This cannot be undone.`
            )
        ) {
            return;
        }
        await runWithBusy(task.id, async () => {
            await onDeleteTask(task.id);
            onClose();
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                aria-label="Close dialog"
                onClick={onClose}
            />
            <div
                ref={panelRef}
                className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            >
                <div className="flex items-start gap-3 mb-4">
                    <div
                        className={[
                            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            isDone
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-indigo-50 text-indigo-600",
                        ].join(" ")}
                        aria-hidden
                    >
                        {isDone ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2
                            id="task-modal-title"
                            className="text-lg font-bold text-slate-800"
                        >
                            Edit task
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Task #{task.id}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
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

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="task-modal-title-input"
                            className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                        >
                            Title
                        </label>
                        <input
                            id="task-modal-title-input"
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            disabled={busyId === task.id}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    void saveTitle();
                                }
                            }}
                            className={[
                                "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60",
                                isDone && "text-slate-500 line-through decoration-slate-400",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="task-modal-status"
                            className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                        >
                            Status
                        </label>
                        <select
                            id="task-modal-status"
                            value={task.status}
                            disabled={
                                busyId === task.id || sortedStatuses.length === 0
                            }
                            onChange={(e) =>
                                void handleStatusChange(e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                        >
                            {sortedStatuses.length === 0 ? (
                                <option value={task.status}>
                                    Status {task.status}
                                </option>
                            ) : (
                                sortedStatuses.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {formatStatusName(s.name)}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span
                            className={[
                                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                                statusStyles(task.status, statuses),
                            ].join(" ")}
                        >
                            {statusLabel(task.status, statuses)}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => void saveTitle()}
                            disabled={busyId === task.id}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Save title
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={busyId === task.id}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleDelete()}
                            disabled={busyId === task.id}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 ml-auto"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TaskList({
    tasks,
    statuses,
    onUpdateTask,
    onDeleteTask,
}: TaskListProps) {
    const [busyId, setBusyId] = useState<number | null>(null);
    const [modalTask, setModalTask] = useState<Task | null>(null);

    const resolvedModalTask = modalTask
        ? tasks.find((t) => t.id === modalTask.id) ?? null
        : null;

    useEffect(() => {
        if (modalTask && !tasks.some((t) => t.id === modalTask.id)) {
            setModalTask(null);
        }
    }, [tasks, modalTask]);

    const doneCount = tasks.filter((t) => isDoneStatus(t.status, statuses)).length;
    const hasTasks = tasks.length > 0;

    const statusSummary = [...statuses]
        .sort((a, b) => a.value - b.value)
        .map((s) => ({
            ...s,
            count: tasks.filter((t) => t.status === s.value).length,
        }));

    const sortedStatuses = [...statuses].sort((a, b) => a.value - b.value);

    const runWithBusy = async (id: number, fn: () => Promise<void>) => {
        setBusyId(id);
        try {
            await fn();
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            alert(msg);
        } finally {
            setBusyId(null);
        }
    };

    const closeTaskModal = useCallback(() => setModalTask(null), []);

    const handleStatusChange = async (taskId: number, value: string) => {
        const status = Number(value);
        if (!Number.isFinite(status)) return;
        await runWithBusy(taskId, async () => {
            await onUpdateTask(taskId, { status });
        });
    };

    const handleDelete = async (task: Task) => {
        if (
            !confirm(
                `Delete "${task.title}"? This cannot be undone.`
            )
        ) {
            return;
        }
        await runWithBusy(task.id, async () => {
            await onDeleteTask(task.id);
            if (modalTask?.id === task.id) setModalTask(null);
        });
    };

    return (
        <section>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Your Tasks</h2>
                <span
                    id="taskCounter"
                    className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md shrink-0 self-start sm:self-auto"
                >
                    {hasTasks
                        ? `${tasks.length} total${doneCount > 0 ? ` · ${doneCount} done` : ""}`
                        : "0 total"}
                </span>
            </div>

            {statuses.length > 0 && (
                <div
                    className="flex flex-wrap gap-2 mb-4"
                    aria-label="Tasks by status"
                >
                    {statusSummary.map((s) => (
                        <span
                            key={s.value}
                            className={[
                                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                                statusStyles(s.value, statuses),
                            ].join(" ")}
                        >
                            <span>{formatStatusName(s.name)}</span>
                            <span className="tabular-nums opacity-90">{s.count}</span>
                        </span>
                    ))}
                </div>
            )}

            <div id="taskList">
                {!hasTasks ? (
                    <div
                        id="emptyState"
                        className="text-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl"
                    >
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-slate-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                        </div>
                        <h3 className="text-slate-500 font-medium">No tasks found</h3>
                        <p className="text-slate-400 text-sm mt-1">
                            Start by adding one above!
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table
                            className="w-full min-w-[640px] text-left text-sm"
                            aria-label="Task list"
                        >
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90">
                                    <th
                                        scope="col"
                                        className="px-4 py-3 font-semibold text-slate-600 w-16"
                                    >
                                        #
                                    </th>
                                    <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 font-semibold text-slate-600 w-[200px]"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 font-semibold text-slate-600 text-right w-[200px]"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tasks.map((task) => {
                                    const isDone = isDoneStatus(task.status, statuses);
                                    return (
                                        <tr
                                            key={task.id}
                                            className={[
                                                "transition-colors hover:bg-slate-50/80",
                                                isDone && "bg-slate-50/50",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            <td className="px-4 py-3 tabular-nums text-slate-500">
                                                {task.id}
                                            </td>
                                            <td className="px-4 py-3 max-w-[280px] sm:max-w-md">
                                                <button
                                                    type="button"
                                                    onClick={() => setModalTask(task)}
                                                    className="text-left font-medium text-slate-800 hover:text-indigo-600 hover:underline decoration-indigo-300 underline-offset-2 wrap-break-word w-full"
                                                >
                                                    <span
                                                        className={
                                                            isDone
                                                                ? "text-slate-500 line-through decoration-slate-400"
                                                                : ""
                                                        }
                                                    >
                                                        {task.title}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <label
                                                    className="sr-only"
                                                    htmlFor={`task-status-${task.id}`}
                                                >
                                                    Status for {task.title}
                                                </label>
                                                <select
                                                    id={`task-status-${task.id}`}
                                                    value={task.status}
                                                    disabled={
                                                        busyId === task.id ||
                                                        sortedStatuses.length === 0
                                                    }
                                                    onChange={(e) =>
                                                        void handleStatusChange(
                                                            task.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                                                >
                                                    {sortedStatuses.length === 0 ? (
                                                        <option value={task.status}>
                                                            Status {task.status}
                                                        </option>
                                                    ) : (
                                                        sortedStatuses.map((s) => (
                                                            <option
                                                                key={s.value}
                                                                value={s.value}
                                                            >
                                                                {formatStatusName(s.name)}
                                                            </option>
                                                        ))
                                                    )}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalTask(task)}
                                                        disabled={busyId === task.id}
                                                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleDelete(task)
                                                        }
                                                        disabled={busyId === task.id}
                                                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {resolvedModalTask && (
                <TaskModal
                    key={resolvedModalTask.id}
                    task={resolvedModalTask}
                    statuses={statuses}
                    sortedStatuses={sortedStatuses}
                    busyId={busyId}
                    onClose={closeTaskModal}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    runWithBusy={runWithBusy}
                />
            )}
        </section>
    );
}
