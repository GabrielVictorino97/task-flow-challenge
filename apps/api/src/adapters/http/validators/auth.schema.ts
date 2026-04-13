import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(64)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64)
});
