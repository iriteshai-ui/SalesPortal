import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2, ShieldCheck, User as UserIcon, Search, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Role { id: string; name: string; products: string[]; description: string | null; }
interface MgmtUser {
  id: string; name: string; email: string; employeeId: string;
  branch: string | null; designation: string | null; isActive: boolean;
  createdAt: string; roleId?: string;
  role: { id: string; name: string; products: string[] } | null;
}

const PRODUCT_COLORS: Record<string, string> = {
  BL: "bg-blue-100 text-blue-700 border-blue-200",
  PL: "bg-violet-100 text-violet-700 border-violet-200",
  EL: "bg-amber-100 text-amber-700 border-amber-200",
  HL: "bg-rose-100 text-rose-700 border-rose-200",
};

const EMPTY_FORM = { name: "", email: "", password: "", employeeId: "", branch: "", designation: "", roleId: "", isActive: true };

export default function UserManagementPage() {
  const { token, user: authUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [users, setUsers] = useState<MgmtUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<MgmtUser | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MgmtUser | null>(null);

  // Guard: admin only
  useEffect(() => {
    if (authUser && authUser.role?.name !== "Admin") {
      setLocation("/dashboard");
    }
  }, [authUser]);

  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  async function fetchData() {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        fetch("/api/users", { headers: authHeaders }),
        fetch("/api/roles", { headers: authHeaders }),
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (rRes.ok) setRoles(await rRes.json());
    } catch { toast({ variant: "destructive", title: "Error", description: "Failed to load data." }); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ ...EMPTY_FORM });
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = async (u: MgmtUser) => {
    // Fetch full user (with roleId) for the form
    const res = await fetch(`/api/users/${u.id}`, { headers: authHeaders });
    const full = await res.json();
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, password: "", employeeId: u.employeeId, branch: u.branch || "", designation: u.designation || "", roleId: full.roleId || "", isActive: u.isActive });
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required.";
    if (!editingUser && form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (editingUser && form.password && form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (!form.employeeId.trim()) errs.employeeId = "Employee ID is required.";
    if (!form.roleId) errs.roleId = "Role is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const body: any = { name: form.name, email: form.email, employeeId: form.employeeId, branch: form.branch, designation: form.designation, roleId: form.roleId, isActive: form.isActive };
    if (!editingUser || form.password) body.password = form.password;

    const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
    const method = editingUser ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: "Error", description: data.message || "Save failed." });
      } else {
        toast({ title: editingUser ? "User Updated" : "User Created", description: `${form.name} has been ${editingUser ? "updated" : "added"}.` });
        setShowForm(false);
        fetchData();
      }
    } catch { toast({ variant: "destructive", title: "Network error", description: "Please try again." }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: "DELETE", headers: authHeaders });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: "Error", description: data.message });
      } else {
        toast({ title: "User Deleted", description: `${deleteTarget.name} has been removed.` });
        fetchData();
      }
    } catch { toast({ variant: "destructive", title: "Network error", description: "Please try again." }); }
    finally { setDeleteTarget(null); }
  };

  const filtered = users.filter((u) =>
    [u.name, u.email, u.employeeId, u.role?.name || ""].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#004499]" /> User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage users, roles, and product access control.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-1.5">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" onClick={openCreate} className="bg-[#004499] hover:bg-[#003377] gap-1.5">
            <PlusCircle className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, color: "text-slate-700" },
          { label: "Active", value: users.filter((u) => u.isActive).length, color: "text-emerald-600" },
          { label: "Inactive", value: users.filter((u) => !u.isActive).length, color: "text-rose-500" },
          { label: "Roles", value: roles.length, color: "text-[#004499]" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, employee ID, role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004499]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs font-black uppercase tracking-widest text-slate-500">Employee</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-slate-500">Role</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-slate-500">Products</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-slate-500">Branch</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-slate-500">Status</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">No users found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => (
                    <TableRow key={u.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-700">{u.role?.name || <span className="text-slate-400">—</span>}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {u.role?.products.length === 4 ? (
                            <Badge className="text-[10px] font-black bg-emerald-100 text-emerald-700 border-emerald-200 border">All</Badge>
                          ) : u.role?.products.length ? (
                            u.role.products.map((p) => (
                              <Badge key={p} className={`text-[10px] font-black border ${PRODUCT_COLORS[p] || "bg-slate-100 text-slate-600 border-slate-200"}`}>{p}</Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{u.branch || <span className="text-slate-400">—</span>}</TableCell>
                      <TableCell>
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(u)} className="h-8 px-2 hover:bg-blue-50 hover:text-[#004499]">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {u.id !== authUser?.id && (
                            <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(u)} className="h-8 px-2 hover:bg-rose-50 hover:text-rose-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>{editingUser ? `Updating details for ${editingUser.name}` : "Create a new sales officer account."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Vikram Malhotra" className="bg-slate-50" />
                {formErrors.name && <p className="text-xs text-rose-500">{formErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Employee ID *</Label>
                <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="NBFC-XXX-001" className="bg-slate-50 font-mono text-xs" />
                {formErrors.employeeId && <p className="text-xs text-rose-500">{formErrors.employeeId}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@nbfc.com" className="bg-slate-50" />
              {formErrors.email && <p className="text-xs text-rose-500">{formErrors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{editingUser ? "New Password (leave blank to keep)" : "Password *"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="bg-slate-50" />
              {formErrors.password && <p className="text-xs text-rose-500">{formErrors.password}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Designation</Label>
                <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Sales Officer" className="bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Branch</Label>
                <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="Mumbai HO" className="bg-slate-50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Role *</Label>
              <select
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:border-[#004499] focus:ring-2 focus:ring-[#004499]/10 transition-all"
              >
                <option value="">Select a role…</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.products.length === 4 ? "All Products" : r.products.join(", ") || "No Products"}
                  </option>
                ))}
              </select>
              {formErrors.roleId && <p className="text-xs text-rose-500">{formErrors.roleId}</p>}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#004499] accent-[#004499]"
              />
              <Label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">Active account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#004499] hover:bg-[#003377]">
              {saving ? "Saving…" : editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
