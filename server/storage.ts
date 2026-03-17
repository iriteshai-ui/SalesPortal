import { db } from "./db";
import { users, roles, type User, type Role, type InsertUser, type InsertRole } from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

// ─── Roles ────────────────────────────────────────────────────────────────────
export async function getAllRoles(): Promise<Role[]> {
  return db.select().from(roles).orderBy(roles.name);
}

export async function getRoleById(id: string): Promise<Role | undefined> {
  const [r] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
  return r;
}

export async function createRole(data: InsertRole): Promise<Role> {
  const [r] = await db.insert(roles).values(data).returning();
  return r;
}

export async function updateRole(id: string, data: Partial<InsertRole>): Promise<Role | undefined> {
  const [r] = await db.update(roles).set(data).where(eq(roles.id, id)).returning();
  return r;
}

export async function deleteRole(id: string): Promise<boolean> {
  const result = await db.delete(roles).where(eq(roles.id, id));
  return (result.rowCount ?? 0) > 0;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export type UserWithRole = User & { role: Role | null };

export async function getAllUsers(): Promise<UserWithRole[]> {
  const rows = await db
    .select({
      user: users,
      role: roles,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .orderBy(users.createdAt);

  return rows.map(({ user, role }) => ({ ...user, role: role ?? null }));
}

export async function getUserById(id: string): Promise<UserWithRole | undefined> {
  const [row] = await db
    .select({ user: users, role: roles })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, id))
    .limit(1);
  if (!row) return undefined;
  return { ...row.user, role: row.role ?? null };
}

export async function getUserByEmail(email: string): Promise<UserWithRole | undefined> {
  const [row] = await db
    .select({ user: users, role: roles })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  if (!row) return undefined;
  return { ...row.user, role: row.role ?? null };
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  branch?: string;
  designation?: string;
  roleId: string;
  isActive?: boolean;
}): Promise<UserWithRole> {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      employeeId: data.employeeId,
      branch: data.branch,
      designation: data.designation,
      roleId: data.roleId,
      isActive: data.isActive ?? true,
    })
    .returning();
  return getUserById(user.id) as Promise<UserWithRole>;
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    employeeId?: string;
    branch?: string;
    designation?: string;
    roleId?: string;
    isActive?: boolean;
  }
): Promise<UserWithRole | undefined> {
  const update: Partial<InsertUser> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email.toLowerCase();
  if (data.password) update.passwordHash = await bcrypt.hash(data.password, 10);
  if (data.employeeId !== undefined) update.employeeId = data.employeeId;
  if (data.branch !== undefined) update.branch = data.branch;
  if (data.designation !== undefined) update.designation = data.designation;
  if (data.roleId !== undefined) update.roleId = data.roleId;
  if (data.isActive !== undefined) update.isActive = data.isActive;
  update.updatedAt = new Date();

  await db.update(users).set(update).where(eq(users.id, id));
  return getUserById(id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id));
  return (result.rowCount ?? 0) > 0;
}

export async function verifyUserPassword(email: string, password: string): Promise<UserWithRole | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.isActive) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
