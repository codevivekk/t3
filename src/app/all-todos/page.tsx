"use client";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useEffect, useState } from "react";
type Form = {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
const page = () => {
  const [todos, setTodos] = useState<Form[]>([]);
  const { data } = api.todo.getAll.useQuery();
  const updateTodo = api.todo.delete.useMutation();


  const handleDelete = async (id: number) => {
    const filteredData = todos?.filter((todo: Form) => todo?.id !== id);
    setTodos(filteredData);
    await updateTodo.mutateAsync({id : Number(id)})
  };

  useEffect(() => setTodos(data?.todos), [data?.todos]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="py-10 text-2xl">List of Todos</h1>
      <table className="w-3/4 overflow-hidden rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border-b px-6 py-3 text-left">ID</th>
            <th className="border-b px-6 py-3 text-left">Title</th>
            <th className="border-b px-6 py-3 text-left">Description</th>
            <th className="border-b px-6 py-3 text-left">Due Date</th>

            <th className="border-b px-6 py-3 text-left">
              <button type="button">Update</button>
            </th>
            <th className="border-b px-6 py-3 text-left">
              <button type="button">Delete</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {todos?.map((todo : Form, index : number) => (
            <tr className="hover:bg-gray-100" key={todo?.title + index}>
              <td className="border-b px-6 py-4">{index + 1}</td>
              <td className="border-b px-6 py-4">{todo?.title}</td>
              <td className="border-b px-6 py-4">{todo?.description}</td>
              <td className="border-b px-6 py-4">
                {todo?.dueDate
                  ? new Date(todo?.dueDate).toLocaleString()
                  : "No Due Date"}
              </td>
              <td className="border-b px-6 py-3 text-left">
                <Link
                  href={`/${todo?.id}`}
                  className="rounded-lg bg-blue-400 px-4 py-2 font-semibold text-black shadow-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Update
                </Link>
              </td>
              <td className="border-b px-6 py-3 text-left">
                <button
                  type="button"
                  className="rounded-lg bg-red-400 px-4 py-2 font-semibold text-black shadow-lg transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => handleDelete(todo?.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default page;
