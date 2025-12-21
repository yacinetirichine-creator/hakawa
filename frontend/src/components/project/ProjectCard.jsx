import React from "react";
import { motion } from "framer-motion";
import { Book, Calendar, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";

const statusColors = {
  draft: "default",
  exploring: "primary",
  planning: "warning",
  writing: "primary",
  illustrating: "secondary",
  published: "success",
};

export function ProjectCard({ project, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusLabels = {
    draft: t("status.draft"),
    exploring: t("status.exploring"),
    planning: t("status.planning"),
    writing: t("status.writing"),
    illustrating: t("status.illustrating"),
    published: t("status.published"),
  };

  return (
    <Card
      className="group cursor-pointer h-full flex flex-col"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Cover Image Area */}
      <div className="h-40 bg-gradient-to-br from-orient-gold/20 to-orient-purple/20 rounded-2xl mb-4 relative overflow-hidden">
        {project.cover_front_url ? (
          <img
            src={project.cover_front_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-orient-gold/30">
            <Book className="w-16 h-16" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={statusColors[project.status] || "default"}>
            {statusLabels[project.status] || project.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-display font-bold text-orient-dark mb-2 line-clamp-1 group-hover:text-orient-gold transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {project.pitch || t("project_card.no_description")}
        </p>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {format(new Date(project.updated_at), "d MMM yyyy", {
                locale: fr,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-orient-gold"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${project.id}/edit`);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
