"use client";
import { validationMessages } from "@/constant/error";
import type { Errors, TodoFormState } from "@/constant/types";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

const From = ({ id }: { id?: number }) => {
  const formObj = {
    title: "",
    description: "",
    dueDate: "",
  };

  const [formState, setFormState] = useState<TodoFormState>(formObj);
  const [errors, setErrors] = useState<Errors>(formObj);
  const router = useRouter()

  const { data } = id
    ? api.todo.getById.useQuery({ id: Number(id) })
    : { data: undefined };
  const createTodo = api.todo.create.useMutation();
  const updateTodo = api.todo.update.useMutation();

  const validateForm = (formObj: TodoFormState): Errors => {
    const { title, description, dueDate } = formObj;
    const newErrors: Errors = {};
    if (!title) newErrors.title = validationMessages?.TITLE_REQUIRED;
    if (!description)
      newErrors.description = validationMessages?.DESCRIPTION_REQUIRED;

    if (dueDate) {
      const today = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(dueDate).setHours(0, 0, 0, 0);
      if (selectedDate < today)
        newErrors.dueDate = validationMessages?.DUE_DATE_PAST;
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const { title, description, dueDate } = formState;
    const newErrors = validateForm(formState);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (id) {
      await updateTodo.mutateAsync({
        id: Number(id),
        title,
        description,
        dueDate,
      });
      router.push('/')
    } else {
      await createTodo.mutateAsync({
        title,
        description,
        dueDate,
      });
    }

    setFormState(formObj);
    setErrors(formObj);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  useEffect(() => {
    if (data) {
      setFormState({
        title: data.title ?? "",
        description: data.description ?? "",
        dueDate: data.dueDate?.toISOString().split('T')[0] ?? "",
      });
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-bold text-gray-700"
          htmlFor="title"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formState?.title}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-bold text-gray-700"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState?.description}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring ${errors.description ? "border-red-500" : ""}`}
          rows={4}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-bold text-gray-700"
          htmlFor="dueDate"
        >
          Due Date (Optional)
        </label>
        <input
          type="date"
          name="dueDate"
          id="dueDate"
          value={formState?.dueDate}
          onChange={handleChange}
          className={`w-full rounded-md border px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring ${errors.dueDate ? "border-red-500" : ""}`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
        )}
      </div>
      <div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
        >
          {id ? "Update Todo" : " Add Todo"}
        </button>
      </div>
    </form>
  );
};

export default From;
