import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabase";
import {
  Users,
  BookOpen,
  Image,
  FileText,
  TrendingUp,
  Shield,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalIllustrations: 0,
    totalExports: 0,
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Récupérer les statistiques
      const [usersRes, projectsRes, illustrationsRes, exportsRes] =
        await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase
            .from("illustrations")
            .select("*", { count: "exact", head: true }),
          supabase.from("exports").select("*", { count: "exact", head: true }),
        ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalIllustrations: illustrationsRes.count || 0,
        totalExports: exportsRes.count || 0,
      });

      // Récupérer les derniers utilisateurs
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      setUsers(usersData || []);

      // Récupérer les derniers projets
      const { data: projectsData } = await supabase
        .from("projects")
        .select(
          `
          *,
          profiles:user_id (
            full_name,
            email
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(10);

      setProjects(projectsData || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };

  const updateUserTier = async (userId, newTier) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_tier: newTier })
        .eq("id", userId);

      if (error) throw error;

      // Refresh data
      fetchAdminData();
    } catch (error) {
      console.error("Error updating user tier:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bleu-nuit flex items-center justify-center">
        <div className="text-or text-xl">Chargement des données admin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bleu-nuit to-nuit-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-or" />
            <h1 className="text-4xl font-display font-bold text-or">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-sable">
            Bienvenue, {profile?.full_name || "Admin"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Utilisateurs"
            value={stats.totalUsers}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Projets"
            value={stats.totalProjects}
            color="text-green-400"
            bgColor="bg-green-500/10"
          />
          <StatCard
            icon={<Image className="w-6 h-6" />}
            title="Illustrations"
            value={stats.totalIllustrations}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Exports"
            value={stats.totalExports}
            color="text-orange-400"
            bgColor="bg-orange-500/10"
          />
        </div>

        {/* Derniers utilisateurs */}
        <div className="bg-nuit-light rounded-xl p-6 border border-or/20 mb-8">
          <h2 className="text-2xl font-display font-bold text-or mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Derniers utilisateurs
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-or/20">
                  <th className="text-left py-3 px-4 text-sable font-semibold">
                    Nom
                  </th>
                  <th className="text-left py-3 px-4 text-sable font-semibold">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sable font-semibold">
                    Abonnement
                  </th>
                  <th className="text-left py-3 px-4 text-sable font-semibold">
                    Crédits
                  </th>
                  <th className="text-left py-3 px-4 text-sable font-semibold">
                    Inscription
                  </th>
                  <th className="text-left py-3 px-4 text-sable font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-or/10 hover:bg-bleu-nuit/50"
                  >
                    <td className="py-3 px-4 text-parchemin">
                      {user.full_name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-parchemin">{user.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.subscription_tier}
                        onChange={(e) =>
                          updateUserTier(user.id, e.target.value)
                        }
                        className="bg-bleu-nuit text-parchemin border border-or/30 rounded px-2 py-1 text-sm"
                      >
                        <option value="free">Free</option>
                        <option value="conteur">Conteur</option>
                        <option value="pro">Pro</option>
                        <option value="studio">Studio</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-parchemin">
                      {user.credits_illustrations}
                    </td>
                    <td className="py-3 px-4 text-sable text-sm">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-or hover:text-gold-light text-sm font-semibold">
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derniers projets */}
        <div className="bg-nuit-light rounded-xl p-6 border border-or/20">
          <h2 className="text-2xl font-display font-bold text-or mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Derniers projets
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-bleu-nuit/50 rounded-lg p-4 border border-or/10 hover:border-or/30 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-parchemin">
                      {project.title}
                    </h3>
                    <p className="text-sable text-sm mt-1">
                      Par {project.profiles?.full_name || "Utilisateur inconnu"}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-sable">
                      <span>Genre: {project.genre || "N/A"}</span>
                      <span>•</span>
                      <span>Style: {project.style || "N/A"}</span>
                      <span>•</span>
                      <span>Chapitres: {project.chapter_count}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : project.status === "writing"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {project.status}
                    </span>
                    <p className="text-sable text-xs mt-2">
                      {new Date(project.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avertissement sécurité */}
        <div className="mt-8 bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-orange-400 font-semibold mb-1">
              Accès administrateur
            </h3>
            <p className="text-orange-300 text-sm">
              Vous avez accès aux données sensibles. Respectez la
              confidentialité des utilisateurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, color, bgColor }) => {
  return (
    <div className="bg-nuit-light rounded-xl p-6 border border-or/20">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-sable text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-parchemin">{value}</p>
    </div>
  );
};
