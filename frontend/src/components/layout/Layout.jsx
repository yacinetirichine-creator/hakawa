import React from "react";
import { Sidebar } from "./Sidebar";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { motion } from "framer-motion";

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-body overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Gradient Orb 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orient-gold/5 blur-[100px]" />
        {/* Gradient Orb 2 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orient-purple/5 blur-[100px]" />

        {/* Stars Pattern (CSS based) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#1E3A5F 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Sidebar />

      <main className="flex-1 relative z-10 h-screen overflow-y-auto">
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto p-8 pb-24"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
