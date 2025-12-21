import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef(
  ({ className, children, hover = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={
          hover
            ? {
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              }
            : {}
        }
        transition={{ duration: 0.3 }}
        className={cn(
          "relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl",
          className
        )}
        {...props}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        <div className="relative z-10 p-6">{children}</div>
      </motion.div>
    );
  }
);

Card.displayName = "Card";
