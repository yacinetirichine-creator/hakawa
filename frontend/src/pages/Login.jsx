import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Moon, Mail, Lock, Chrome, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation basique
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message || "Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message || "Erreur lors de la connexion avec Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bleu-nuit to-nuit-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Moon className="w-10 h-10 text-or" />
            <span className="text-3xl font-display font-bold text-or">
              HAKAWA
            </span>
          </Link>
          <h1 className="text-2xl font-display text-parchemin">Connexion</h1>
          <p className="text-sable mt-2">Bienvenue sur votre atelier créatif</p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-nuit-light rounded-xl p-8 border border-or/20 shadow-glow">
          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Bouton Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-6 px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5" />
            Continuer avec Google
          </button>

          {/* Séparateur */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-or/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-nuit-light text-sable">ou</span>
            </div>
          </div>

          {/* Formulaire email/password */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sable text-sm font-medium mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-or/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-bleu-nuit border border-or/30 rounded-lg text-parchemin placeholder-sable/50 focus:outline-none focus:border-or focus:ring-2 focus:ring-or/20"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sable text-sm font-medium mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-or/50" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-bleu-nuit border border-or/30 rounded-lg text-parchemin placeholder-sable/50 focus:outline-none focus:border-or focus:ring-2 focus:ring-or/20"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-or text-bleu-nuit rounded-lg font-semibold hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Lien inscription */}
          <div className="mt-6 text-center">
            <p className="text-sable text-sm">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-or hover:text-gold-light font-semibold"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Lien retour */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sable hover:text-or text-sm transition">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
