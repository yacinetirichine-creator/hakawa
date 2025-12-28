import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-br from-orient-gold via-amber-500 to-yellow-600 text-white shadow-2xl shadow-orient-gold/40 hover:shadow-orient-gold/60 border-none",
  secondary:
    "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl text-orient-dark border border-white/40 hover:bg-white/30 shadow-lg",
  ghost:
    "bg-transparent hover:bg-orient-dark/10 text-orient-dark border border-transparent hover:border-orient-dark/20",
  danger:
    "bg-gradient-to-br from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 shadow-2xl shadow-red-500/30",
  outline:
    "bg-transparent border-2 border-orient-gold text-orient-gold hover:bg-orient-gold/10 shadow-lg hover:shadow-xl",
  success:
    "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl shadow-emerald-500/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-8 py-4 text-base",
  lg: "px-10 py-5 text-lg",
  xl: "px-12 py-6 text-xl",
  icon: "p-3",
};

export const Button3D = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon: Icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        className="relative inline-block"
        whileHover={{ y: -4 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* 3D Shadow Layer - Creates depth effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-200",
            variant === "primary" &&
              "bg-gradient-to-br from-amber-700 to-yellow-800 translate-y-2 blur-sm opacity-60",
            variant === "secondary" && "bg-black/20 translate-y-2 blur-sm",
            variant === "danger" &&
              "bg-gradient-to-br from-red-700 to-red-900 translate-y-2 blur-sm opacity-60",
            variant === "success" &&
              "bg-gradient-to-br from-emerald-700 to-emerald-900 translate-y-2 blur-sm opacity-60",
            variant === "outline" && "bg-orient-gold/30 translate-y-2 blur-sm"
          )}
        />

        {/* Main Button */}
        <motion.button
          ref={ref}
          whileHover={{
            scale: 1.02,
            boxShadow:
              variant === "primary"
                ? "0 25px 50px -12px rgba(212, 168, 83, 0.5)"
                : "0 20px 40px -10px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative inline-flex items-center justify-center gap-3 rounded-2xl font-display font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group",
            variants[variant],
            sizes[size],
            className
          )}
          disabled={isLoading}
          {...props}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Glossy top highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl" />

          {/* Content */}
          <span className="relative z-10 flex items-center gap-3">
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {!isLoading && Icon && <Icon className="w-5 h-5" />}
            {children}
          </span>

          {/* Sparkle particles for primary variant */}
          {variant === "primary" && (
            <>
              <motion.span
                className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0,
                }}
              />
              <motion.span
                className="absolute bottom-3 left-6 w-1 h-1 bg-white rounded-full"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.7,
                }}
              />
            </>
          )}
        </motion.button>
      </motion.div>
    );
  }
);

Button3D.displayName = "Button3D";
