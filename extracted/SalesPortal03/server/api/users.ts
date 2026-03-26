import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth-middleware";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../storage";
import { createUserSchema, updateUserSchema } from "@shared/schema";

const router = Router();

// GET /api/users — admin only
router.get("/", requireAdmin, async (req, res) => {
  const all = await getAllUsers();
  return res.json(
    all.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      employeeId: u.employeeId,
      branch: u.branch,
      designation: u.designation,
      isActive: u.isActive,
      createdAt: u.createdAt,
      role: u.role ? { id: u.role.id, name: u.role.name, products: u.role.products } : null,
    }))
  );
});

// GET /api/users/:id — admin only
router.get("/:id", requireAdmin, async (req, res) => {
  const u = await getUserById(req.params.id);
  if (!u) return res.status(404).json({ message: "User not found" });
  return res.json({
    id: u.id,
    name: u.name,
    email: u.email,
    employeeId: u.employeeId,
    branch: u.branch,
    designation: u.designation,
    isActive: u.isActive,
    createdAt: u.createdAt,
    roleId: u.roleId,
    role: u.role ? { id: u.role.id, name: u.role.name, products: u.role.products } : null,
  });
});

// POST /api/users — admin only
router.post("/", requireAdmin, async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  try {
    const user = await createUser(parsed.data);
    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ message: "Email or Employee ID already exists." });
    throw err;
  }
});

// PUT /api/users/:id — admin only
router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  const user = await updateUser(req.params.id, parsed.data);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ id: user.id, name: user.name, email: user.email });
});

// DELETE /api/users/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  if (req.params.id === req.authUser!.id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }
  const ok = await deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ message: "User not found" });
  return res.json({ message: "User deleted successfully." });
});

export default router;
