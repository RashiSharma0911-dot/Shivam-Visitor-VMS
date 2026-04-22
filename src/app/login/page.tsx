"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate network delay
    setTimeout(() => {
      if (email === "admin@shivaminformatics.com" && password === "shivam123") {
        // Authenticated
        localStorage.setItem("shivam_admin", "true");
        router.push("/admin");
      } else {
        // Invalid credentials
        setIsLoading(false);
        setError("Invalid email or password. Access Denied.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-shivam-gold/20 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-shivam-gold/20 outline outline-4 outline-offset-4 outline-shivam-blue/10"
          >
            <ShieldCheck size={40} className="text-shivam-gold" />
          </motion.div>
          <h1 className="text-3xl font-serif font-black text-shivam-navy mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-shivam-navy/60 font-medium">Securely access the Shivam Informatics dashboard.</p>
        </div>

        <GlassCard hover={false} className="border-t-4 border-t-shivam-gold shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center justify-center"
              >
                {error}
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-shivam-navy/50 px-1 uppercase tracking-widest">Enterprise Email</label>
              <div className="flex items-center gap-3 bg-white/50 border border-shivam-navy/10 rounded-2xl p-4 focus-within:border-shivam-blue focus-within:ring-4 ring-shivam-blue/10 transition-all shadow-inner">
                <span className="text-shivam-navy/30"><UserCircle size={20} /></span>
                <input 
                  type="email" 
                  required
                  placeholder="admin@shivaminformatics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-shivam-navy font-bold placeholder:text-shivam-navy/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-shivam-navy/50 px-1 uppercase tracking-widest">Password</label>
              <div className="flex items-center gap-3 bg-white/50 border border-shivam-navy/10 rounded-2xl p-4 focus-within:border-shivam-blue focus-within:ring-4 ring-shivam-blue/10 transition-all shadow-inner">
                <span className="text-shivam-navy/30"><Lock size={20} /></span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-shivam-navy font-bold tracking-widest placeholder:text-shivam-navy/20 placeholder:tracking-normal"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded text-shivam-blue focus:ring-shivam-blue border-shivam-navy/20 cursor-pointer" />
                <span className="text-sm font-medium text-shivam-navy/60 group-hover:text-shivam-navy transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-shivam-blue hover:text-shivam-gold transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !email || !password}
              className={cn(
                "mt-2 w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-shivam-blue/20",
                isLoading 
                  ? "bg-shivam-navy/10 text-shivam-navy/40 cursor-wait" 
                  : "bg-shivam-blue text-white hover:bg-shivam-gold hover:text-shivam-navy hover:shadow-shivam-gold/30 active:scale-95"
              )}
            >
              {isLoading ? (
                <span className="animate-pulse flex items-center gap-2">
                  AUTHENTICATING...
                </span>
              ) : (
                <>
                  SECURE LOGIN <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs font-bold text-shivam-navy/30 uppercase tracking-widest mt-8">
          Protected by AES-256 Encryption
        </p>
      </div>
    </div>
  );
}
