import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/layout/Layout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { projectsService } from "../../services/projects";
import { motion } from "framer-motion";
import { Book, Wand2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const genres = [
  { id: "fantasy", label: "Fantasy", emoji: "🐉" },
  { id: "scifi", label: "Science-Fiction", emoji: "🚀" },
  { id: "adventure", label: "Aventure", emoji: "🗺️" },
  { id: "mystery", label: "Mystère", emoji: "🔍" },
  { id: "romance", label: "Romance", emoji: "💖" },
  { id: "horror", label: "Horreur", emoji: "👻" },
  { id: "comedy", label: "Comédie", emoji: "😂" },
  { id: "drama", label: "Drame", emoji: "🎭" },
];

const styles = [
  { id: "roman", label: "Roman", emoji: "📖" },
  { id: "manga", label: "Manga", emoji: "🗯️" },
  { id: "bd", label: "Bande Dessinée", emoji: "🎨" },
  { id: "comic", label: "Comics", emoji: "🦸" },
  { id: "enfants", label: "Livre Enfants", emoji: "🧸" },
];

const audiences = [
  { id: "children", label: "Enfants (3-10 ans)", emoji: "👶" },
  { id: "young_adult", label: "Ados / Jeunes Adultes", emoji: "🧑‍🎤" },
  { id: "adult", label: "Adultes", emoji: "👩‍💼" },
];

export default function NewProject() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    pitch: "",
    genre: "",
    style: "",
    target_audience: "",
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.genre || !formData.style) {
      toast.error(t("project.fill_required"));
      return;
    }

    setLoading(true);
    try {
      const project = await projectsService.create(formData, user.id);
      toast.success(t("project.created_success"));
      // Redirect to exploration phase
      navigate(`/create/${project.id}/explore`);
    } catch (error) {
      console.error(error);
      toast.error(t("project.create_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-display font-bold text-orient-dark mb-4">
            {t("project.new_title")}
          </h1>
          <p className="text-gray-500 text-lg">{t("project.new_subtitle")}</p>
        </motion.div>

        <Card className="p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Input
                label={t("project.title_label")}
                placeholder={t("project.title_placeholder")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                icon={Book}
                autoFocus
              />

              <div>
                <label className="text-sm font-bold text-orient-dark ml-1 mb-2 block">
                  {t("project.genre_label")}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() =>
                        setFormData({ ...formData, genre: genre.id })
                      }
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.genre === genre.id
                          ? "border-orient-gold bg-orient-gold/10 text-orient-dark"
                          : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl">{genre.emoji}</span>
                      <span className="text-sm font-bold">
                        {t(`genres.${genre.id}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.genre}
                >
                  Suivant <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Style & Audience */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="text-sm font-bold text-orient-dark ml-1 mb-2 block">
                  {t("project.style_label")}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() =>
                        setFormData({ ...formData, style: style.id })
                      }
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.style === style.id
                          ? "border-orient-purple bg-orient-purple/10 text-orient-dark"
                          : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl">{style.emoji}</span>
                      <span className="text-sm font-bold">
                        {t(`styles.${style.id}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-orient-dark ml-1 mb-2 block">
                  {t("project.audience_label")}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {audiences.map((audience) => (
                    <button
                      key={audience.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          target_audience: audience.id,
                        })
                      }
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.target_audience === audience.id
                          ? "border-orient-blue bg-orient-blue/10 text-orient-dark"
                          : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl">{audience.emoji}</span>
                      <span className="text-sm font-bold">
                        {t(`audiences.${audience.id}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  {t("project.back")}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.style || !formData.target_audience}
                >
                  {t("project.continue")}{" "}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pitch (Optional) */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="text-sm font-bold text-orient-dark ml-1 mb-2 block">
                  {t("project.pitch_label")}
                </label>
                <textarea
                  className="w-full h-32 rounded-xl border-2 border-transparent bg-gray-50 p-4 text-sm focus:border-orient-gold focus:bg-white focus:outline-none transition-all resize-none"
                  placeholder={t("project.pitch_placeholder")}
                  value={formData.pitch}
                  onChange={(e) =>
                    setFormData({ ...formData, pitch: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  {t("project.back")}
                </Button>
                <Button
                  onClick={handleCreate}
                  isLoading={loading}
                  className="w-40"
                >
                  <Wand2 className="mr-2 w-4 h-4" />
                  {t("project.create")}
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
