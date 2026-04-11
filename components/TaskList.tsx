import Task from "@/types/Task";
import Status from "@/types/Status";

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

export default function TaskList({ tasks, statuses }: { tasks: Task[], statuses: Status[] }) {
    const doneCount = tasks.filter((t) => isDoneStatus(t.status, statuses)).length;
    const hasTasks = tasks.length > 0;

    const statusSummary = [...statuses]
        .sort((a, b) => a.value - b.value)
        .map((s) => ({
            ...s,
            count: tasks.filter((t) => t.status === s.value).length,
        }));

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

            <div id="taskList" className="space-y-3">
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
                    <ul className="space-y-3" aria-label="Task list">
                        {tasks.map((task) => {
                            const isDone = isDoneStatus(task.status, statuses);
                            return (
                                <li key={task.id}>
                                    <article
                                        className={[
                                            "group flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-shadow",
                                            "border-slate-200 hover:border-slate-300 hover:shadow-md",
                                            isDone && "bg-slate-50/80",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        <div
                                            className={[
                                                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
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
                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3
                                                    className={[
                                                        "font-semibold text-slate-800 wrap-break-word",
                                                        isDone &&
                                                            "text-slate-500 line-through decoration-slate-400",
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ")}
                                                >
                                                    {task.title}
                                                </h3>
                                                <span
                                                    className={[
                                                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                                                        statusStyles(task.status, statuses),
                                                    ].join(" ")}
                                                >
                                                    {statusLabel(task.status, statuses)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Task #{task.id}
                                            </p>
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}
