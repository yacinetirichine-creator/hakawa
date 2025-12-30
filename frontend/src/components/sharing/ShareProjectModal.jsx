import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Lock, Unlock, Eye, X, Globe } from "lucide-react";
import { supabase } from "../../services/supabase";

export default function ShareProjectModal({ project, onClose }) {
  const [isPublic, setIsPublic] = useState(project?.is_public || false);
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(!!project?.share_password);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareStats, setShareStats] = useState({
    views: project?.share_views || 0,
    lastViewed: project?.last_viewed_at,
  });

  const shareUrl = `${window.location.origin}/shared/${
    project?.share_token || ""
  }`;

  const handleTogglePublic = async () => {
    setLoading(true);
    try {
      let shareToken = project.share_token;

      // Generate new token if none exists
      if (!shareToken) {
        shareToken = crypto.randomUUID();
      }

      const { error } = await supabase
        .from("manuscripts")
        .update({
          is_public: !isPublic,
          share_token: shareToken,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      if (error) throw error;

      setIsPublic(!isPublic);
    } catch (error) {
      console.error("Error toggling public:", error);
      alert("Erreur lors de la mise à jour du partage");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password.trim() && hasPassword) {
      // Remove password
      setLoading(true);
      try {
        const { error } = await supabase
          .from("manuscripts")
          .update({
            share_password: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id);

        if (error) throw error;

        setHasPassword(false);
        setPassword("");
      } catch (error) {
        console.error("Error removing password:", error);
        alert("Erreur lors de la suppression du mot de passe");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      alert("Veuillez entrer un mot de passe");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("manuscripts")
        .update({
          share_password: password,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      if (error) throw error;

      setHasPassword(true);
    } catch (error) {
      console.error("Error setting password:", error);
      alert("Erreur lors de la définition du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-bleu-nuit to-bleu-nuit/90 rounded-2xl shadow-2xl max-w-2xl w-full border border-or/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-or/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-or" />
              <div>
                <h2 className="text-2xl font-bold text-or">
                  Partager votre projet
                </h2>
                <p className="text-sm text-parchemin/70 mt-1">
                  {project?.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-or/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-parchemin" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Public Toggle */}
          <div className="flex items-center justify-between p-4 bg-bleu-nuit/50 rounded-lg border border-or/10">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-or" />
              <div>
                <p className="font-bold text-parchemin">Partage public</p>
                <p className="text-sm text-parchemin/70">
                  {isPublic
                    ? "Votre projet est accessible via un lien"
                    : "Votre projet est privé"}
                </p>
              </div>
            </div>
            <button
              onClick={handleTogglePublic}
              disabled={loading}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isPublic ? "bg-or" : "bg-gray-600"
              }`}
            >
              <motion.div
                animate={{ x: isPublic ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Share Link */}
          {isPublic && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm font-bold text-parchemin">
                Lien de partage
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin focus:outline-none focus:border-or"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-or/20 hover:bg-or/30 text-or rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Password Protection */}
          {isPublic && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                {hasPassword ? (
                  <Lock className="w-5 h-5 text-or" />
                ) : (
                  <Unlock className="w-5 h-5 text-parchemin/50" />
                )}
                <label className="block text-sm font-bold text-parchemin">
                  Mot de passe (optionnel)
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    hasPassword
                      ? "Entrer un nouveau mot de passe"
                      : "Protéger par mot de passe"
                  }
                  className="flex-1 px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin placeholder:text-parchemin/30 focus:outline-none focus:border-or"
                />
                <button
                  onClick={handleSetPassword}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-or to-or/80 text-bleu-nuit font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all disabled:opacity-50"
                >
                  {hasPassword ? "Modifier" : "Définir"}
                </button>
              </div>
              {hasPassword && (
                <button
                  onClick={() => {
                    setPassword("");
                    handleSetPassword();
                  }}
                  className="text-sm text-parchemin/70 hover:text-or transition-colors"
                >
                  Supprimer le mot de passe
                </button>
              )}
            </motion.div>
          )}

          {/* Stats */}
          {isPublic && shareStats.views > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-bleu-nuit/50 rounded-lg border border-or/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-or" />
                <p className="font-bold text-parchemin">Statistiques</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-parchemin/50">Vues</p>
                  <p className="text-lg font-bold text-or">
                    {shareStats.views}
                  </p>
                </div>
                {shareStats.lastViewed && (
                  <div>
                    <p className="text-parchemin/50">Dernière vue</p>
                    <p className="text-lg font-bold text-or">
                      {new Date(shareStats.lastViewed).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-or/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-or to-or/80 text-bleu-nuit font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
