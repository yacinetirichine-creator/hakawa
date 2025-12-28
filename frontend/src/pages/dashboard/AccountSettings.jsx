import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Card3D } from "../../components/ui/Card3D";
import { Button3D } from "../../components/ui/Button3D";
import { AnimatedBackground } from "../../components/ui/AnimatedBackground";
import {
  User,
  Mail,
  CreditCard,
  Trash2,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AccountSettings() {
  const { profile, token, logout } = useAuth();
  const { t } = useTranslation();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/api/account/me`, { headers });
      setAccountData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching account data:", error);
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/api/account/export-data`, {
        headers,
      });

      // Download as JSON
      const dataStr = JSON.stringify(res.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hakawa-data-${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      alert("Vos données ont été exportées avec succès !");
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Erreur lors de l'export des données");
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir annuler votre abonnement ? Vous passerez au plan gratuit."
      )
    ) {
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_URL}/api/account/subscription`,
        { tier: "free" },
        { headers }
      );

      alert("Abonnement annulé. Vous êtes maintenant sur le plan gratuit.");
      fetchAccountData();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert(error.response?.data?.detail || "Erreur lors de l'annulation");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/api/account/delete`, {
        headers,
        data: {
          confirm: true,
          reason: deleteReason,
        },
      });

      alert(
        "Votre compte a été supprimé. Nous sommes désolés de vous voir partir."
      );
      logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Erreur lors de la suppression du compte");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-orient flex items-center justify-center">
        <AnimatedBackground variant="stars" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-orient-gold text-2xl font-display"
        >
          Chargement...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      <AnimatedBackground variant="gradient" />

      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            Mon Compte
          </h1>
          <p className="text-white/70">
            Gérez vos informations et votre abonnement
          </p>
        </motion.div>

        {/* Profile Info */}
        <Card3D className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-orient-gold to-amber-600 p-4 rounded-2xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-orient-dark">
                Informations personnelles
              </h2>
              <p className="text-gray-600">Votre profil Hakawa</p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow
              icon={<User className="w-5 h-5" />}
              label="Nom complet"
              value={accountData?.profile?.full_name || "Non renseigné"}
            />
            <InfoRow
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={accountData?.profile?.email}
            />
            <InfoRow
              icon={<Calendar className="w-5 h-5" />}
              label="Membre depuis"
              value={new Date(
                accountData?.profile?.created_at
              ).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            {accountData?.profile?.is_admin && (
              <div className="flex items-center gap-3 p-4 bg-orient-gold/10 rounded-xl border border-orient-gold/30">
                <Shield className="w-5 h-5 text-orient-gold" />
                <span className="font-semibold text-orient-dark">
                  Compte Administrateur
                </span>
              </div>
            )}
          </div>
        </Card3D>

        {/* Subscription Info */}
        <Card3D className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-orient-dark">
                Abonnement
              </h2>
              <p className="text-gray-600">Votre plan actuel</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <InfoRow
              icon={<Package className="w-5 h-5" />}
              label="Plan"
              value={
                <span className="capitalize font-semibold text-orient-gold">
                  {accountData?.subscription?.tier}
                </span>
              }
            />
            <InfoRow
              icon={
                accountData?.subscription?.is_active ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )
              }
              label="Statut"
              value={
                <span
                  className={`font-semibold ${
                    accountData?.subscription?.is_active
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {accountData?.subscription?.is_active ? "Actif" : "Inactif"}
                </span>
              }
            />
            {accountData?.subscription?.expires_at && (
              <InfoRow
                icon={<Calendar className="w-5 h-5" />}
                label="Expire le"
                value={new Date(
                  accountData.subscription.expires_at
                ).toLocaleDateString("fr-FR")}
              />
            )}
          </div>

          {accountData?.subscription?.tier !== "free" && (
            <Button3D
              variant="danger"
              onClick={handleCancelSubscription}
              className="w-full"
            >
              Annuler l'abonnement
            </Button3D>
          )}
        </Card3D>

        {/* Usage Stats */}
        <Card3D className="mb-6">
          <h2 className="text-2xl font-display font-bold text-orient-dark mb-6">
            Utilisation
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UsageStat
              label="Projets"
              value={accountData?.stats?.projects_count || 0}
            />
            <UsageStat
              label="Illustrations"
              value={accountData?.stats?.illustrations_count || 0}
            />
            <UsageStat
              label="Exports"
              value={accountData?.stats?.exports_count || 0}
            />
            <UsageStat
              label="Crédits restants"
              value={accountData?.stats?.credits_remaining || 0}
            />
          </div>
        </Card3D>

        {/* Data Export */}
        <Card3D className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-bold text-orient-dark mb-2">
                Exporter mes données
              </h3>
              <p className="text-gray-600 text-sm">
                Téléchargez toutes vos données (RGPD)
              </p>
            </div>
            <Button3D
              variant="outline"
              icon={Download}
              onClick={handleExportData}
            >
              Exporter
            </Button3D>
          </div>
        </Card3D>

        {/* Danger Zone */}
        <Card3D className="border-2 border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-display font-bold text-red-600">
              Zone dangereuse
            </h2>
          </div>

          <p className="text-gray-700 mb-4">
            La suppression de votre compte est définitive et irréversible.
            Toutes vos données seront perdues.
          </p>

          {!showDeleteConfirm ? (
            <Button3D
              variant="danger"
              icon={Trash2}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Supprimer mon compte
            </Button3D>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-700 font-semibold">
                Êtes-vous absolument sûr ? Cette action est irréversible.
              </p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pourquoi partez-vous ? (optionnel)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none"
                  rows="3"
                  placeholder="Dites-nous pourquoi..."
                />
              </div>

              <div className="flex gap-3">
                <Button3D
                  variant="danger"
                  onClick={handleDeleteAccount}
                  className="flex-1"
                >
                  Confirmer la suppression
                </Button3D>
                <Button3D
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteReason("");
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button3D>
              </div>
            </div>
          )}
        </Card3D>
      </div>
    </div>
  );
}

// Components
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
    <div className="text-orient-gold">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-orient-dark">{value}</p>
    </div>
  </div>
);

const UsageStat = ({ label, value }) => (
  <div className="bg-orient-gold/10 rounded-xl p-4 border border-orient-gold/20 text-center">
    <p className="text-3xl font-bold text-orient-dark">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);
