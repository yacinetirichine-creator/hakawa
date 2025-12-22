import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/ui/Button";
import {
  User,
  Mail,
  Globe,
  Bell,
  Palette,
  Shield,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const settingsSections = [
    {
      title: "Profil",
      icon: User,
      items: [
        { label: "Nom complet", value: profile?.full_name || "Non défini" },
        { label: "Email", value: user?.email || "Non défini" },
        { label: "Membre depuis", value: "Décembre 2025" },
      ],
    },
    {
      title: "Préférences",
      icon: Palette,
      items: [
        { label: "Langue", value: "Français", action: "Modifier" },
        { label: "Thème", value: "Clair", action: "Modifier" },
        { label: "Mode enfant", value: "Désactivé", action: "Activer" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Emails", value: "Activés", action: "Modifier" },
        {
          label: "Nouveautés produit",
          value: "Activés",
          action: "Modifier",
        },
        {
          label: "Conseils d'écriture",
          value: "Hebdomadaire",
          action: "Modifier",
        },
      ],
    },
  ];

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-orient-dark mb-2">
          Paramètres
        </h1>
        <p className="text-gray-500 text-lg">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Subscription Card */}
        <div className="bg-gradient-to-r from-orient-purple to-orient-blue rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6" />
                <h2 className="text-2xl font-display font-bold">
                  Plan Gratuit
                </h2>
              </div>
              <p className="text-white/90 mb-4">
                Passez à un plan premium pour débloquer toutes les
                fonctionnalités
              </p>
              <ul className="space-y-2 text-sm text-white/80 mb-6">
                <li>✓ 1 projet actif</li>
                <li>✓ 5 générations IA/jour</li>
                <li>✓ 2 illustrations/mois</li>
              </ul>
            </div>
          </div>
          <Button
            onClick={() => navigate("/pricing")}
            className="bg-white text-orient-purple hover:bg-gray-100"
          >
            Voir les plans premium
          </Button>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orient-purple/10 p-3 rounded-xl">
                  <Icon className="w-6 h-6 text-orient-purple" />
                </div>
                <h2 className="text-2xl font-display font-bold text-orient-dark">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-700">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.value}</p>
                    </div>
                    {item.action && (
                      <Button variant="ghost" size="sm">
                        {item.action}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Security Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orient-gold/10 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-orient-gold" />
            </div>
            <h2 className="text-2xl font-display font-bold text-orient-dark">
              Sécurité
            </h2>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Gérer les sessions actives
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Activer l'authentification à deux facteurs
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-3xl p-8 border-2 border-red-100">
          <h2 className="text-2xl font-display font-bold text-red-900 mb-4">
            Zone de danger
          </h2>
          <p className="text-red-700 mb-6">
            Ces actions sont irréversibles. Soyez prudent.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
