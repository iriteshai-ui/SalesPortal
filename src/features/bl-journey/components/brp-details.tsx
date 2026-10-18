"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Building2, Briefcase, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils";

const formSchema = z.object({
  businessName: z.string().min(3, "Business name is required"),
  natureOfBusiness: z.enum(["Trader", "Manufacturer"], {
    required_error: "Please select nature of business",
  }),
  dateOfIncorporation: z.date({
    required_error: "Date of incorporation is required",
  }).refine((date) => date <= new Date(), {
    message: "Date of incorporation cannot be in the future",
  }),
  businessPincode: z.string().length(6, "Pincode must be 6 digits"),
});

interface BrpDetailsProps {
  onComplete: (data: z.infer<typeof formSchema>) => void;
}

export default function BrpDetailsForm({ onComplete }: BrpDetailsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "Malhotra Enterprises",
      natureOfBusiness: "Trader",
      businessPincode: "400051",
      dateOfIncorporation: new Date("2015-06-20"),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onComplete(values);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">BRP Additional Details</h3>
        <p className="text-sm text-slate-500">
          As per the enhanced policy check, please provide the following business information.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registered Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input placeholder="Enter legal business name" className="pl-9 h-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="natureOfBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature of Business <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-slate-400" />
                              <SelectValue placeholder="Select type" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Trader">Trader</SelectItem>
                          <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfIncorporation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Incorporation <span className="text-red-500">*</span></FormLabel>
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
                            max={format(new Date(), "yyyy-MM-dd")}
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
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              fromYear={1900}
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

              <FormField
                control={form.control}
                name="businessPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Pincode <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input placeholder="6-digit pincode" className="pl-9 h-11" {...field} maxLength={6} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 bg-[#004499] hover:bg-[#003377] text-white font-bold shadow-lg">
            Complete Application
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Helper to wrap Card components since they might not be globally available in this specific import context if I don't import them
import { Card, CardContent } from "@/components/ui/card";
