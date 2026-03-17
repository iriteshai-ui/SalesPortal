import { Router } from "express";
import { loginSchema } from "@shared/schema";
import { verifyUserPassword } from "../storage";
import { signToken, requireAuth } from "../auth-middleware";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const user = await verifyUserPassword(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken({ userId: user.id, email: user.email, roleId: user.roleId });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      branch: user.branch,
      designation: user.designation,
      isActive: user.isActive,
      role: user.role
        ? { id: user.role.id, name: user.role.name, products: user.role.products }
        : null,
    },
  });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  const u = req.authUser!;
  return res.json({
    id: u.id,
    name: u.name,
    email: u.email,
    employeeId: u.employeeId,
    branch: u.branch,
    designation: u.designation,
    isActive: u.isActive,
    role: u.role ? { id: u.role.id, name: u.role.name, products: u.role.products } : null,
  });
});

export default router;
