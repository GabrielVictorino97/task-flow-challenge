import { z } from "zod";

const taskStatusSchema = z.enum(["pending", "in_progress", "done"]);

export const taskParamsSchema = z.object({
  id: z.string().min(1)
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: taskStatusSchema.optional()
});

export const bulkCreateTaskSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        description: z.string().max(1000).optional(),
        status: taskStatusSchema.optional()
      })
    )
    .min(1)
    .max(1000)
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional(),
    status: taskStatusSchema.optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided"
  });
