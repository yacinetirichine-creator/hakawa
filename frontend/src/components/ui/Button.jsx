import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-r from-orient-gold to-amber-500 text-white shadow-lg shadow-orient-gold/20 hover:shadow-orient-gold/40 border-none",
  secondary:
    "bg-white/10 backdrop-blur-md text-orient-dark border border-white/20 hover:bg-white/20",
  ghost: "bg-transparent hover:bg-orient-dark/5 text-orient-dark",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
  outline:
    "bg-transparent border-2 border-orient-gold text-orient-gold hover:bg-orient-gold/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  icon: "p-2",
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.95, y: 0 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl font-display font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {/* 3D Bottom Border Effect for Primary */}
        {variant === "primary" && (
          <div className="absolute inset-0 rounded-xl bg-black/10 translate-y-1 translate-x-0 -z-10" />
        )}

        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
