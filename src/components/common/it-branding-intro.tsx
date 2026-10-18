"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Terminal, Shield, Zap } from "lucide-react";

export default function ITBrandingIntro({ 
  productName, 
  onFinish 
}: { 
  productName: string; 
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500; // 2.5s for the fake loading
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);
      
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onFinish, 600); // brief pause at 100% before transition
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden"
      >
        {/* Futuristic Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,68,153,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,68,153,0.15)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] opacity-40 mix-blend-screen" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#004499] rounded-full blur-[140px] opacity-40 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400 rounded-full blur-[100px] opacity-20 mix-blend-screen" />

        <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center">
          {/* PFL IT Header Banner */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="flex items-center gap-3 mb-12 bg-slate-900/60 backdrop-blur-xl px-8 py-3 rounded-full border border-slate-700 shadow-[0_0_40px_rgba(0,68,153,0.4)]"
          >
            <div className="relative">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div className="absolute inset-0 blur-md bg-cyan-400/80 rounded-full mix-blend-screen" />
            </div>
            <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-cyan-300 font-bold uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Engineered by PFL Information Technology
            </span>
          </motion.div>

          {/* Pulse App Branding */}
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.4, type: "spring", damping: 15 }}
             className="text-center mb-20"
          >
             <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-slate-400 tracking-tight mb-6 drop-shadow-[0_4px_25px_rgba(0,68,153,0.5)]">
                {productName}
             </h1>
             <motion.div 
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="flex items-center justify-center gap-2 text-cyan-200/70 font-mono text-sm tracking-widest uppercase"
             >
               <Zap className="w-4 h-4 text-cyan-400" />
               <span>Secure Channel Initialized</span>
             </motion.div>
          </motion.div>

          {/* Artificial Initialization Progress */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-md space-y-4"
          >
            <div className="flex justify-between items-end font-mono text-xs uppercase tracking-widest">
              <span className="text-cyan-400 flex items-center gap-2 glow">
                <Terminal className="w-4 h-4" />
                Loading Modules
              </span>
              <span className="text-white font-bold text-sm bg-slate-800 px-2 py-1 rounded">{progress}%</span>
            </div>
            
            <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 shadow-inner p-0.5">
               <motion.div 
                  className="absolute inset-y-0.5 left-0.5 rounded-full bg-gradient-to-r from-[#004499] via-blue-500 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                  style={{ width: `calc(${progress}% - 4px)` }}
               />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
