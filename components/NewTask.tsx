export default function NewTask() {
    return (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Add New Task
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    id="taskInput"
                    placeholder="What needs to be done?"
                    className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-700 placeholder:text-slate-400"
                />
                <button
                    // onClick handler should be implemented for task addition
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <span>Add Task</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </section>
    )
}