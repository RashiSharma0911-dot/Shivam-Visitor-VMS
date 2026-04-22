"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Zap, Users, BarChart3, Star } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center px-6 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-6xl w-full pt-16 pb-24 text-center relative">
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-shivam-blue/10 text-shivam-blue font-bold mb-8 text-sm">
          <span>Visitor Management Portal</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-shivam-blue mb-6 tracking-tight leading-tight">
          Welcome to <span className="text-shivam-gold drop-shadow-md">Shivam Informatics</span>
        </h1>
        
        <p className="text-lg text-shivam-blue/80 font-medium max-w-xl mx-auto mb-12">
          A simple, secure, and fast way to manage visitors, track entries, and issue digital passes.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            href="/check-in"
            className="group bg-shivam-blue text-white px-12 py-6 rounded-full font-black text-xl flex items-center gap-3 hover:bg-shivam-gold hover:text-shivam-navy transition-all shadow-[0_20px_50px_rgba(0,140,219,0.3)] transform hover:scale-105"
          >
            GET VISITOR PASS
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <Link 
            href="/dashboard"
            className="px-12 py-6 rounded-full font-black text-xl border-2 border-shivam-blue text-shivam-blue hover:bg-shivam-gold hover:text-shivam-blue hover:border-shivam-gold transition-all shadow-md"
          >
            LIVE ANALYTICS
          </Link>
        </div>
      </section>

      {/* Features Grid with Yellow Highlights */}
      <section className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
        <FeatureCard 
          icon={<Users className="text-shivam-blue" size={28} />}
          title="Quick Check-In"
          description="Easy visitor registration process with instant live photo capture."
          delay={0.1}
          highlight
          onClick={() => router.push("/check-in")}
        />
        <FeatureCard 
          icon={<BarChart3 className="text-shivam-gold" size={28} />}
          title="Live Status"
          description="View all ongoing and past visits in a simple, organized dashboard."
          delay={0.2}
          onClick={() => router.push("/dashboard")}
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-shivam-blue" size={28} />}
          title="Simple Approvals"
          description="Admins can verify records and approve or reject visits instantly."
          delay={0.3}
          highlight
          onClick={() => router.push("/admin")}
        />
      </section>

      <footer className="w-full max-w-7xl border-t border-shivam-navy/10 py-16 flex flex-col items-center opacity-80 mt-auto">
        <div className="flex items-center gap-4 mb-8">
            <img 
              src="http://www.shivaminformatics.com/public/Front/img/ShivamLogo3%20(2).png" 
              className="h-12 w-auto object-contain"
              alt="Shivam Informatics"
            />
          <div className="flex flex-col">
            <span className="font-black text-shivam-blue tracking-widest text-xl">SHIVAM INFORMATICS</span>
            <span className="text-xs font-bold text-shivam-gold tracking-[0.4em]">WWW.SHIVAMINFORMATICS.COM</span>
          </div>
        </div>
        <p className="text-sm font-medium text-shivam-navy/40">© 2026 Shivam Informatics. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay, highlight = false, onClick }: { icon: React.ReactNode, title: string, description: string, delay: number, highlight?: boolean, onClick?: () => void }) {
  return (
    <GlassCard delay={delay} onClick={onClick} className={cn("flex flex-col gap-6", highlight && "border-shivam-gold/30 shadow-shivam-gold/5 shadow-2xl")}>
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner", highlight ? "bg-shivam-gold/10" : "bg-shivam-blue/10")}>
        {icon}
      </div>
      <h3 className={cn("text-2xl font-black", highlight ? "text-shivam-gold" : "text-shivam-blue")}>{title}</h3>
      <p className="text-shivam-blue/80 leading-relaxed font-semibold">
        {description}
      </p>
    </GlassCard>
  );
}
