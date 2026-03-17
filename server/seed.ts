import { db } from "./db";
import { roles, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SEED_ROLES = [
  { name: "Admin", description: "Full access to all products and user management", products: ["BL", "PL", "EL", "HL"] },
  { name: "BL Officer", description: "Business Loan sales officer", products: ["BL"] },
  { name: "PL Officer", description: "Personal Loan sales officer", products: ["PL"] },
  { name: "EL Officer", description: "Education Loan sales officer", products: ["EL"] },
  { name: "HL Officer", description: "Health Prime Loan sales officer", products: ["HL"] },
];

const SEED_USERS = [
  { name: "Vikram Malhotra", email: "admin@nbfc.com", password: "Admin@1234", employeeId: "NBFC-ADM-001", branch: "Head Office, Mumbai", designation: "Sales Head", roleName: "Admin" },
  { name: "Arjun Verma", email: "arjun.verma@nbfc.com", password: "BL@2024", employeeId: "NBFC-BL-002", branch: "Delhi NCR Zone", designation: "Senior Sales Officer", roleName: "BL Officer" },
  { name: "Priya Sharma", email: "priya.sharma@nbfc.com", password: "PL@2024", employeeId: "NBFC-PL-003", branch: "Bengaluru Central", designation: "Sales Officer", roleName: "PL Officer" },
  { name: "Rohit Joshi", email: "rohit.joshi@nbfc.com", password: "EL@2024", employeeId: "NBFC-EL-004", branch: "Pune West", designation: "Sales Officer", roleName: "EL Officer" },
  { name: "Ananya Mehta", email: "ananya.mehta@nbfc.com", password: "HL@2024", employeeId: "NBFC-HL-005", branch: "Hyderabad South", designation: "Sales Officer", roleName: "HL Officer" },
];

export async function seedDatabase() {
  try {
    // Seed roles
    const roleMap: Record<string, string> = {};
    for (const r of SEED_ROLES) {
      const existing = await db.select().from(roles).where(eq(roles.name, r.name)).limit(1);
      if (existing.length === 0) {
        const [created] = await db.insert(roles).values(r).returning();
        roleMap[r.name] = created.id;
        console.log(`[seed] Created role: ${r.name}`);
      } else {
        roleMap[r.name] = existing[0].id;
        console.log(`[seed] Role exists: ${r.name}`);
      }
    }

    // Seed users
    for (const u of SEED_USERS) {
      const existing = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
      if (existing.length === 0) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        await db.insert(users).values({
          name: u.name,
          email: u.email,
          passwordHash,
          employeeId: u.employeeId,
          branch: u.branch,
          designation: u.designation,
          roleId: roleMap[u.roleName],
          isActive: true,
        });
        console.log(`[seed] Created user: ${u.email}`);
      } else {
        console.log(`[seed] User exists: ${u.email}`);
      }
    }
    console.log("[seed] Database seeded successfully.");
  } catch (err) {
    console.error("[seed] Seed error:", err);
  }
}
