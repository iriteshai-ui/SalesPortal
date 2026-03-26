import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { users, roles } from "@shared/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "salesassure-nbfc-secret-key-2024";

export interface AuthPayload {
  userId: string;
  email: string;
  roleId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        name: string;
        email: string;
        employeeId: string;
        branch: string | null;
        designation: string | null;
        isActive: boolean;
        role: {
          id: string;
          name: string;
          description: string | null;
          products: string[];
        } | null;
      };
    }
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }
  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        employeeId: users.employeeId,
        branch: users.branch,
        designation: users.designation,
        isActive: users.isActive,
        roleId: users.roleId,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized: user not found or inactive" });
    }

    let role = null;
    if (user.roleId) {
      const [r] = await db.select().from(roles).where(eq(roles.id, user.roleId)).limit(1);
      if (r) role = { id: r.id, name: r.name, description: r.description, products: r.products };
    }

    req.authUser = { ...user, role };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    if (req.authUser?.role?.name !== "Admin") {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }
    next();
  });
}
