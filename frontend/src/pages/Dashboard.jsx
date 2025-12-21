import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Moon, BookOpen, Plus, LogOut, Shield } from "lucide-react";

export default function Dashboard() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bleu-nuit to-nuit-dark">
      {/* Header */}
      <header className="border-b border-or/20 bg-nuit-light/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-8 h-8 text-or" />
              <span className="text-2xl font-display font-bold text-or">
                HAKAWA
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin() && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 px-4 py-2 bg-or/10 text-or rounded-lg hover:bg-or/20 transition"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
              <div className="text-right">
                <p className="text-parchemin font-semibold">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-sable text-sm">
                  {profile?.subscription_tier || "free"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-sable hover:text-or transition"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-or mb-2">
            Tableau de bord
          </h1>
          <p className="text-sable">Bienvenue sur votre espace créatif 🌙</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={<Plus className="w-8 h-8" />}
            title="Nouveau projet"
            description="Commencez une nouvelle histoire"
            color="bg-or"
          />
          <ActionCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Mes projets"
            description="Voir tous vos projets"
            color="bg-blue-500"
          />
        </div>

        {/* Projects Section */}
        <div className="bg-nuit-light rounded-xl p-6 border border-or/20">
          <h2 className="text-2xl font-display font-bold text-or mb-4">
            Vos projets
          </h2>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-or/30 mx-auto mb-4" />
            <p className="text-sable mb-4">Vous n'avez pas encore de projet</p>
            <button className="px-6 py-3 bg-or text-bleu-nuit rounded-lg font-semibold hover:bg-gold-light transition">
              Créer votre premier livre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionCard = ({ icon, title, description, color }) => {
  return (
    <div className="bg-nuit-light rounded-xl p-6 border border-or/20 hover:border-or/50 transition cursor-pointer group">
      <div
        className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-parchemin mb-2">
        {title}
      </h3>
      <p className="text-sable text-sm">{description}</p>
    </div>
  );
};
