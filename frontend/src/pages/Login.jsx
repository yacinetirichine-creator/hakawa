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
      return (
    <div className="min-h-screen bg-gradient-orient flex items-center justify-center p-4 font-body">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-orient-gold p-3 rounded-full text-white shadow-lg group-hover:scale-110 transition">
              <Moon className="w-8 h-8 fill-current" />
            </div>
            <span className="text-3xl font-display font-bold text-orient-dark">
              HAKAWA
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-orient-dark mb-6 text-center">
            Bon retour parmi nous !
          </h2>
          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Bouton Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-6 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5" />
            Continuer avec Google
          </button>

          {/* Séparateur */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium">ou</span>
            </div>
          </div>

          {/* Formulaire email/password */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-orient-text text-sm font-bold mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orient-purple focus:ring-0 transition"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-orient-text text-sm font-bold mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orient-purple focus:ring-0 transition"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-orient-purple to-orient-blue text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Lien inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-orient-purple hover:text-orient-blue font-bold"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Lien retour */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-orient-text/60 hover:text-orient-purple text-sm font-medium transition">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
