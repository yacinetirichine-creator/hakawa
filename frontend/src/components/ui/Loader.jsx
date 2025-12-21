import React from "react";
import { motion } from "framer-motion";

export function Loader({ size = "md", className }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizes[size]} ${className}`}
    >
      {/* Outer Ring */}
      <motion.span
        className="absolute w-full h-full border-4 border-orient-gold/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Ring */}
      <motion.span
        className="absolute w-3/4 h-3/4 border-4 border-t-orient-gold border-r-transparent border-b-transparent border-l-transparent rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Center Dot */}
      <motion.div
        className="w-2 h-2 bg-orient-purple rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}
