import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Moon, BookOpen, Plus, LogOut, Shield, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-orient font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orient-gold p-2 rounded-full text-white shadow-sm">
                <Moon className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-display font-bold text-orient-dark hidden md:block">
                HAKAWA
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin() && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 px-4 py-2 bg-orient-purple/10 text-orient-purple rounded-full font-bold hover:bg-orient-purple/20 transition"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-orient-dark font-bold">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-orient-text text-xs uppercase tracking-wider font-bold">
                  {profile?.subscription_tier || "Explorateur"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition bg-gray-50 rounded-full hover:bg-red-50"
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
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-display font-bold text-orient-dark mb-2">
            Bonjour, {profile?.full_name?.split(" ")[0] || "Ami Conteur"} ! 👋
          </h1>
          <p className="text-orient-text text-lg">
            Prêt à inventer de nouvelles histoires magiques ?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ActionCard
            icon={<Plus className="w-8 h-8" />}
            title="Nouvelle Histoire"
            description="Commence une page blanche"
            color="bg-orient-purple"
            textColor="text-white"
          />
          <ActionCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Mes Livres"
            description="Retrouve tes créations"
            color="bg-orient-blue"
            textColor="text-white"
          />
          <ActionCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Inspiration"
            description="Découvre des idées magiques"
            color="bg-orient-gold"
            textColor="text-white"
          />
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-orient-dark">
              Tes Projets Récents
            </h2>
            <button className="text-orient-purple font-bold hover:underline">
              Voir tout
            </button>
          </div>

          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 mb-6 font-medium">
              Ta bibliothèque est vide pour le moment
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-orient-purple to-orient-blue text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              Créer mon premier livre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionCard = ({ icon, title, description, color, textColor }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition cursor-pointer group border border-white/50">
      <div
        className={`w-16 h-16 ${color} ${textColor} rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-orient-dark mb-1">
        {title}
      </h3>
      <p className="text-orient-text text-sm font-medium">{description}</p>
    </div>
  );
};
