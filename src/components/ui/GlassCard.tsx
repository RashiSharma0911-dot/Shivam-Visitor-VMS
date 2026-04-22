"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, delay = 0, hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-8 shadow-sm",
        hover && "hover:shadow-md transition-shadow duration-300",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
