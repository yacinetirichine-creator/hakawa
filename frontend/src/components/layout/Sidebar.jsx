import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

export function Sidebar() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), path: "/dashboard" },
    { icon: PlusCircle, label: t("nav.new_project"), path: "/create/new" },
    { icon: BookOpen, label: t("nav.my_books"), path: "/projects" },
    { icon: Sparkles, label: t("nav.inspiration"), path: "/inspiration" },
    { icon: Settings, label: t("nav.settings"), path: "/settings" },
  ];

  // Ajouter le lien admin si l'utilisateur est admin
  if (isAdmin()) {
    menuItems.push({
      icon: Shield,
      label: "Admin",
      path: "/admin",
    });
  }

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl z-40 flex flex-col transition-all duration-300"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className="min-w-[40px] h-10 bg-gradient-to-br from-orient-gold to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orient-gold/20">
          <span className="text-2xl">🌙</span>
        </div>
        <motion.span
          animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -20 : 0 }}
          className="font-display font-bold text-2xl text-orient-dark whitespace-nowrap"
        >
          HAKAWA
        </motion.span>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:scale-110 transition-transform text-orient-gold"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-orient-purple/10 text-orient-purple font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-orient-dark"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-orient-purple/10 rounded-xl"
                  />
                )}
                <item.icon
                  className={cn(
                    "w-6 h-6 min-w-[24px]",
                    isActive ? "stroke-[2.5px]" : "stroke-2"
                  )}
                />
                <motion.span
                  animate={{
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : "auto",
                  }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-500 hover:bg-red-50 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-6 h-6 min-w-[24px]" />
          <motion.span
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
            }}
            className="whitespace-nowrap overflow-hidden font-medium"
          >
            {t("nav.logout")}
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}
