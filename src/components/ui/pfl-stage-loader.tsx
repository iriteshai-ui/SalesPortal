"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PFLStageLoader({
  onComplete,
  title = "Pulse Loading",
  subtitle = "Analysing application parameters & records…",
}: {
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-in fade-in duration-500">
      <div className="w-80 max-w-full space-y-8 text-center">
        
        {/* Pulse Logo / Header Area (Approved BL Style) */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <motion.div 
            animate={{ scale: [1, 1.08, 1] }} 
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center w-24 h-24 bg-[#004499] rounded-full shadow-lg border-4 border-blue-100"
          >
            <span className="text-5xl font-black text-white">P</span>
          </motion.div>
          <h3 className="text-xl font-black text-slate-900 tracking-widest uppercase">
            Pulse <span className="text-[#004499]">Loading</span>
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 max-w-xs mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Modern Horizontal Loading Bar with Shimmer */}
        <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200 backdrop-blur-md">
          {/* Progress Fill */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-[#004499] to-indigo-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          {/* Glare / Shimmer Effect sliding across */}
          <motion.div 
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Optional Fast-Forward for Prototype Review */}
        <div>
          <button
            type="button"
            onClick={onComplete}
            className="text-[11px] font-bold text-slate-400 hover:text-[#004499] transition-colors"
          >
            ⚡ Fast-Forward (Skip 3s)
          </button>
        </div>

      </div>
    </div>
  );
}
