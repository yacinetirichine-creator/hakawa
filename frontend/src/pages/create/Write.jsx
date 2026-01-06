import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/layout/Layout";
import { projectsService } from "../../services/projects";
import { chaptersService } from "../../services/chapters";
import { generationService } from "../../services/generation";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import {
  Wand2,
  ArrowRight,
  Save,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

export default function Write() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      const sortedChapters = chaptersData.sort(
        (a, b) => a.number - b.number
      );
      setChapters(sortedChapters);

      if (sortedChapters.length > 0) {
        selectChapter(sortedChapters[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("project.load_error"));
    } finally {
      setLoading(false);
    }
  };

  const selectChapter = (chapter) => {
    // Save current before switching? Maybe auto-save later.
    setCurrentChapter(chapter);
    setContent(chapter.content || "");
  };

  const handleSave = async () => {
    if (!currentChapter) return;
    setSaving(true);
    try {
      await chaptersService.update(
        projectId,
        currentChapter.number,
        { content },
        user.id
      );
      // Update local state
      setChapters(
        chapters.map((c) =>
          c.id === currentChapter.id ? { ...c, content } : c
        )
      );
      toast.success(t("project.write_saved"));
    } catch (error) {
      toast.error(t("project.write_save_error"));
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!currentChapter) return;
    setGenerating(true);
    try {
      const generatedContent = await generationService.writeChapter(
        currentChapter.id,
        user.id
      );
      setContent((prev) => prev + "\n\n" + generatedContent);
      toast.success(t("project.write_generated"));
    } catch (error) {
      console.error(error);
      toast.error(t("project.write_generate_error"));
    } finally {
      setGenerating(false);
    }
  };

  const handleNextPhase = () => {
    navigate(`/create/${projectId}/export`);
  };

  if (loading) return <Layout>{t("project.loading")}</Layout>;

  return (
    <Layout>
      <div className="flex h-[calc(100vh-100px)] -m-8">
        {/* Sidebar Chapters */}
        <motion.div
          initial={{ width: 300 }}
          animate={{ width: sidebarOpen ? 300 : 0 }}
          className="bg-white border-r border-gray-100 overflow-hidden flex flex-col shrink-0"
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between min-w-[300px]">
            <h2 className="font-display font-bold text-orient-dark">
              {t("project.write_chapters")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 min-w-[300px]">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => selectChapter(chapter)}
                className={`w-full text-left p-3 rounded-xl text-sm mb-1 transition-colors ${
                  currentChapter?.id === chapter.id
                    ? "bg-orient-purple/10 text-orient-purple font-medium"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <span className="opacity-50 mr-2">{index + 1}.</span>
                {chapter.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
          {/* Toolbar */}
          <div className="h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              <h2 className="font-bold text-gray-800 truncate max-w-md">
                {currentChapter?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                className={showPreview ? "bg-gray-100" : ""}
              >
                {showPreview
                  ? t("project.write_edit")
                  : t("project.write_preview")}
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <Loader size="sm" className="mr-2" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                {t("project.write_continue")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader size="sm" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {t("project.write_save")}
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <Button onClick={handleNextPhase} variant="secondary">
                {t("project.write_finish")}{" "}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto bg-white min-h-full shadow-sm rounded-xl p-12">
              {showPreview ? (
                <div className="prose prose-lg max-w-none font-serif">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("project.write_placeholder")}
                  className="w-full h-full min-h-[600px] resize-none border-none focus:ring-0 p-0 text-lg leading-relaxed font-serif text-gray-800 placeholder:text-gray-300"
                  spellCheck={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
