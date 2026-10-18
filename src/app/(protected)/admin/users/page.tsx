"use client";

// ─── Imports ─────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Pencil,
  ShieldCheck,
  User as UserIcon,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Users,
  Activity,
  ArrowRightLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppRole {
  level: number;
  name: string;
  label: string;
  color: string;
}

interface ManagementUser {
  employeeCode: string;
  name: string;
  roleName: string;
  roleLevel: number;
  products: string[];
  email: string;
  mobile: string;
  reportingManagerCode: string;
  status: "Active" | "Inactive";
  lastLoginDate: string;
  createdAt: string;
  createdBy: string;
  createdByIp: string;
  updatedAt?: string;
  updatedBy?: string;
  updatedByIp?: string;
  updatesCount?: number;
}

interface CaseRecord {
  id: string;
  name: string;
  mobile: string;
  pan: string;
  stage: string;
  subStage: string;
  createdAt: string;
  currentAgent: string;
  currentAgentCode: string;
}

interface AuditLogRecord {
  id: string;
  actionType: "CREATE_USER" | "UPDATE_USER" | "REASSIGN_CASE";
  performedBy: string;
  targetId: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

type UserFormState = {
  employeeCode: string;
  name: string;
  email: string;
  mobile: string;
  roleName: string;
  products: string[];
  reportingManagerCode: string;
  status: "Active" | "Inactive";
};

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES: AppRole[] = [
  { level: 1, name: "Sales Agent",    label: "L1: Sales Agent",                  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { level: 2, name: "Sales Manager",  label: "L2: Sales Manager",                color: "bg-cyan-50 text-cyan-700 border-cyan-200"           },
  { level: 3, name: "Senior Manager", label: "L3: Senior Manager",               color: "bg-blue-50 text-blue-700 border-blue-200"           },
  { level: 4, name: "RSM",            label: "L4: RSM (Regional Sales Manager)", color: "bg-indigo-50 text-indigo-700 border-indigo-200"     },
  { level: 5, name: "ZSM",            label: "L5: ZSM (Zonal Sales Manager)",    color: "bg-violet-50 text-violet-700 border-violet-200"     },
  { level: 6, name: "Admin",          label: "L6: Admin",                        color: "bg-rose-50 text-rose-700 border-rose-200"           },
  { level: 6, name: "Super",          label: "L6: Super",                        color: "bg-amber-50 text-amber-700 border-amber-200"        },
];

const PRODUCT_COLORS: Record<string, string> = {
  BL: "bg-blue-100 text-blue-700 border-blue-200",
  PL: "bg-violet-100 text-violet-700 border-violet-200",
  EL: "bg-amber-100 text-amber-700 border-amber-200",
  HL: "bg-rose-100 text-rose-700 border-rose-200",
};

const PRODUCTS = ["BL", "PL", "EL", "HL"] as const;

const EMPTY_FORM: UserFormState = {
  employeeCode: "",
  name: "",
  email: "",
  mobile: "",
  roleName: "",
  products: [],
  reportingManagerCode: "",
  status: "Active",
};

// ─── Mock Seed Data ───────────────────────────────────────────────────────────
const SEED_USERS: ManagementUser[] = [
  {
    employeeCode: "EMP-ADMIN-001",
    name: "Vikram Malhotra",
    roleName: "Admin",
    roleLevel: 6,
    products: ["BL", "PL", "EL", "HL"],
    email: "admin@nbfc.com",
    mobile: "9876543210",
    reportingManagerCode: "",
    status: "Active",
    lastLoginDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    createdBy: "System Installer",
    createdByIp: "127.0.0.1",
  },
  {
    employeeCode: "EMP-ZSM-001",
    name: "Zafar Khan",
    roleName: "ZSM",
    roleLevel: 5,
    products: ["BL", "PL", "EL", "HL"],
    email: "zsm@nbfc.com",
    mobile: "9876543211",
    reportingManagerCode: "EMP-ADMIN-001",
    status: "Active",
    lastLoginDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    createdBy: "Vikram Malhotra (EMP-ADMIN-001)",
    createdByIp: "192.168.12.11",
  },
  {
    employeeCode: "EMP-RSM-001",
    name: "Rajesh Singhal",
    roleName: "RSM",
    roleLevel: 4,
    products: ["BL", "PL", "EL", "HL"],
    email: "rsm@nbfc.com",
    mobile: "9876543212",
    reportingManagerCode: "EMP-ZSM-001",
    status: "Active",
    lastLoginDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    createdBy: "Zafar Khan (EMP-ZSM-001)",
    createdByIp: "192.168.12.18",
  },
  {
    employeeCode: "EMP-SM-001",
    name: "Priya Sharma",
    roleName: "Senior Manager",
    roleLevel: 3,
    products: ["BL", "PL", "EL"],
    email: "sm@nbfc.com",
    mobile: "9876543213",
    reportingManagerCode: "EMP-RSM-001",
    status: "Active",
    lastLoginDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    createdBy: "Rajesh Singhal (EMP-RSM-001)",
    createdByIp: "192.168.12.22",
  },
  {
    employeeCode: "EMP-MGR-001",
    name: "Arjun Verma",
    roleName: "Sales Manager",
    roleLevel: 2,
    products: ["BL", "PL"],
    email: "mgr@nbfc.com",
    mobile: "9876543214",
    reportingManagerCode: "EMP-SM-001",
    status: "Active",
    lastLoginDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    createdBy: "Priya Sharma (EMP-SM-001)",
    createdByIp: "192.168.12.25",
  },
  {
    employeeCode: "EMP-AGT-001",
    name: "Rohit Joshi",
    roleName: "Sales Agent",
    roleLevel: 1,
    products: ["BL"],
    email: "agent@nbfc.com",
    mobile: "9876543215",
    reportingManagerCode: "EMP-MGR-001",
    status: "Active",
    lastLoginDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdBy: "Arjun Verma (EMP-MGR-001)",
    createdByIp: "192.168.12.31",
  },
  {
    employeeCode: "EMP-AGT-002",
    name: "Ananya Mehta",
    roleName: "Sales Agent",
    roleLevel: 1,
    products: ["PL"],
    email: "agent2@nbfc.com",
    mobile: "9876543216",
    reportingManagerCode: "EMP-MGR-001",
    status: "Active",
    lastLoginDate: new Date(Date.now() - 12 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdBy: "Arjun Verma (EMP-MGR-001)",
    createdByIp: "192.168.12.31",
  },
];

const SEED_CASES: CaseRecord[] = [
  {
    id: "LD-2023-001",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    pan: "ABCDE1234F",
    stage: "New",
    subStage: "Data Capture",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    currentAgent: "Rohit Joshi",
    currentAgentCode: "EMP-AGT-001",
  },
  {
    id: "LD-2023-002",
    name: "Priya Sharma",
    mobile: "9988776655",
    pan: "FGHIJ5678K",
    stage: "Pre-Offer",
    subStage: "Consent Pending",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    currentAgent: "Ananya Mehta",
    currentAgentCode: "EMP-AGT-002",
  },
  {
    id: "LD-2023-003",
    name: "Amit Patel",
    mobile: "9123456789",
    pan: "KLMNO9012P",
    stage: "Offer Generated",
    subStage: "Link Sent",
    createdAt: new Date().toISOString().split("T")[0],
    currentAgent: "Rohit Joshi",
    currentAgentCode: "EMP-AGT-001",
  },
];

const SEED_AUDIT: AuditLogRecord[] = [
  {
    id: "audit-1",
    actionType: "CREATE_USER",
    performedBy: "System Installer",
    targetId: "All Setup",
    description: "System database initialized with hierarchy levels L1–L6 setup.",
    timestamp: new Date().toISOString(),
    ipAddress: "127.0.0.1",
  },
];

// ─── Utility Helpers ──────────────────────────────────────────────────────────
function calculateLastActiveDays(dateStr: string): string {
  if (!dateStr) return "N/A";
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function getRandomIp(): string {
  return `192.168.12.${Math.floor(Math.random() * 254) + 1}`;
}

function maskMobile(mobile: string): string {
  const s = mobile?.trim() ?? "";
  return s.length < 10 ? s : `${s.slice(0, 2)}******${s.slice(-2)}`;
}

function maskPan(pan: string): string {
  const s = pan?.trim() ?? "";
  return s.length < 10 ? s : `${s.slice(0, 3)}*****${s.slice(-2)}`;
}

// ─── Storage Helpers ──────────────────────────────────────────────────────────
const LS_USERS = "sales_portal_users";
const LS_LEADS = "sales_portal_leads";
const LS_AUDIT = "sales_portal_audit_logs";

function loadFromStorage<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored) as T[];
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [users, setUsers] = useState<ManagementUser[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [activeTab, setActiveTab] = useState("user-mgmt");
  const [searchUser, setSearchUser] = useState("");
  const [searchCase, setSearchCase] = useState("");

  // User form dialog
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagementUser | null>(null);
  const [form, setForm] = useState<UserFormState>({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Case reassignment dialog
  const [reassignCase, setReassignCase] = useState<CaseRecord | null>(null);
  const [selectedAgentCode, setSelectedAgentCode] = useState("");

  // ─── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (authUser && !["Admin", "Super", "ZSM"].includes(authUser.role?.name || "")) {
      router.push("/dashboard");
    }
  }, [authUser, router]);

  useEffect(() => {
    setUsers(loadFromStorage(LS_USERS, SEED_USERS));
    setCases(loadFromStorage(LS_LEADS, SEED_CASES));
    setAuditLogs(loadFromStorage(LS_AUDIT, SEED_AUDIT));
  }, []);

  // ─── Derived / Filtered Data ─────────────────────────────────────────────
  const sortedUsers = [...users].sort((a, b) =>
    b.roleLevel !== a.roleLevel ? b.roleLevel - a.roleLevel : a.name.localeCompare(b.name)
  );

  const filteredUsers = sortedUsers.filter((u) =>
    [u.name, u.email, u.employeeCode, u.roleName].some((v) =>
      v.toLowerCase().includes(searchUser.toLowerCase())
    )
  );

  const filteredCases = cases.filter((c) =>
    [c.id, c.name, c.mobile, c.pan, c.currentAgent].some((v) =>
      v.toLowerCase().includes(searchCase.toLowerCase())
    )
  );

  const selectedRole = ROLES.find((r) => r.name === form.roleName);

  // Managers must be at a higher level than the selected role
  const managerOptions = selectedRole
    ? users.filter((u) => u.roleLevel > selectedRole.level && u.status === "Active")
    : [];

  // Only active L1 / L2 officers can be assigned leads
  const activeAgentOptions = users.filter(
    (u) => [1, 2].includes(u.roleLevel) && u.status === "Active"
  );

  // ─── User Form Actions ───────────────────────────────────────────────────
  function openCreate() {
    setEditingUser(null);
    setForm({ ...EMPTY_FORM });
    setFormErrors({});
    setShowForm(true);
  }

  function openEdit(u: ManagementUser) {
    setEditingUser(u);
    setForm({
      employeeCode: u.employeeCode,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      roleName: u.roleName,
      products: [...u.products],
      reportingManagerCode: u.reportingManagerCode,
      status: u.status,
    });
    setFormErrors({});
    setShowForm(true);
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!form.employeeCode.trim()) {
      errors.employeeCode = "Employee Code is required.";
    } else if (!editingUser && users.some((u) => u.employeeCode.toLowerCase() === form.employeeCode.trim().toLowerCase())) {
      errors.employeeCode = "Employee Code must be unique.";
    }
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = "Valid email is required.";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) errors.mobile = "Valid 10-digit mobile number is required.";
    if (!form.roleName) errors.roleName = "Role selection is required.";
    if (form.products.length === 0) errors.products = "Select at least one product.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSaveUser() {
    if (!validateForm()) return;
    setSaving(true);

    const actor = authUser ? `${authUser.name} (${authUser.employeeId})` : "Administrator";
    const ip = getRandomIp();
    const now = new Date().toISOString();
    const roleLevel = ROLES.find((r) => r.name === form.roleName)?.level ?? 1;

    setTimeout(() => {
      let updatedUsers: ManagementUser[];
      let newLog: AuditLogRecord;

      if (editingUser) {
        // Build a human-readable changelog
        const changes: string[] = [];
        if (editingUser.name !== form.name) changes.push(`Name: '${editingUser.name}' → '${form.name}'`);
        if (editingUser.email !== form.email) changes.push(`Email: '${editingUser.email}' → '${form.email}'`);
        if (editingUser.mobile !== form.mobile) changes.push(`Mobile changed`);
        if (editingUser.roleName !== form.roleName) changes.push(`Role: '${editingUser.roleName}' → '${form.roleName}'`);
        if (editingUser.reportingManagerCode !== form.reportingManagerCode) {
          changes.push(`Manager: '${editingUser.reportingManagerCode || "None"}' → '${form.reportingManagerCode || "None"}'`);
        }
        if (editingUser.status !== form.status) changes.push(`Status: '${editingUser.status}' → '${form.status}'`);

        const desc = changes.length > 0
          ? `Updated ${form.employeeCode}: ${changes.join(", ")}`
          : `Profile settings updated for ${form.employeeCode}`;

        newLog = {
          id: `audit-${Date.now()}`,
          actionType: "UPDATE_USER",
          performedBy: actor,
          targetId: form.employeeCode,
          description: desc,
          timestamp: now,
          ipAddress: ip,
        };

        updatedUsers = users.map((u) =>
          u.employeeCode === editingUser.employeeCode
            ? {
                ...u,
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                roleName: form.roleName,
                roleLevel,
                products: form.products,
                reportingManagerCode: form.reportingManagerCode,
                status: form.status,
                updatedAt: now,
                updatedBy: actor,
                updatedByIp: ip,
                updatesCount: (u.updatesCount || 0) + 1,
              }
            : u
        );

        toast({ title: "User Updated", description: `${form.name} was updated successfully.` });
      } else {
        newLog = {
          id: `audit-${Date.now()}`,
          actionType: "CREATE_USER",
          performedBy: actor,
          targetId: form.employeeCode,
          description: `Created ${form.name} (${form.employeeCode}) — L${roleLevel}: ${form.roleName}.`,
          timestamp: now,
          ipAddress: ip,
        };

        const newUser: ManagementUser = {
          employeeCode: form.employeeCode.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          roleName: form.roleName,
          roleLevel,
          products: form.products,
          reportingManagerCode: form.reportingManagerCode,
          status: form.status,
          lastLoginDate: "",
          createdAt: now,
          createdBy: actor,
          createdByIp: ip,
        };

        updatedUsers = [...users, newUser];
        toast({ title: "User Created", description: `${form.name} was created successfully.` });
      }

      const updatedLogs = [newLog, ...auditLogs];
      setUsers(updatedUsers);
      setAuditLogs(updatedLogs);
      saveToStorage(LS_USERS, updatedUsers);
      saveToStorage(LS_AUDIT, updatedLogs);
      setShowForm(false);
      setSaving(false);
    }, 400);
  }

  function handleProductToggle(product: string) {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  }

  // ─── Case Reassignment Actions ───────────────────────────────────────────
  function openReassign(c: CaseRecord) {
    setReassignCase(c);
    setSelectedAgentCode(c.currentAgentCode);
  }

  function handleSaveReassignment() {
    if (!reassignCase || !selectedAgentCode) return;
    const newAgent = users.find((u) => u.employeeCode === selectedAgentCode);
    if (!newAgent) return;

    const actor = authUser ? `${authUser.name} (${authUser.employeeId})` : "Administrator";
    const ip = getRandomIp();
    const now = new Date().toISOString();

    const updatedCases = cases.map((c) =>
      c.id === reassignCase.id
        ? { ...c, currentAgent: newAgent.name, currentAgentCode: newAgent.employeeCode }
        : c
    );

    const newLog: AuditLogRecord = {
      id: `audit-${Date.now()}`,
      actionType: "REASSIGN_CASE",
      performedBy: actor,
      targetId: reassignCase.id,
      description: `Reassigned Case #${reassignCase.id} (${reassignCase.name}) from ${reassignCase.currentAgent} (${reassignCase.currentAgentCode}) to ${newAgent.name} (${newAgent.employeeCode}).`,
      timestamp: now,
      ipAddress: ip,
    };

    const updatedLogs = [newLog, ...auditLogs];
    setCases(updatedCases);
    setAuditLogs(updatedLogs);
    saveToStorage(LS_LEADS, updatedCases);
    saveToStorage(LS_AUDIT, updatedLogs);

    toast({
      title: "Case Reassigned",
      description: `Case #${reassignCase.id} routed to ${newAgent.name}.`,
    });
    setReassignCase(null);
  }

  function handleResetDB() {
    localStorage.removeItem(LS_USERS);
    localStorage.removeItem(LS_LEADS);
    localStorage.removeItem(LS_AUDIT);
    window.location.reload();
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#004499]" />
            Management Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access-restricted controls for user provisioning, reporting structure, and lead routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-[#004499] px-2.5 py-1 text-xs font-semibold select-none flex gap-1 items-center"
          >
            <Activity className="h-3 w-3 text-cyan-500 animate-pulse" />
            Authority Level: {authUser?.role?.name || "ZSM"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDB}
            className="gap-1 text-slate-500 hover:text-[#004499]"
            title="Reset to default mock database"
          >
            <RefreshCw className="h-4 w-4" /> Reset DB
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-slate-100 p-1">
          <TabsTrigger
            value="user-mgmt"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" /> User Management
          </TabsTrigger>
          <TabsTrigger
            value="case-reassign"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" /> Case Reassignment
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: User Management ───────────────────────────────────────── */}
        <TabsContent value="user-mgmt" className="space-y-6 mt-0">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Officers",  value: users.length,                                  icon: Users,        color: "text-slate-700"   },
              { label: "Active Staff",    value: users.filter((u) => u.status === "Active").length,   icon: CheckCircle2, color: "text-emerald-600" },
              { label: "Inactive Staff",  value: users.filter((u) => u.status === "Inactive").length, icon: XCircle,      color: "text-rose-500"    },
              { label: "Audit Records",   value: auditLogs.length,                              icon: Activity,     color: "text-[#004499]"   },
            ].map((stat) => (
              <Card key={stat.label} className="border-slate-200 shadow-sm relative overflow-hidden">
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                    <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 opacity-10 absolute right-3 bottom-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* User Directory Table */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, role, email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-9 bg-slate-50 border-slate-200"
                />
              </div>
              <Button onClick={openCreate} className="bg-[#004499] hover:bg-[#003377] gap-1.5 self-start">
                <PlusCircle className="h-4 w-4" /> Add Officer Account
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-100">
                    {["Employee Details", "Role Rank", "Product Scope", "Mobile", "Reporting Manager", "Status", "Last Active", "Actions"].map((h) => (
                      <TableHead key={h} className={`text-[10px] font-black uppercase tracking-widest text-slate-500${h === "Actions" ? " text-right" : ""}`}>
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                        No officers found matching search parameters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => {
                      const roleMeta = ROLES.find((r) => r.name === u.roleName);
                      const badgeClass = roleMeta?.color ?? "bg-slate-100 text-slate-700";
                      const manager = users.find((m) => m.employeeCode === u.reportingManagerCode);

                      return (
                        <TableRow key={u.employeeCode} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                          {/* Employee */}
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600">
                                <UserIcon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm text-slate-900 leading-tight">{u.name}</span>
                                <span className="text-xs text-slate-400">{u.email}</span>
                                <span className="text-[10px] font-mono text-slate-400 mt-0.5">{u.employeeCode}</span>
                              </div>
                            </div>
                          </TableCell>
                          {/* Role */}
                          <TableCell>
                            <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border ${badgeClass}`}>
                              L{u.roleLevel}: {u.roleName}
                            </Badge>
                          </TableCell>
                          {/* Products */}
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {u.products.map((p) => (
                                <Badge key={p} className={`text-[9px] font-black uppercase border ${PRODUCT_COLORS[p] ?? "bg-slate-100 text-slate-600"}`}>
                                  {p}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          {/* Mobile */}
                          <TableCell className="text-sm font-medium text-slate-600 font-mono">{u.mobile}</TableCell>
                          {/* Manager */}
                          <TableCell className="text-sm">
                            {manager ? (
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-700">{manager.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">({manager.employeeCode})</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Top Hierarchy</span>
                            )}
                          </TableCell>
                          {/* Status */}
                          <TableCell>
                            {u.status === "Active" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                <XCircle className="h-3 w-3" /> Inactive
                              </span>
                            )}
                          </TableCell>
                          {/* Last Active */}
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-600">
                                {u.lastLoginDate ? new Date(u.lastLoginDate).toLocaleDateString() : "Never"}
                              </span>
                              {u.lastLoginDate && (
                                <span className="text-[10px] text-slate-400 italic">
                                  ({calculateLastActiveDays(u.lastLoginDate)})
                                </span>
                              )}
                            </div>
                          </TableCell>
                          {/* Actions */}
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEdit(u)}
                              className="h-8 w-8 p-0 text-slate-400 hover:bg-blue-50 hover:text-[#004499]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Case Reassignment ─────────────────────────────────────── */}
        <TabsContent value="case-reassign" className="space-y-6 mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Search System Leads</CardTitle>
              <CardDescription>
                Search cases globally by mobile, applicant name, PAN card, or Case ID to route them.
              </CardDescription>
              <div className="relative mt-4 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Enter Mobile, Application ID, PAN, Agent..."
                  value={searchCase}
                  onChange={(e) => setSearchCase(e.target.value)}
                  className="pl-9 bg-slate-50 border-slate-200"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-100">
                    {["Case ID", "Applicant Details", "Mobile", "PAN ID", "Case Status", "Current Assigned Agent", "Route Control"].map((h) => (
                      <TableHead key={h} className={`text-[10px] font-black uppercase tracking-widest text-slate-500${h === "Route Control" ? " text-right" : ""}`}>
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                        No leads match the query.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCases.map((c) => (
                      <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                        <TableCell className="font-mono text-sm font-semibold text-[#004499]">{c.id}</TableCell>
                        <TableCell>
                          <span className="font-bold text-slate-800">{c.name}</span>
                        </TableCell>
                        <TableCell className="font-mono text-sm font-medium text-slate-600">{maskMobile(c.mobile)}</TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-slate-500">{maskPan(c.pan)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge variant="outline" className="w-fit bg-blue-50/50 text-[#004499] border-blue-100 font-bold text-[9px] uppercase px-2 py-0.5">
                              {c.stage}
                            </Badge>
                            <span className="text-[11px] text-slate-500 mt-0.5 font-medium">{c.subStage}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                              <UserIcon className="h-3 w-3" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{c.currentAgent}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({c.currentAgentCode})</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openReassign(c)}
                            className="text-[#004499] border-blue-200 hover:bg-[#004499] hover:text-white rounded-lg gap-1.5 h-8 font-bold text-xs"
                          >
                            <ArrowRightLeft className="h-3 w-3" /> Reassign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Audit Trail (always visible) ──────────────────────────────────── */}
      <Card className="border-slate-200 shadow-lg relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#004499]" />
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-[#004499]" /> Chronological Audit Logs
            </CardTitle>
            <CardDescription>
              Real-time records of officer creations, directory changes, and case routing.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const csvRows = auditLogs.map(
                (log) =>
                  `"${log.timestamp}","${log.actionType}","${log.performedBy}","${log.targetId}","${log.ipAddress}","${log.description.replace(/"/g, '""')}"`
              );
              const blob = new Blob(
                [`Timestamp,Action,Operator,Target,IP Address,Description\n${csvRows.join("\n")}`],
                { type: "text/csv" }
              );
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("href", url);
              a.setAttribute("download", `audit-trail-${Date.now()}.csv`);
              a.click();
            }}
            className="text-xs text-[#004499] hover:bg-blue-50 font-bold uppercase tracking-wider"
          >
            Export Logs
          </Button>
        </CardHeader>
        <CardContent className="p-0 max-h-[350px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 sticky top-0 backdrop-blur-sm z-10">
              <TableRow className="border-slate-100">
                {["Timestamp", "Event Type", "Operator", "Target ID", "IP Address", "Event Details"].map((h) => (
                  <TableHead key={h} className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-3">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/30 border-slate-100 text-xs font-medium">
                  <TableCell className="font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-black uppercase tracking-tight ${
                        log.actionType === "CREATE_USER"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : log.actionType === "UPDATE_USER"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {log.actionType.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">{log.performedBy}</TableCell>
                  <TableCell className="font-mono text-slate-500 font-semibold">{log.targetId}</TableCell>
                  <TableCell className="font-mono text-[11px] text-slate-400">{log.ipAddress}</TableCell>
                  <TableCell className="text-slate-600 leading-relaxed max-w-sm truncate" title={log.description}>
                    {log.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Add / Edit Officer Dialog ──────────────────────────────────────── */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex gap-1.5 items-center">
              {editingUser ? <Pencil className="h-5 w-5 text-[#004499]" /> : <PlusCircle className="h-5 w-5 text-[#004499]" />}
              {editingUser ? "Modify Officer Profile" : "Provision New Officer Account"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? `Update authority details and products for Employee ID ${form.employeeCode}.`
                : "Register a new sales directory account aligned with the NBFC hierarchy level."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-slate-800">
            {/* Employee Code & Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Code *</Label>
                <Input
                  value={form.employeeCode}
                  onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
                  placeholder="EMP-AGT-003"
                  className="bg-slate-50 border-slate-200 font-mono text-xs"
                  disabled={!!editingUser}
                />
                {formErrors.employeeCode && <p className="text-xs text-rose-500 font-medium">{formErrors.employeeCode}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Deshmukh"
                  className="bg-slate-50 border-slate-200"
                />
                {formErrors.name && <p className="text-xs text-rose-500 font-medium">{formErrors.name}</p>}
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@nbfc.com"
                  className="bg-slate-50 border-slate-200"
                />
                {formErrors.email && <p className="text-xs text-rose-500 font-medium">{formErrors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile Number *</Label>
                <Input
                  type="text"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
                  placeholder="9823000000"
                  className="bg-slate-50 border-slate-200 font-mono"
                />
                {formErrors.mobile && <p className="text-xs text-rose-500 font-medium">{formErrors.mobile}</p>}
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hierarchy Level / Role *</Label>
              <select
                value={form.roleName}
                onChange={(e) => setForm({ ...form, roleName: e.target.value, reportingManagerCode: "" })}
                className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:border-[#004499] focus:ring-2 focus:ring-[#004499]/10 transition-all cursor-pointer font-medium"
              >
                <option value="">Select hierarchy level...</option>
                {ROLES.filter((r) => r.name !== "Super").map((r) => (
                  <option key={r.name} value={r.name}>{r.label}</option>
                ))}
              </select>
              {formErrors.roleName && <p className="text-xs text-rose-500 font-medium">{formErrors.roleName}</p>}
            </div>

            {/* Reporting Manager */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Reporting Manager {selectedRole && selectedRole.level < 6 && "*"}
              </Label>
              <select
                value={form.reportingManagerCode}
                onChange={(e) => setForm({ ...form, reportingManagerCode: e.target.value })}
                disabled={!form.roleName || (selectedRole?.level ?? 0) >= 6}
                className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:border-[#004499] focus:ring-2 focus:ring-[#004499]/10 transition-all cursor-pointer disabled:opacity-50 font-medium"
              >
                {selectedRole && selectedRole.level >= 6 ? (
                  <option value="">No Reporting Manager Required (Top Level)</option>
                ) : (
                  <>
                    <option value="">Select reporting manager (L{selectedRole?.level ?? "?"}+)...</option>
                    {managerOptions.map((mgr) => (
                      <option key={mgr.employeeCode} value={mgr.employeeCode}>
                        {mgr.name} ({mgr.employeeCode}) — L{mgr.roleLevel}: {mgr.roleName}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {form.roleName && selectedRole && selectedRole.level < 6 && !form.reportingManagerCode && (
                <p className="text-[10px] text-amber-600 font-bold italic">
                  Managers are filtered to roles higher than L{selectedRole.level}.
                </p>
              )}
            </div>

            {/* Products */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Scope Authorization *</Label>
              <div className="flex gap-4 flex-wrap bg-slate-50 border border-slate-100 rounded-lg p-3">
                {PRODUCTS.map((prod) => (
                  <label key={prod} className="flex items-center gap-2 font-semibold text-sm cursor-pointer select-none text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.products.includes(prod)}
                      onChange={() => handleProductToggle(prod)}
                      className="h-4 w-4 rounded border-slate-300 text-[#004499] accent-[#004499]"
                    />
                    {prod} Loan
                  </label>
                ))}
              </div>
              {formErrors.products && <p className="text-xs text-rose-500 font-medium">{formErrors.products}</p>}
            </div>

            {/* Status + Update Count */}
            <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={form.status === "Active"}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? "Active" : "Inactive" })}
                  className="h-4 w-4 rounded border-slate-300 text-[#004499] accent-[#004499]"
                />
                <Label htmlFor="isActiveToggle" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Active Directory Access
                </Label>
              </div>
              {editingUser && (
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Updates: {editingUser.updatesCount || 0}
                </span>
              )}
            </div>

            {/* Edit metadata (only shown when editing) */}
            {editingUser && (
              <div className="text-[10px] space-y-0.5 text-slate-400 bg-slate-100/50 p-2.5 rounded-lg border border-slate-100">
                <p>
                  <strong>Created By:</strong> {editingUser.createdBy} on{" "}
                  {new Date(editingUser.createdAt).toLocaleString()} (IP: {editingUser.createdByIp})
                </p>
                {editingUser.updatedBy && (
                  <p>
                    <strong>Last Edit:</strong> {editingUser.updatedBy} on{" "}
                    {new Date(editingUser.updatedAt!).toLocaleString()} (IP: {editingUser.updatedByIp})
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSaveUser} disabled={saving} className="bg-[#004499] hover:bg-[#003377] font-bold">
              {saving ? "Processing..." : editingUser ? "Save Profile" : "Register Officer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Case Reassignment Dialog ───────────────────────────────────────── */}
      <Dialog open={!!reassignCase} onOpenChange={(open) => !open && setReassignCase(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-1.5 items-center">
              <ArrowRightLeft className="h-5 w-5 text-[#004499]" /> Reassign Lead Route
            </DialogTitle>
            <DialogDescription>
              Reroute lead files dynamically to active officers in the L1/L2 sales network.
            </DialogDescription>
          </DialogHeader>

          {reassignCase && (
            <div className="space-y-4 py-2 text-slate-800">
              {/* Case summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 space-y-1.5 text-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Case Target Details</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <p><strong>Case ID:</strong> <span className="font-mono text-[#004499]">{reassignCase.id}</span></p>
                  <p><strong>PAN:</strong> <span className="font-mono">{maskPan(reassignCase.pan)}</span></p>
                  <p className="col-span-2"><strong>Applicant:</strong> {reassignCase.name} ({maskMobile(reassignCase.mobile)})</p>
                  <p className="col-span-2"><strong>Current Agent:</strong> {reassignCase.currentAgent} ({reassignCase.currentAgentCode})</p>
                </div>
              </div>

              {/* Agent selector */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assign New Lead Agent *</Label>
                <select
                  value={selectedAgentCode}
                  onChange={(e) => setSelectedAgentCode(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:border-[#004499] focus:ring-2 focus:ring-[#004499]/10 transition-all cursor-pointer font-semibold"
                >
                  <option value="" disabled>Select active agent...</option>
                  {activeAgentOptions.map((agent) => (
                    <option key={agent.employeeCode} value={agent.employeeCode}>
                      {agent.name} ({agent.employeeCode}) — L{agent.roleLevel}: {agent.roleName}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Only active L1 (Sales Agent) and L2 (Sales Manager) officers are authorized for lead routing.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignCase(null)}>Cancel</Button>
            <Button
              onClick={handleSaveReassignment}
              className="bg-[#004499] hover:bg-[#003377] font-bold"
              disabled={!selectedAgentCode || selectedAgentCode === reassignCase?.currentAgentCode}
            >
              Confirm Route Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
