import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Moon, Mail, Lock, Chrome, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { motion } from "framer-motion";

export default function Login() {
  const { t } = useTranslation();
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
      setError(t("auth.fill_all_fields"));
      setLoading(false);
      return;
    }

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message || t("auth.error_login"));
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
            {t("auth.login_title")}
          </h1>
          <p className="text-white/80">{t("auth.login_subtitle")}</p>
        </div>

        <Card className="p-8 shadow-2xl border-white/50 backdrop-blur-sm bg-white/95">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <Input
              label={t("auth.email")}
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label={t("auth.password")}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orient-purple focus:ring-orient-purple"
                />
                {t("auth.remember_me")}
              </label>
              <Link
                to="/forgot-password"
                className="text-orient-purple hover:text-orient-blue font-medium"
              >
                {t("auth.forgot_password")}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={loading}
            >
              {loading ? <Loader size="sm" /> : t("auth.login_button")}
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
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="w-5 h-5 mr-2" />
            {t("auth.google")}
          </Button>

          <div className="mt-8 text-center text-sm text-gray-600">
            {t("auth.no_account")}{" "}
            <Link
              to="/register"
              className="text-orient-purple font-bold hover:underline"
            >
              {t("auth.create_account")}
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
