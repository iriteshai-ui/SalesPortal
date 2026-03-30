import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, Clock, MapPin, User, CreditCard, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PURPOSES = ["Business Expansion", "Working Capital", "Equipment Purchase", "Inventory Financing", "Office Renovation", "Debt Consolidation", "Others"];
const MARITAL = ["Single", "Married", "Divorced", "Widowed"];

const formSchema = z.object({
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  pan: z.string().length(10, "Invalid PAN format"),
  fullName: z.string().min(3, "Full name required"),
  email: z.string().email("Invalid email"),
  gender: z.string(),
  natureOfBusiness: z.string(),
  addressLine1: z.string().min(5, "Address required"),
  addressLine2: z.string().optional(),
  pincode: z.string().length(6, "Invalid pincode"),
  city: z.string(),
  state: z.string(),
  dob: z.date().refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    const month = new Date().getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && new Date().getDate() < date.getDate())) {
      return age - 1 >= 21;
    }
    return age >= 21;
  }, "Minimum age must be 21 years"),
  purposeOfLoan: z.string().optional(),
  fatherName: z.string().optional(),
  maritalStatus: z.string().optional(),
});

type CaseType = "new" | "wip" | "rejected" | null;

interface BasicDetailsProps {
  onComplete: (data: z.infer<typeof formSchema>) => void;
  mobile?: string;
}

export default function BasicDetailsForm({ onComplete, mobile: prefillMobile }: BasicDetailsProps) {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseType>(prefillMobile ? "new" : null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: prefillMobile ?? "",
      pan: "ABCDE1234F",
      fullName: "Vikram Malhotra",
      email: "vikram.m@example.com",
      gender: "Male",
      natureOfBusiness: "Services",
      addressLine1: "123 Business Park, BKC",
      addressLine2: "Near ICICI Bank",
      pincode: "400051",
      city: "Mumbai",
      state: "Maharashtra",
      dob: new Date("1990-01-15"),
      purposeOfLoan: "",
      fatherName: "",
      maritalStatus: "",
    },
  });

  const mobileValue = form.watch("mobile");

  const checkStatus = () => {
    if (mobileValue.length !== 10) return;
    setCheckingStatus(true);
    setStatusChecked(false);
    setSelectedCase(null);

    // Simulate 5s loader
    setTimeout(() => {
      setCheckingStatus(false);
      setStatusChecked(true);
    }, 5000);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedCase !== "new") return;
    onComplete(values);
  }

  if (checkingStatus) {
    return (
      <Card className="border-0 shadow-none bg-slate-50/50 py-12">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">Validating Mobile Number</h3>
            <p className="text-sm text-slate-500">Checking existing applications in our records...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statusChecked && !selectedCase) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">Verification Result</h3>
          <p className="text-sm text-slate-500 mt-1">Select the appropriate case type for {mobileValue}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            type="button"
            onClick={() => setSelectedCase("new")}
            className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="text-emerald-600 h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">New Case</p>
              <p className="text-xs text-slate-500">No existing record found. Proceed to creation.</p>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedCase("wip")}
            className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50/30 rounded-xl transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Clock className="text-amber-600 h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">WIP Case</p>
              <p className="text-xs text-slate-500">Application #APP-847291-X is already in progress.</p>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedCase("rejected")}
            className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-red-500 hover:bg-red-50/30 rounded-xl transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <AlertCircle className="text-red-600 h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Rejected Case</p>
              <p className="text-xs text-slate-500">Application #APP-102938-R was recently declined.</p>
            </div>
          </button>
        </div>
        
        <Button variant="ghost" onClick={() => setStatusChecked(false)} className="w-full text-slate-400">
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-l-4 border-blue-600 pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Customer Details</h3>
        <p className="text-sm text-slate-500">
          Enter details as per official documents (PAN/Aadhaar). These details will be used for CIBIL check.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#004499] font-bold">Mobile Number</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="Enter 10 digit mobile" 
                        {...field} 
                        className="bg-white text-lg h-12 tracking-widest font-mono"
                        maxLength={10}
                        disabled={selectedCase !== null}
                      />
                    </FormControl>
                    {!selectedCase && (
                      <Button 
                        type="button" 
                        onClick={checkStatus}
                        disabled={field.value.length !== 10}
                        className="bg-[#004499] h-12 px-6"
                      >
                        Check Status
                      </Button>
                    )}
                    {selectedCase && !prefillMobile && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setSelectedCase(null);
                          setStatusChecked(false);
                        }}
                        className="h-12"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {selectedCase === "new" ? (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="ABCDE1234F" className="pl-9 uppercase font-mono" {...field} maxLength={10} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            type="date"
                            className="h-11"
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const d = new Date(e.target.value);
                              if (!isNaN(d.getTime())) field.onChange(d);
                            }}
                            max={format(new Date(new Date().setFullYear(new Date().getFullYear() - 21)), "yyyy-MM-dd")}
                          />
                        </FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "px-3 text-left font-normal border-slate-200 h-11 w-11 p-0 flex items-center justify-center",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date(new Date().setFullYear(new Date().getFullYear() - 21)) || date < new Date("1900-01-01")
                              }
                              initialFocus
                              fromYear={1940}
                              toYear={new Date().getFullYear() - 21}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (as per PAN) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="Enter full name" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-200 h-11">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="customer@example.com" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="natureOfBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature of Business <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-200 h-11">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Retail">Retail Trade</SelectItem>
                          <SelectItem value="Wholesale">Wholesale Trade</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b pb-2">Communication Address</h4>
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1 <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="Shop No, Building Name" className="pl-9 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="400001" className="h-11" {...field} maxLength={6} onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value.length === 6) {
                              form.setValue("city", "Mumbai");
                              form.setValue("state", "Maharashtra");
                            }
                          }}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-slate-100 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-slate-100 h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Details — optional */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  Additional Details
                  <span className="text-[10px] normal-case font-medium text-slate-400 tracking-normal">(Optional)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="purposeOfLoan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">Purpose of Loan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-slate-200 h-11">
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">Father's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Father's full name" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600">Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-slate-200 h-11">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MARITAL.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" className="bg-[#004499] hover:bg-[#003377] w-full md:w-auto">
                  Save & Proceed to Consent
                </Button>
              </div>
            </div>
          ) : selectedCase !== null ? (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-300 mt-6">
              {selectedCase === "wip" ? (
                <>
                  <Clock className="h-10 w-10 text-amber-500" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Case In Progress</h4>
                    <p className="text-sm text-slate-500 max-w-sm">
                      An application for this mobile number is already active in our system (APP-847291-X). Duplicate leads cannot be created.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-10 w-10 text-red-500" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Lead Restricted</h4>
                    <p className="text-sm text-slate-500 max-w-sm">
                      A recent application (APP-102938-R) for this number was rejected. New lead creation is cooling off for 90 days.
                    </p>
                  </div>
                </>
              )}
              <Button type="button" variant="outline" className="mt-4" onClick={() => {
                setSelectedCase(null);
                setStatusChecked(false);
              }}>
                Try Another Number
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
    </div>
  );
}
