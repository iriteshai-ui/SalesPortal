export const MOCK_USERS = [
  { id: "EMP-ADMIN-001", name: "Vikram Malhotra", role: "Admin",           email: "admin@nbfc.com",        password: "Admin@1234", products: ["BL","PL","EL","HL"] },
  { id: "EMP-ZSM-001",   name: "Zafar Khan",      role: "ZSM",             email: "zsm@nbfc.com",          password: "ZSM@2024",    products: ["BL","PL","EL","HL"] },
  { id: "EMP-RSM-001",   name: "Rajesh Singhal",  role: "RSM",             email: "rsm@nbfc.com",          password: "RSM@2024",    products: ["BL","PL","EL","HL"] },
  { id: "EMP-SM-001",    name: "Priya Sharma",    role: "Senior Manager",  email: "sm@nbfc.com",           password: "SM@2024",     products: ["BL","PL","EL"] },
  { id: "EMP-MGR-001",   name: "Arjun Verma",     role: "Sales Manager",   email: "mgr@nbfc.com",          password: "MGR@2024",    products: ["BL","PL"] },
  { id: "EMP-AGT-001",   name: "Rohit Joshi",     role: "Sales Agent",     email: "agent@nbfc.com",        password: "Agent@2024",  products: ["BL"] },
  { id: "EMP-AGT-002",   name: "Ananya Mehta",    role: "Sales Agent",     email: "agent2@nbfc.com",       password: "Agent@2024",  products: ["PL"] },
  { id: "EMP-SUPER-001", name: "Amit Patel",      role: "Super",           email: "super@nbfc.com",        password: "Super@2024",  products: ["BL","PL","EL","HL"] },
];

export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || "Sales Portal",
  COMPANY: process.env.NEXT_PUBLIC_APP_COMPANY || "PFL",
  MANAGEMENT_KEY: process.env.NEXT_PUBLIC_MANAGEMENT_KEY || "YOUR-SECURE-KEY",
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
};

