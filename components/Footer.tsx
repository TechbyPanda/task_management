const currentYear = new Date().getFullYear();

const Footer = () => (
    <footer className="w-full border-t border-slate-100 bg-white py-6 px-4 text-center">
        <div className="mx-auto flex flex-col items-center gap-1">
            <span className="text-sm text-slate-500">
                &copy; {currentYear} TaskManager. All rights reserved.
            </span>
            <span className="text-xs text-slate-400">
                Crafted with <span className="text-indigo-500 font-semibold">Next.js</span> & <span className="font-mono text-indigo-500">Tailwind&nbsp;CSS</span>
            </span>
        </div>
    </footer>
);

export default Footer;