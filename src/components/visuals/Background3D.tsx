"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Background3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const brands = [
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", size: 80, top: "15%", left: "10%", delay: 0 },
    { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", size: 100, top: "75%", left: "15%", delay: 2 },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg", size: 60, top: "25%", left: "80%", delay: 1 },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", size: 55, top: "65%", left: "85%", delay: 3 },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg", size: 70, top: "85%", left: "55%", delay: 1.5 },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg", size: 65, top: "10%", left: "50%", delay: 2.5 }
  ];

  return (
    <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden pointer-events-none">
      {/* Subtle modern grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Floating Corporate Icons */}
      {brands.map((brand, i) => (
        <motion.img
          key={i}
          src={brand.src}
          className="absolute opacity-20 grayscale"
          style={{ width: brand.size, top: brand.top, left: brand.left }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: brand.delay,
            ease: "easeInOut"
          }}
          alt="Brand Partner Icon"
        />
      ))}
      
      {/* Radial soft fade overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,rgba(255,255,255,0.2),rgba(255,255,255,1))]"></div>
    </div>
  );
}
