import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  User,
  Calendar,
  Lock,
  Eye,
  Heart,
  Share2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function SharedProject() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    fetchSharedProject();
  }, [shareToken]);

  const fetchSharedProject = async () => {
    try {
      setLoading(true);

      // Fetch project by share token
      const { data: projectData, error: projectError } = await supabase
        .from("manuscripts")
        .select("*")
        .eq("share_token", shareToken)
        .eq("is_public", true)
        .single();

      if (projectError) throw projectError;

      if (!projectData) {
        setError("Ce projet n'est pas disponible ou n'existe pas.");
        return;
      }

      // Check if password is required
      if (projectData.share_password) {
        setNeedsPassword(true);
        return;
      }

      await loadProjectData(projectData);
    } catch (error) {
      console.error("Error fetching shared project:", error);
      setError("Erreur lors du chargement du projet.");
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async (projectData) => {
    // Increment view count
    await supabase
      .from("manuscripts")
      .update({
        share_views: (projectData.share_views || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq("id", projectData.id);

    setProject(projectData);

    // Fetch author info
    const { data: userData } = await supabase
      .from("users")
      .select("id, email, full_name, author_bio, author_avatar")
      .eq("id", projectData.user_id)
      .single();

    setAuthor(userData);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: projectData, error } = await supabase
        .from("manuscripts")
        .select("*")
        .eq("share_token", shareToken)
        .eq("share_password", password)
        .single();

      if (error || !projectData) {
        setPasswordError(true);
        return;
      }

      setNeedsPassword(false);
      setPasswordError(false);
      await loadProjectData(projectData);
    } catch (error) {
      console.error("Password verification error:", error);
      setPasswordError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bleu-nuit via-bleu-nuit to-sable flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-or border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bleu-nuit via-bleu-nuit to-sable flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bleu-nuit/90 p-8 rounded-2xl border border-or/20 max-w-md text-center"
        >
          <AlertCircle className="w-16 h-16 text-or mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-or mb-2">
            Projet introuvable
          </h2>
          <p className="text-parchemin/70 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-or to-or/80 text-bleu-nuit font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bleu-nuit via-bleu-nuit to-sable flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bleu-nuit/90 p-8 rounded-2xl border border-or/20 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-or mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-or mb-2">Projet protégé</h2>
            <p className="text-parchemin/70">
              Ce projet nécessite un mot de passe
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Entrez le mot de passe"
                className={`w-full px-4 py-3 bg-bleu-nuit/50 border rounded-lg text-parchemin placeholder:text-parchemin/30 focus:outline-none focus:border-or ${
                  passwordError ? "border-red-500" : "border-or/20"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">
                  Mot de passe incorrect
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-or to-or/80 text-bleu-nuit font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all"
            >
              Accéder au projet
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bleu-nuit via-bleu-nuit to-sable">
      <div className="max-w-4xl mx-auto p-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bleu-nuit/90 p-8 rounded-2xl border border-or/20 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-or mb-4">
                {project?.title}
              </h1>
              {project?.synopsis && (
                <p className="text-lg text-parchemin/80 leading-relaxed">
                  {project.synopsis}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm">
            {author && (
              <div className="flex items-center gap-2 px-3 py-2 bg-or/10 rounded-lg">
                <User className="w-4 h-4 text-or" />
                <span className="text-parchemin">
                  {author.full_name || author.email}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 bg-or/10 rounded-lg">
              <Calendar className="w-4 h-4 text-or" />
              <span className="text-parchemin">
                {new Date(project?.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-or/10 rounded-lg">
              <Eye className="w-4 h-4 text-or" />
              <span className="text-parchemin">
                {project?.share_views || 1} vues
              </span>
            </div>
          </div>
        </motion.div>

        {/* Chapters */}
        {project?.chapters && project.chapters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bleu-nuit/90 p-8 rounded-2xl border border-or/20 mb-6"
          >
            <h2 className="text-2xl font-bold text-or mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              Chapitres
            </h2>
            <div className="space-y-4">
              {project.chapters.map((chapter, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-bleu-nuit/50 rounded-lg border border-or/10"
                >
                  <h3 className="font-bold text-parchemin mb-2">
                    {chapter.title || `Chapitre ${idx + 1}`}
                  </h3>
                  <p className="text-parchemin/80 whitespace-pre-wrap">
                    {chapter.content}
                  </p>
                  {chapter.illustrations &&
                    chapter.illustrations.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {chapter.illustrations.map((img, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={img.url}
                            alt={img.prompt}
                            className="rounded-lg w-full"
                          />
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Author Bio */}
        {author?.author_bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-bleu-nuit/90 p-8 rounded-2xl border border-or/20"
          >
            <h2 className="text-2xl font-bold text-or mb-4">
              À propos de l'auteur
            </h2>
            <p className="text-parchemin/80">{author.author_bio}</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-parchemin/70 mb-4">
            Créez vos propres histoires avec Hakawa
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-gradient-to-r from-or to-or/80 text-bleu-nuit font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all text-lg"
          >
            Commencer gratuitement
          </button>
        </motion.div>
      </div>
    </div>
  );
}
