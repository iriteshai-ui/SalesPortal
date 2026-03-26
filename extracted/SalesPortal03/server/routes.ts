import type { Express } from "express";
import { type Server } from "http";
import { seedDatabase } from "./seed";
import authRouter from "./api/auth";
import usersRouter from "./api/users";
import rolesRouter from "./api/roles";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Seed DB with initial roles + users on startup
  await seedDatabase();

  // ─── API routes ───────────────────────────────────────────────────────────
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/roles", rolesRouter);

  return httpServer;
}
