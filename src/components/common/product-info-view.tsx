import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Zap, ShieldCheck, Briefcase, User, GraduationCap, Heart, Rocket } from "lucide-react";
import React from "react";

export type ProductType = "BL" | "PL" | "EL" | "HL";

interface ProductInfo {
  title: string;
  motto: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  insights: string;
  target: string;
}

const PRODUCT_DETAILS: Record<ProductType, ProductInfo> = {
  BL: {
    title: "Pulse Business Loan",
    motto: "Empower local businesses with world-class capital.",
    icon: <Briefcase className="w-12 h-12" />,
    color: "from-blue-600 to-indigo-700",
    benefits: [
      "Collateral-free loans up to ₹75 Lakhs",
      "Special interest rates for MSMEs",
      "Approval within 24 business hours",
      "Minimal documentation — GST based"
    ],
    insights: "Digital-first assessment ensures you can close high-value business deals faster than any traditional bank.",
    target: "SME Owners, Retailers, Manufacturers"
  },
  PL: {
    title: "Pulse Personal Loan",
    motto: "Turn dreams into reality with Pulse PL.",
    icon: <User className="w-12 h-12" />,
    color: "from-blue-500 to-cyan-600",
    benefits: [
      "Instant disbursement for urgent needs",
      "Zero hidden charges, transparent pricing",
      "Flexible repayment up to 60 months",
      "Top-up facilities for existing users"
    ],
    insights: "Personal loans have the highest conversion rate. Focus on salaried professionals for instant digital matching.",
    target: "Salaried Professionals, Young Workers"
  },
  EL: {
    title: "Pulse Education Loan",
    motto: "Invest in the future leaders of the world.",
    icon: <GraduationCap className="w-12 h-12" />,
    color: "from-teal-500 to-emerald-600",
    benefits: [
      "Domestic and International study coverage",
      "Moratorium period — pay after study",
      "Section 80E Income Tax benefits",
      "Fast-track processing for top universities"
    ],
    insights: "Tap into the growing segment of international education. High average ticket size means more commission per lead.",
    target: "Students, Aspiring Professionals"
  },
  HL: {
    title: "Pulse Healthcare Loan",
    motto: "Health comes first, finance second.",
    icon: <Heart className="w-12 h-12" />,
    color: "from-rose-500 to-pink-600",
    benefits: [
      "Zero interest EMI options available",
      "Emergency medical funding in 4 hours",
      "Co-pay gap financing for insurance",
      "Easy approval on minimal income proof"
    ],
    insights: "Medical emergencies need compassion and speed. Pulse HL is built for the fastest medical disbursal in the industry.",
    target: "Patients, Family Members, Caregivers"
  }
};

export default function ProductInfoView({ 
  product, 
  onConfirm 
}: { 
  product: ProductType;
  onConfirm: () => void;
}) {
  const info = PRODUCT_DETAILS[product];

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-3xl shadow-xl mt-6 border border-slate-200">
      <div className={`h-40 bg-gradient-to-br ${info.color} relative overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-2xl"
        >
          {info.icon}
        </motion.div>
        <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">High Conversion</span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{info.title}</h2>
          <p className="text-slate-500 font-medium italic">{info.motto}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#004499]" />
              Key Benefits
            </h4>
            <ul className="space-y-3">
              {info.benefits.map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 relative group">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                Agent Insights
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {info.insights}
              </p>
            </div>

            <div className="space-y-2">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 Target Audience
               </h4>
               <div className="flex flex-wrap gap-2">
                 {info.target.split(", ").map((t) => (
                   <span key={t} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-200">
                     {t}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 pt-0 flex sm:justify-center border-t border-slate-100 mt-2">
         <Button 
           onClick={onConfirm}
           className={`w-full max-w-sm mx-auto mt-4 h-14 bg-gradient-to-r ${info.color} text-white font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3`}
         >
           <Rocket className="w-5 h-5 animate-bounce" />
           Start Pulse Journey
         </Button>
      </div>
    </div>
  );
}
