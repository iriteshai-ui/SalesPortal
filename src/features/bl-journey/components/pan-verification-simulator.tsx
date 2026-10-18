"use client";
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
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, CreditCard, User, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/utils";

const formSchema = z.object({
  pan: z.string().length(10, "Invalid PAN format"),
  fullName: z.string().min(3, "Full name required"),
  dob: z.date({ required_error: "Date of Birth is required" }),
});

interface Props {
  onComplete: (data?: any) => void;
}

export default function PanVerificationSimulator({ onComplete }: Props) {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pan: "ABCDE1234F",
      fullName: "Vikram Malhotra",
      dob: new Date("1990-01-15"),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onComplete(values);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md mb-6">
        <h3 className="text-lg font-semibold text-slate-900">PAN Verification Simulator</h3>
        <p className="text-sm text-slate-500">
          Simulate the response of the Name/DOB match with PAN database.
        </p>
      </div>

      {!showForm ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 space-y-6 text-center">
            <h4 className="text-md font-bold text-slate-800">
              Select Bureau Verification Outcome
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onComplete()}
                className="flex flex-col items-center p-6 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-emerald-600 h-6 w-6" />
                </div>
                <p className="font-bold text-slate-900">Success</p>
                <p className="text-xs text-slate-500 mt-1">
                  100% Match found. Bypass manual entry.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex flex-col items-center p-6 bg-white border-2 border-slate-100 hover:border-rose-500 hover:bg-rose-50/30 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <XCircle className="text-rose-600 h-6 w-6" />
                </div>
                <p className="font-bold text-slate-900">No Match</p>
                <p className="text-xs text-slate-500 mt-1">
                  Mismatch in records. Require manual fallback entry.
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner animate-in slide-in-from-top-4 duration-500">
          <div className="mb-6">
            <h4 className="text-md font-bold text-slate-800">Fallback PAN Entry</h4>
            <p className="text-sm text-slate-500">Since it was a mismatch, please confirm the correct details.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input className="pl-9 uppercase font-mono h-11" {...field} maxLength={10} />
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
                      <FormLabel>Date of Birth</FormLabel>
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
                          />
                        </FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "px-3 font-normal border-slate-200 h-11 w-11 p-0 flex items-center justify-center",
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
                              initialFocus
                              fromYear={1940}
                              toYear={new Date().getFullYear()}
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
                      <FormLabel>Full Name (as per PAN)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input className="pl-9 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                 <Button 
                   type="button" 
                   variant="outline" 
                   onClick={() => setShowForm(false)}
                   className="h-11"
                 >
                   Back
                 </Button>
                <Button type="submit" className="bg-[#004499] hover:bg-[#003377] h-11">
                  Save & Proceed
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
