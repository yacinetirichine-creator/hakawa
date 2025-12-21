import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const variants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-orient-gold/10 text-orient-gold border border-orient-gold/20",
  success: "bg-green-100 text-green-800 border border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  danger: "bg-red-100 text-red-800 border border-red-200",
  outline: "bg-transparent border border-gray-200 text-gray-600",
};

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
