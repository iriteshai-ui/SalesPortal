"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MOCK_GST_RECORDS, MOCK_UDYAM_RECORDS } from "@/utils/mock-data";
import { Building, Factory } from "lucide-react";

interface BusinessDetailsProps {
  onComplete: () => void;
}

export default function BusinessDetailsStep({ onComplete }: BusinessDetailsProps) {
  const [selectedGst, setSelectedGst] = useState<string>("");
  const [selectedUdyam, setSelectedUdyam] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"gst" | "udyam">("gst");

  const handleNext = () => {
    if (activeTab === "gst") {
      setActiveTab("udyam");
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      
      {/* GST Section */}
      <Card className={`border transition-all duration-300 ${activeTab === 'gst' ? 'ring-2 ring-[#004499] ring-offset-2' : 'opacity-60 grayscale'}`}>
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded text-[#004499]">
              <Building size={20} />
            </div>
            <CardTitle className="text-lg">Select GST Registration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup value={selectedGst} onValueChange={setSelectedGst}>
            <div className="grid gap-4">
              {MOCK_GST_RECORDS.map((record, index) => (
                <div key={record.gstin} className="relative">
                  <RadioGroupItem value={record.gstin} id={record.gstin} className="peer sr-only" />
                  <Label
                    htmlFor={record.gstin}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 peer-data-[state=checked]:border-[#004499] peer-data-[state=checked]:bg-blue-50/30 cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{record.legalName}</p>
                      <p className="text-sm text-slate-500 font-mono">GSTIN: {record.gstin}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right text-xs text-slate-500">
                      <p>Incorp: {record.incorporationDate}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Udyam Section */}
      <Card className={`border transition-all duration-300 ${activeTab === 'udyam' ? 'ring-2 ring-[#004499] ring-offset-2' : 'opacity-60 grayscale'}`}>
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-100 rounded text-amber-700">
              <Factory size={20} />
            </div>
            <CardTitle className="text-lg">Select UDYAM Registration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup value={selectedUdyam} onValueChange={setSelectedUdyam} disabled={activeTab !== 'udyam'}>
            <div className="grid gap-4">
              {MOCK_UDYAM_RECORDS.map((record) => (
                <div key={record.udyamNumber} className="relative">
                  <RadioGroupItem value={record.udyamNumber} id={record.udyamNumber} className="peer sr-only" />
                  <Label
                    htmlFor={record.udyamNumber}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 peer-data-[state=checked]:border-[#004499] peer-data-[state=checked]:bg-blue-50/30 cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{record.enterpriseType} Enterprise</p>
                      <p className="text-sm text-slate-500 font-mono">{record.udyamNumber}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right text-xs text-slate-500">
                      <p>Incorp: {record.incorporationDate}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleNext} 
          disabled={(activeTab === 'gst' && !selectedGst) || (activeTab === 'udyam' && !selectedUdyam)}
          size="lg" 
          className="bg-[#004499] hover:bg-[#003377] w-full md:w-auto"
        >
          {activeTab === 'gst' ? "Confirm GST & Next" : "Confirm Udyam & Check Offer"}
        </Button>
      </div>

    </div>
  );
}
