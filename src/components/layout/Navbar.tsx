"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, LogIn, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm" : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Image 
              src="http://www.shivaminformatics.com/public/Front/img/ShivamLogo3%20(2).png" 
              alt="Shivam Informatics" 
              width={48} 
              height={48}
              className="object-contain group-hover:scale-110 transition-transform"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-shivam-navy leading-none tracking-tighter text-lg">SHIVAM</span>
            <span className="text-[10px] text-shivam-blue font-black leading-none tracking-[0.2em]">INFORMATICS</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/check-in">Visitor Pass</NavLink>
          <NavLink href="/admin">Admin</NavLink>
          
          <Link 
            href="/login"
            className="bg-shivam-navy text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-shivam-blue transition-colors"
          >
            <LogIn size={18} />
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-shivam-navy" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-4 text-center shadow-lg"
        >
          <Link href="/dashboard" className="text-lg font-bold text-shivam-blue">Dashboard</Link>
          <Link href="/check-in" className="text-lg font-bold text-shivam-blue">Check-In</Link>
          <Link href="/admin" className="text-lg font-bold text-shivam-blue">Admin</Link>
          <hr className="border-slate-100" />
          <Link href="/login" className="bg-shivam-blue text-white py-3 rounded-xl font-bold hover:bg-shivam-gold transition-colors">Login</Link>
        </motion.div>
      )}
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-shivam-navy font-medium hover:text-shivam-blue transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-shivam-blue transition-all group-hover:w-full group-hover:left-0" />
    </Link>
  );
}
