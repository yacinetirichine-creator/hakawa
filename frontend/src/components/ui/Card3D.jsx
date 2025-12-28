import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

export const Card3D = React.forwardRef(
  ({ className, children, hover = true, intensity = 15, ...props }, ref) => {
    const cardRef = useRef(null);
    const [hovering, setHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(
      useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]),
      {
        stiffness: 300,
        damping: 30,
      }
    );
    const rotateY = useSpring(
      useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]),
      {
        stiffness: 300,
        damping: 30,
      }
    );

    const handleMouseMove = (e) => {
      if (!hover || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(percentX);
      mouseY.set(percentY);
    };

    const handleMouseLeave = () => {
      setHovering(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <div className="perspective-1000">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={
            hover && hovering
              ? {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
              : {}
          }
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={handleMouseLeave}
          whileHover={
            hover
              ? {
                  scale: 1.02,
                  boxShadow:
                    "0 30px 60px -15px rgba(0, 0, 0, 0.3), 0 15px 25px -10px rgba(0, 0, 0, 0.2)",
                }
              : {}
          }
          transition={{ duration: 0.3 }}
          className={cn(
            "relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl",
            className
          )}
          {...props}
        >
          {/* Layered glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />

          {/* Shimmer overlay */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          </div>

          {/* Glow border effect */}
          <div className="absolute inset-0 rounded-3xl border border-orient-gold/20 pointer-events-none" />

          {/* 3D Inner shadow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow:
                "inset 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 -2px 4px rgba(255, 255, 255, 0.4)",
              transform: "translateZ(10px)",
            }}
          />

          {/* Content with 3D transform */}
          <div
            className="relative z-10 p-8"
            style={{ transform: "translateZ(30px)" }}
          >
            {children}
          </div>

          {/* Bottom 3D shadow */}
          <div className="absolute -bottom-2 left-4 right-4 h-8 bg-gradient-to-b from-black/5 to-transparent blur-xl rounded-full -z-10" />
        </motion.div>
      </div>
    );
  }
);

Card3D.displayName = "Card3D";
