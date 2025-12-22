import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { motion } from "framer-motion";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
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
      return t("auth.password_min");
    }
    if (!/[A-Z]/.test(password)) {
      return t("auth.password_uppercase");
    }
    if (!/[a-z]/.test(password)) {
      return t("auth.password_lowercase");
    }
    if (!/[0-9]/.test(password)) {
      return t("auth.password_number");
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
      setError(t("auth.fill_all_fields"));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.password_mismatch"));
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
      setError(error.message || t("auth.error_register"));
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Rediriger après 2 secondes
      setTimeout(() => {
        if (plan) {
          navigate(`/pricing?plan=${plan}`);
        } else {
          navigate("/dashboard");
        }
      }, 2000);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setLoading(true);

    const redirectTo = plan
      ? `${window.location.origin}/pricing?plan=${plan}`
      : `${window.location.origin}/dashboard`;

    const { error } = await signInWithGoogle(redirectTo);

    if (error) {
      setError(error.message || t("auth.error_google"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-orient flex items-center justify-center p-4 font-body">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-lg border border-white/30">
              <Moon className="w-10 h-10 text-white fill-current" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {t("auth.register_title")}
          </h1>
          <p className="text-white/80">{t("auth.register_subtitle")}</p>
        </div>

        <Card className="p-8 shadow-2xl border-white/50 backdrop-blur-sm bg-white/95">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-600 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              {t("auth.success_created")}
            </div>
          )}

          <form onSubmit={handleEmailRegister} className="space-y-6">
            <Input
              label={t("auth.full_name")}
              type="text"
              name="fullName"
              placeholder="Jean Dupont"
              value={formData.fullName}
              onChange={handleChange}
              icon={User}
              disabled={loading || success}
              required
            />

            <Input
              label={t("auth.email")}
              type="email"
              name="email"
              placeholder="ton@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              disabled={loading || success}
              required
            />

            <Input
              label={t("auth.password")}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              disabled={loading || success}
              required
            />

            <Input
              label={t("auth.confirm_password")}
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              disabled={loading || success}
              required
            />

            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <p className="font-medium mb-1">
                Le mot de passe doit contenir :
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Au moins 8 caractères</li>
                <li>Une majuscule et une minuscule</li>
                <li>Au moins un chiffre</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={loading || success}
            >
              {loading ? <Loader size="sm" /> : t("auth.register_button")}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                {t("auth.or_continue_with")}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full py-6"
            onClick={handleGoogleRegister}
            disabled={loading || success}
          >
            <Chrome className="w-5 h-5 mr-2" />
            {t("auth.google")}
          </Button>

          <div className="mt-8 text-center text-sm text-gray-600">
            {t("auth.has_account")}{" "}
            <Link
              to="/login"
              className="text-orient-purple font-bold hover:underline"
            >
              {t("nav.login")}
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
