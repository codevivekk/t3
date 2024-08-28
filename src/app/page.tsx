"use client";
import { useState } from "react";

import type { Errors, TodoFormState } from "@/constant/types";
import type { FormEvent, ChangeEvent } from "react";
import { api } from '@/trpc/react';


import { validationMessages } from "@/constant/error";


export default function Home() {
  const formObj = {
    title: "",
    description: "",
    dueDate: "",
  };

  const [formState, setFormState] = useState<TodoFormState>(formObj);
  const [errors, setErrors] = useState<Errors>(formObj);

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

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const { title, description, dueDate } = formState;
    const newErrors = validateForm(formState);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const todoItem = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    console.log("New Todo Item:", todoItem);

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

  return (
    <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Add New Todo</h2>
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
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
}
