import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Steps
import BasicDetailsForm from "@/components/lead-flow/basic-details";
import ConsentStep from "@/components/lead-flow/consent-step";
import BusinessDetailsStep from "@/components/lead-flow/business-details";
import OfferDisplay from "@/components/lead-flow/offer-display";
import BrpDetailsForm from "@/components/lead-flow/brp-details";

const steps = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Consent" },
  { id: 3, title: "GST/Udyam" },
  { id: 4, title: "Offer" },
  { id: 5, title: "BRP Details" },
];

import { Check } from "lucide-react";

export default function LeadJourneyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [showBrp, setShowBrp] = useState(false);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  
  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    nextStep();
  };

  const handleOfferComplete = (requiresBrp: boolean) => {
    if (requiresBrp) {
      setShowBrp(true);
      setCurrentStep(5);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const activeSteps = showBrp ? steps : steps.slice(0, 4);
  const progressPercentage = Math.round(((currentStep - 1) / (activeSteps.length - 1)) * 100);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header / Stepper */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-[#004499]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            New Loan Application
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-bold text-[#004499] transition-all duration-500">{progressPercentage}% Complete</p>
            </div>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              ID: #NEW-{Math.floor(Math.random()*10000)}
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative py-4 px-2">
          {/* Background Track */}
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
          
          {/* Animated Progress Line */}
          <div 
            className="absolute top-1/2 left-0 h-1.5 bg-emerald-500 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
            style={{ width: `${progressPercentage}%` }}
          />
          
          <div className="relative flex justify-between items-center">
            {activeSteps.map((s) => {
              const isCompleted = currentStep > s.id;
              const isActive = currentStep === s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center group cursor-default">
                  <div 
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 z-10 
                      ${isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 scale-100" 
                        : isActive
                          ? "bg-white border-[#004499] text-[#004499] ring-4 ring-blue-50 scale-110 shadow-md"
                          : "bg-white border-slate-200 text-slate-300 scale-90"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 animate-in zoom-in duration-300" strokeWidth={3} />
                    ) : (
                      <span>{s.id}</span>
                    )}

                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {s.title} • {isCompleted ? 'Completed' : isActive ? 'Active' : 'Upcoming'}
                    </div>
                  </div>
                  <span className={`
                    mt-3 text-[11px] font-bold transition-colors duration-300 uppercase tracking-tighter
                    ${isActive ? "text-[#004499]" : isCompleted ? "text-emerald-600" : "text-slate-400"}
                  `}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
        {currentStep === 1 && <BasicDetailsForm onComplete={handleNext} />}
        {currentStep === 2 && (
          <ConsentStep 
            mobileNumber="9876543210" // Mock
            onConsentApproved={nextStep}
            onConsentRejected={() => alert("Consent Rejected - Journey Ends")}
          />
        )}
        {currentStep === 3 && <BusinessDetailsStep onComplete={handleNext} />}
        {currentStep === 4 && <OfferDisplay onComplete={handleOfferComplete} />}
        {currentStep === 5 && <BrpDetailsForm onComplete={(data: any) => window.location.href = "/dashboard"} />}
      </div>
    </div>
  );
}
