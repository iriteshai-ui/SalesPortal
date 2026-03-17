import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth-middleware";
import { getAllRoles, createRole, updateRole, deleteRole } from "../storage";
import { insertRoleSchema } from "@shared/schema";

const router = Router();

// GET /api/roles — any authenticated user (needed for user-create form)
router.get("/", requireAuth, async (_req, res) => {
  const all = await getAllRoles();
  return res.json(all);
});

// POST /api/roles — admin only
router.post("/", requireAdmin, async (req, res) => {
  const parsed = insertRoleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  const role = await createRole(parsed.data);
  return res.status(201).json(role);
});

// PUT /api/roles/:id — admin only
router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = insertRoleSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  const role = await updateRole(req.params.id, parsed.data);
  if (!role) return res.status(404).json({ message: "Role not found" });
  return res.json(role);
});

// DELETE /api/roles/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  const ok = await deleteRole(req.params.id);
  if (!ok) return res.status(404).json({ message: "Role not found" });
  return res.json({ message: "Role deleted." });
});

export default router;
