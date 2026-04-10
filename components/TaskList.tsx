export default function TaskList() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Your Tasks</h2>
                <span
                    id="taskCounter"
                    className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md"
                >
                    0 Total
                </span>
            </div>

            <div id="taskList" className="space-y-3">
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
            </div>
        </section>
    )
}