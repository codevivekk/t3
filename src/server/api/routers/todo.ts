import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { todos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const todoRouter = createTRPCRouter({
    
    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                dueDate: z.string().nullable().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const dueDateValue = input.dueDate ? new Date(input.dueDate) : null;
            await ctx.db.insert(todos).values({
                title: input.title,
                description: input.description,
                dueDate: dueDateValue,
            });
            return { success: true };
        }),

    getLatest: publicProcedure.query(async ({ ctx }) => {
        const todo = await ctx.db.query.todos.findFirst({
            orderBy: (todos, { desc }) => [desc(todos.createdAt)],
        });

        return todo ?? null;
    }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const todosList = await ctx.db.query.todos.findMany({
            orderBy: (todos, { desc }) => [desc(todos.createdAt)],
        });
        return {
            todos: todosList,
        };
    }),


    delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async({ ctx, input }) => {
        await ctx.db.delete(todos).where(eq(todos.id, input.id));
        return { success: true };
    }),

    update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().min(1),
        dueDate: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
    const dueDateValue = input.dueDate ? new Date(input.dueDate) : null;
      const updatedTodo = await ctx.db.update(todos)
        .set({
          title: input.title,
          description: input.description,
          dueDate: dueDateValue,
        })
      .where(eq(todos.id, input.id)); 

      return updatedTodo;
    }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const todo = await ctx.db.query.todos.findFirst({
                where: (todos, { eq }) => eq(todos.id, input.id),
            });

            if (!todo) {
                throw new Error(`Todo with id ${input.id} not found`);
            }

            return todo;
        }),


});
