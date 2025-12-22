import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/layout/Layout";
import { projectsService } from "../../services/projects";
import { exportsService } from "../../services/exports";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import {
  Download,
  FileText,
  BookOpen,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Export() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user && projectId) {
      loadData();
    }
  }, [user, projectId]);

  const loadData = async () => {
    try {
      const projectData = await projectsService.getOne(projectId, user.id);
      setProject(projectData);
    } catch (error) {
      console.error(error);
      toast.error(t("project.load_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      // Trigger export generation
      const result = await exportsService.create(projectId, format);

      if (result?.export_id) {
        const response = await exportsService.download(result.export_id);
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${project?.title || "hakawa"}.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success(`${t("project.export_success")} ${format.toUpperCase()}`);
    } catch (error) {
      console.error(error);
      toast.error(t("project.export_error"));
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Layout>{t("project.loading")}</Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-orient-dark mb-4">
            {t("project.export_congrats")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("project.your_book")}{" "}
            <span className="font-bold text-orient-purple">
              "{project?.title}"
            </span>{" "}
            {t("project.export_ready")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <motion.div whileHover={{ y: -5 }} className="h-full">
            <Card
              className="p-8 h-full flex flex-col items-center text-center hover:border-orient-gold transition-colors cursor-pointer"
              onClick={() => handleExport("pdf")}
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("project.export_pdf_title")}
              </h3>
              <p className="text-gray-500 mb-8 flex-1">
                {t("project.export_pdf_desc")}
              </p>
              <Button className="w-full" disabled={exporting}>
                {exporting ? (
                  <Loader size="sm" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {t("project.export_download_pdf")}
              </Button>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="h-full">
            <Card
              className="p-8 h-full flex flex-col items-center text-center hover:border-orient-gold transition-colors cursor-pointer"
              onClick={() => handleExport("epub")}
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("project.export_epub_title")}
              </h3>
              <p className="text-gray-500 mb-8 flex-1">
                {t("project.export_epub_desc")}
              </p>
              <Button className="w-full" variant="outline" disabled={exporting}>
                {exporting ? (
                  <Loader size="sm" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {t("project.export_download_epub")}
              </Button>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("project.back_dashboard")}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
