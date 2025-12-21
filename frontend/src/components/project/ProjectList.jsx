import React from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { Plus } from "lucide-react";
import { Card } from "../ui/Card";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ProjectList({ projects, onDelete }) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* Create New Card */}
      <motion.div variants={item}>
        <Card
          className="h-full min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-orient-gold/30 bg-orient-gold/5 hover:bg-orient-gold/10 cursor-pointer group"
          onClick={() => navigate("/create/new")}
        >
          <div className="w-16 h-16 rounded-full bg-orient-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-orient-gold" />
          </div>
          <h3 className="text-lg font-bold text-orient-dark">Nouveau Projet</h3>
          <p className="text-sm text-gray-500 mt-2">
            Commencer une nouvelle aventure
          </p>
        </Card>
      </motion.div>

      {/* Project Cards */}
      {projects.map((project) => (
        <motion.div key={project.id} variants={item}>
          <ProjectCard project={project} onDelete={onDelete} />
        </motion.div>
      ))}
    </motion.div>
  );
}
