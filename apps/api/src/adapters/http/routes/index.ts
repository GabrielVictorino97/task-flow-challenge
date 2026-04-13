import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { taskRoutes } from "./task.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
