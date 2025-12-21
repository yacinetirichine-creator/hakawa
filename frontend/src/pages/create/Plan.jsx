import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/layout/Layout";
import { projectsService } from "../../services/projects";
import { chaptersService } from "../../services/chapters";
import { generationService } from "../../services/generation";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import {
  Plus,
  Wand2,
  ArrowRight,
  GripVertical,
  Trash2,
  Edit2,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Plan() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (user && projectId) {
      loadData();
    }
  }, [user, projectId]);

  const loadData = async () => {
    try {
      const [projectData, chaptersData] = await Promise.all([
        projectsService.getOne(projectId, user.id),
        chaptersService.getAll(projectId, user.id),
      ]);
      setProject(projectData);
      setChapters(chaptersData.sort((a, b) => a.order_index - b.order_index));
    } catch (error) {
      console.error(error);
      toast.error(t("project.load_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const newChapters = await generationService.generatePlan(
        projectId,
        user.id
      );
      setChapters(newChapters);
      toast.success(t("project.plan_success"));
    } catch (error) {
      console.error(error);
      toast.error(t("project.plan_error"));
    } finally {
      setGenerating(false);
    }
  };

  const handleAddChapter = async () => {
    try {
      const newChapter = await chaptersService.create(
        {
          project_id: projectId,
          title: "Nouveau Chapitre",
          order_index: chapters.length + 1,
        },
        user.id
      );
      setChapters([...chapters, newChapter]);
      setEditingId(newChapter.id);
      setEditTitle(newChapter.title);
    } catch (error) {
      toast.error(t("project.chapter_create_error"));
    }
  };

  const handleDeleteChapter = async (id) => {
    if (!window.confirm(t("project.delete_chapter_confirm"))) return;
    try {
      await chaptersService.delete(id, user.id);
      setChapters(chapters.filter((c) => c.id !== id));
      toast.success(t("project.chapter_deleted"));
    } catch (error) {
      toast.error(t("project.chapter_delete_error"));
    }
  };

  const startEditing = (chapter) => {
    setEditingId(chapter.id);
    setEditTitle(chapter.title);
  };

  const saveEditing = async () => {
    if (!editTitle.trim()) return;
    try {
      const updated = await chaptersService.update(
        editingId,
        { title: editTitle },
        user.id
      );
      setChapters(chapters.map((c) => (c.id === editingId ? updated : c)));
      setEditingId(null);
    } catch (error) {
      toast.error(t("project.chapter_save_error"));
    }
  };

  const handleNextPhase = () => {
    navigate(`/create/${projectId}/write`);
  };

  if (loading) return <Layout>{t("project.loading")}</Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-orient-dark mb-2">
              {t("project.plan_title")}
            </h1>
            <p className="text-gray-500">{t("project.plan_subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGeneratePlan}
              disabled={generating}
            >
              {generating ? (
                <Loader size="sm" className="mr-2" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              {t("project.generate_plan")}
            </Button>
            <Button onClick={handleNextPhase} variant="secondary">
              {t("project.next_write")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-4">
          <AnimatePresence>
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 flex items-center gap-4 group hover:border-orient-gold/50 transition-colors">
                  <div className="text-gray-300 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="w-8 h-8 rounded-full bg-orient-purple/10 text-orient-purple flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    {editingId === chapter.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                          autoFocus
                          className="h-9"
                        />
                        <Button
                          size="sm"
                          onClick={saveEditing}
                          className="h-9 w-9 p-0"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="font-medium text-gray-800">
                        {chapter.title}
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(chapter)}
                      className="text-gray-400 hover:text-orient-purple"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAddChapter}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-orient-gold hover:text-orient-gold transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            {t("project.add_chapter")}
          </motion.button>
        </div>
      </div>
    </Layout>
  );
}
