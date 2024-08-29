import From from "@/components/form/From";
import React from "react";

const page = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Update todo</h1>
      <From id={id} />
    </div>
  );
};

export default page;
