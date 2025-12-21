import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const Input = React.forwardRef(
  ({ className, type, label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-bold text-orient-dark ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orient-gold transition-colors">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 border-transparent bg-white/50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orient-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-inner",
              "hover:bg-white focus:bg-white focus:border-orient-gold/30",
              Icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {/* Animated bottom line */}
          <motion.div
            className="absolute bottom-0 left-2 right-2 h-0.5 bg-orient-gold origin-center"
            initial={{ scaleX: 0 }}
            whileFocus={{ scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 font-medium ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
