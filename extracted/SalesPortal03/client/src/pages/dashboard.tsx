import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_LEADS } from "@/lib/mock-data";
import { PlusCircle, Search, Filter, Smartphone, ChevronRight, Link as LinkIcon, Mail, Copy, Plus, Trash2, CheckCircle2, Briefcase, User as UserIcon, GraduationCap, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const userProducts = user?.products ?? [];
  const hasBL = userProducts.includes("BL");
  const hasPL = userProducts.includes("PL");
  const hasEL = userProducts.includes("EL");
  const hasHL = userProducts.includes("HL");
  // tab count: Lead Dashboard + active products + Link Generation
  const tabCount = 2 + [hasBL, hasPL, hasEL, hasHL].filter(Boolean).length;
  const gridCols = tabCount <= 3 ? `grid-cols-${tabCount}` : tabCount === 4 ? "grid-cols-4" : tabCount === 5 ? "grid-cols-5" : "grid-cols-6";
  const [baseUrl, setBaseUrl] = useState("test.com");
  const [utmMedium, setUtmMedium] = useState("google");
  const [dsaCode, setDsaCode] = useState("123");
  const [refNo, setRefNo] = useState("abc");
  const [extraParams, setExtraParams] = useState<{ key: string; value: string }[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");

  const addParam = () => setExtraParams([...extraParams, { key: "", value: "" }]);
  const removeParam = (index: number) => setExtraParams(extraParams.filter((_, i) => i !== index));
  const updateParam = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...extraParams];
    updated[index][field] = val;
    setExtraParams(updated);
  };

  const generateUtm = () => {
    let url = baseUrl;
    const params = new URLSearchParams();
    if (utmMedium) params.append("utm_medium", utmMedium);
    if (dsaCode) params.append("dsa_code", dsaCode);
    if (refNo) params.append("reference_no", refNo);
    extraParams.forEach(p => {
      if (p.key && p.value) params.append(p.key, p.value);
    });

    const queryString = params.toString();
    setGeneratedLink(queryString ? `${url}?${queryString}` : url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied!",
      description: "UTM link copied to clipboard.",
    });
  };

  const sendEmail = () => {
    toast({
      title: "Email Triggered Successfully",
      description: "The UTM link has been queued for delivery.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className={`grid w-full max-w-3xl ${gridCols} mb-8 bg-slate-100 p-1`}>
          <TabsTrigger value="leads" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider">Lead Dashboard</TabsTrigger>
          {hasBL && <TabsTrigger value="create-bl" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider">BL Lead</TabsTrigger>}
          {hasPL && <TabsTrigger value="create-pl" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider">PL Lead</TabsTrigger>}
          {hasEL && <TabsTrigger value="create-el" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider">EL Lead</TabsTrigger>}
          {hasHL && <TabsTrigger value="create-hl" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider">HL Lead</TabsTrigger>}
          <TabsTrigger value="utm" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold uppercase tracking-wider">Link Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-8 mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900">Sales Overview</h1>
              <p className="text-slate-500 mt-1 italic">Track performance and initiate new applications.</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" onClick={() => setLocation("/dashboard")} className="border-slate-200 h-12 px-6 text-sm font-bold">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  View All Leads
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-[#004499] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900 tracking-tight">12</div>
                <div className="flex items-center text-xs text-amber-600 font-semibold mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
                  4 require attention
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disbursed MTD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900 tracking-tight">₹ 45.2L</div>
                <div className="flex items-center text-xs text-emerald-600 font-semibold mt-2">
                  <Plus className="w-3 h-3 mr-1" />
                  12% increase
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-slate-900 tracking-tight">8</div>
                <div className="flex items-center text-xs text-slate-500 font-semibold mt-2">
                  Target: 15 / month
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by name, mobile, or PAN..." className="pl-9 border-slate-200 bg-slate-50 h-11 focus:bg-white transition-colors" />
            </div>
            <Button variant="outline" className="text-slate-600 border-slate-200 h-11 px-5">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          <Card className="shadow-xl overflow-hidden border-slate-200 rounded-xl">
            <Table>
              <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Lead Details</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">PAN</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Stage</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Created</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-widest pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_LEADS.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-[#004499] transition-colors">{lead.name}</span>
                        <div className="flex items-center text-[11px] text-slate-400 mt-1 font-medium">
                          <Smartphone className="h-3 w-3 mr-1" />
                          {lead.mobile}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-slate-600 text-xs font-medium">{lead.pan}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50/50 text-[#004499] border-blue-100 font-bold text-[10px] uppercase tracking-tighter px-2">
                        {lead.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-slate-600">{lead.subStage}</span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-[11px] font-medium">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="text-[#004499] hover:text-white hover:bg-[#004499] rounded-lg h-8">
                        View Details
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="create-bl" className="mt-0">
          <div className="max-w-4xl mx-auto py-12 text-center space-y-6 animate-in fade-in zoom-in-95">
             <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                <Briefcase className="text-[#004499] h-10 w-10" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Business Loan Lead</h2>
                <p className="text-slate-500 font-medium">Initiate a new high-value business credit application.</p>
             </div>
             <Link href="/leads/new">
                <Button className="bg-[#004499] hover:bg-[#003377] h-14 px-12 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                   Launch BL Wizard
                </Button>
             </Link>
          </div>
        </TabsContent>

        <TabsContent value="create-pl" className="mt-0">
          <div className="max-w-4xl mx-auto py-12 text-center space-y-6 animate-in fade-in zoom-in-95">
             <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                <UserIcon className="text-[#004499] h-10 w-10" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Personal Loan Lead</h2>
                <p className="text-slate-500 font-medium">Initiate a new retail personal credit journey.</p>
             </div>
             <Link href="/leads/pl/new">
                <Button className="bg-[#004499] hover:bg-[#003377] h-14 px-12 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                   Launch PL Wizard
                </Button>
             </Link>
          </div>
        </TabsContent>

        <TabsContent value="create-el" className="mt-0">
          <div className="max-w-4xl mx-auto py-12 text-center space-y-6 animate-in fade-in zoom-in-95">
             <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto border border-blue-100">
                <GraduationCap className="text-[#004499] h-10 w-10" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Education Loan Lead</h2>
                <p className="text-slate-500 font-medium">Initiate a new assisted education loan journey.</p>
             </div>
             <Link href="/leads/el/new">
                <Button className="bg-[#004499] hover:bg-[#003377] h-14 px-12 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                   Launch EL Wizard
                </Button>
             </Link>
          </div>
        </TabsContent>

        <TabsContent value="create-hl" className="mt-0">
          <div className="max-w-4xl mx-auto py-12 text-center space-y-6 animate-in fade-in zoom-in-95">
             <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto border border-rose-100">
                <Heart className="text-rose-500 h-10 w-10" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Health Prime Lead</h2>
                <p className="text-slate-500 font-medium">Initiate a new healthcare finance journey.</p>
             </div>
             <Link href="/leads/hl/new">
                <Button className="bg-[#004499] hover:bg-[#003377] h-14 px-12 text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                   Launch HL Wizard
                </Button>
             </Link>
          </div>
        </TabsContent>

        <TabsContent value="utm" className="mt-0">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-heading font-bold text-slate-900">Link Generation</h1>
              <p className="text-slate-500 mt-1 italic text-sm">Create high-conversion tracking links for digital acquisition.</p>
            </div>

            <Card className="shadow-2xl border-slate-200/60 overflow-hidden rounded-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500" />
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Base URL</Label>
                  <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="test.com" className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-all" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">utm_medium</Label>
                    <Input value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="google" className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">dsa_code</Label>
                    <Input value={dsaCode} onChange={(e) => setDsaCode(e.target.value)} placeholder="123" className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">reference_no</Label>
                  <Input value={refNo} onChange={(e) => setRefNo(e.target.value)} placeholder="abc" className="bg-slate-50 border-slate-200 h-11 focus:bg-white transition-all" />
                </div>

                {extraParams.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block">Custom Query Parameters</Label>
                    {extraParams.map((param, index) => (
                      <div key={index} className="flex gap-3 items-center animate-in slide-in-from-left-4 duration-300">
                        <Input 
                          placeholder="Key" 
                          value={param.key} 
                          onChange={(e) => updateParam(index, 'key', e.target.value)} 
                          className="flex-1 bg-slate-50 border-slate-200 h-10 text-xs font-mono"
                        />
                        <Input 
                          placeholder="Value" 
                          value={param.value} 
                          onChange={(e) => updateParam(index, 'value', e.target.value)} 
                          className="flex-1 bg-slate-50 border-slate-200 h-10 text-xs font-mono"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeParam(index)} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button variant="ghost" size="sm" onClick={addParam} className="text-[#004499] hover:bg-blue-50 font-bold text-xs uppercase tracking-widest">
                    <Plus className="mr-2 h-4 w-4" />
                    Append Custom Parameter
                  </Button>
                </div>

                <Button onClick={generateUtm} className="w-full bg-[#004499] hover:bg-[#003377] h-12 mt-4 shadow-xl shadow-blue-100 text-base font-bold uppercase tracking-widest">
                  Generate Secure UTM Link
                </Button>
              </CardContent>
            </Card>

            {generatedLink && (
              <Card className="bg-emerald-50 border-emerald-100 shadow-xl animate-in zoom-in-95 duration-500 rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400" />
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.25em] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Encrypted Tracking Link
                    </span>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-emerald-100 break-all font-mono text-[13px] text-slate-700 shadow-inner leading-relaxed">
                    {generatedLink}
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 h-12 font-bold uppercase text-xs tracking-widest">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                    <Button onClick={sendEmail} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-bold uppercase text-xs tracking-widest shadow-lg shadow-emerald-100">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
