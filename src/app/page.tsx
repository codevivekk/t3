import Link from "next/link";
import From from "@/components/form/From";

export default function Home() {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Add New Todo</h1>
      <From />
      <div className="wiew-todo-wrapper m-auto w-full py-5 text-center">
        <Link
          href="/all-todos"
          className="rounded-lg bg-purple-400 p-2 text-lg text-black"
        >
          View all you todos
        </Link>
      </div>
    </div>
  );
}
