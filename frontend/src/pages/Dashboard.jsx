import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "../components/layout/Layout";
import { ProjectList } from "../components/project/ProjectList";
import { projectsService } from "../services/projects";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      if (user) {
        const data = await projectsService.getAll(user.id);
        setProjects(data || []);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      // Don't show error toast if it's just a connection issue
      // toast.error(t("dashboard.load_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm(t("dashboard.delete_confirm"))) {
      try {
        await projectsService.delete(projectId, user.id);
        setProjects(projects.filter((p) => p.id !== projectId));
        toast.success(t("dashboard.deleted_success"));
      } catch (error) {
        toast.error(t("dashboard.delete_error"));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-orient-dark mb-2">
            {t("dashboard.welcome", {
              name: profile?.full_name?.split(" ")[0] || "Ami Conteur",
            })}
          </h1>
          <p className="text-gray-500 text-lg">{t("dashboard.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate("/create/new")}
          className="hidden md:flex"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("dashboard.new_project")}
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-orient-dark mb-6">
          {t("dashboard.my_stories")}
        </h2>
        <ProjectList projects={projects} onDelete={handleDeleteProject} />
      </div>
    </Layout>
  );
}
