import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Moon,
  Mail,
  Lock,
  User,
  Chrome,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    return null;
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(
      formData.email,
      formData.password,
      formData.fullName
    );

    if (error) {
      setError(
        error.message || "Une erreur est survenue lors de l'inscription"
      );
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setLoading(true);

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message || "Erreur lors de l'inscription avec Google");
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-orient-dark mb-2 text-center">
            Créer un compte
          </h2>
          <p className="text-orient-text text-center mb-6">
            Commencez votre aventure créative
          </p>

          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Succès */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-600 text-sm">
                Compte créé avec succès ! Redirection...
              </p>
            </div>
          )}

          {/* Bouton Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading || success}
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
              <span className="px-4 bg-white text-gray-400 font-medium">
                ou
              </span>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-orient-text text-sm font-bold mb-2"
              >
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orient-purple focus:ring-0 transition"
                  disabled={loading || success}
                  autoComplete="name"
                />
              </div>
            </div>

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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orient-purple focus:ring-0 transition"
                  disabled={loading || success}
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orient-purple focus:ring-0 transition"
                  disabled={loading || success}
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Min. 8 caractères avec majuscule, minuscule et chiffre
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-orient-text text-sm font-bold mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orient-purple focus:ring-0 transition"
                  disabled={loading || success}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full px-6 py-4 bg-gradient-to-r from-orient-purple to-orient-blue text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-orient-purple hover:text-orient-blue font-bold"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Lien retour */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-orient-text/60 hover:text-orient-purple text-sm font-medium transition"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
