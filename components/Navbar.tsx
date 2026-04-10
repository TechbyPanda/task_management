export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">
                        TaskMaster <span className="text-indigo-600">Pro</span>
                    </h1>
                </div>
                <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Palash Sharma v1.0
                </div>
            </div>
        </nav>
    )
}