"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 15, scale: 0.95, z: -100 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
      exit={{ opacity: 0, rotateY: -15, scale: 0.95, z: -100 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      style={{ perspective: "1200px" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
