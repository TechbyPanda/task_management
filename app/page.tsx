import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NewTask from "@/components/NewTask";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-grow p-6 lg:p-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <NewTask />

          <TaskList />
        </div>
      </main>

      <Footer />
    </>
  );
}