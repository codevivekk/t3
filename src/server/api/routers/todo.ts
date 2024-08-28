import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { todos } from "@/server/db/schema";

export const todoRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                dueDate: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const dueDateValue = input.dueDate ? new Date(input.dueDate) : null;
            await ctx.db.insert(todos).values({
                title: input.title,
                description: input.description,
                dueDate: dueDateValue,
            });
        }),

    getLatest: publicProcedure.query(async ({ ctx }) => {
        const todo = await ctx.db.query.todos.findFirst({
            orderBy: (todos, { desc }) => [desc(todos.createdAt)],
        });

        return todo ?? null;
    }),
});
