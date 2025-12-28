import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Card3D } from "../../components/ui/Card3D";
import { Button3D } from "../../components/ui/Button3D";
import { AnimatedBackground } from "../../components/ui/AnimatedBackground";
import {
  Users,
  BookOpen,
  Image,
  FileText,
  TrendingUp,
  Shield,
  AlertCircle,
  BarChart3,
  Activity,
  DollarSign,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function EnhancedAdminDashboard() {
  const { profile, token } = useAuth();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, [timeRange]);

  const fetchAdminData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch metrics
      const metricsRes = await axios.get(
        `${API_URL}/api/admin/metrics?days=${timeRange}`,
        { headers }
      );
      setMetrics(metricsRes.data);

      // Fetch users
      const usersRes = await axios.get(
        `${API_URL}/api/admin/users?limit=50&offset=0`,
        { headers }
      );
      setUsers(usersRes.data.users || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };

  const updateUserTier = async (userId, newTier) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API_URL}/api/admin/users/${userId}/tier`,
        { tier: newTier },
        { headers }
      );
      fetchAdminData();
    } catch (error) {
      console.error("Error updating user tier:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm(t("admin.confirm_delete"))) {
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, { headers });
      fetchAdminData();
      alert(t("admin.delete_success"));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(t("admin.delete_error"));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier =
      filterTier === "" || user.subscription_tier === filterTier;

    return matchesSearch && matchesTier;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-orient flex items-center justify-center">
        <AnimatedBackground variant="stars" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-orient-gold text-2xl font-display"
        >
          Chargement des métriques admin...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-br from-orient-gold to-amber-600 p-3 rounded-2xl shadow-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-white/70 mt-1">
                Bienvenue, {profile?.full_name || "Admin"}
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4">
            {[7, 30, 90].map((days) => (
              <Button3D
                key={days}
                variant={timeRange === days ? "primary" : "secondary"}
                size="sm"
                onClick={() => setTimeRange(days)}
              >
                {days} jours
              </Button3D>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard3D
              icon={<Users />}
              title="Utilisateurs"
              value={metrics.users.total}
              change={`+${metrics.users.new} nouveaux`}
              color="from-blue-500 to-blue-700"
              iconBg="bg-blue-500/20"
              iconColor="text-blue-400"
            />
            <StatCard3D
              icon={<BookOpen />}
              title="Projets"
              value={metrics.projects.total}
              change={`+${metrics.projects.new} nouveaux`}
              color="from-green-500 to-green-700"
              iconBg="bg-green-500/20"
              iconColor="text-green-400"
            />
            <StatCard3D
              icon={<Image />}
              title="Illustrations"
              value={metrics.illustrations.total}
              change={`+${metrics.illustrations.new} nouvelles`}
              color="from-purple-500 to-purple-700"
              iconBg="bg-purple-500/20"
              iconColor="text-purple-400"
            />
            <StatCard3D
              icon={<FileText />}
              title="Exports"
              value={metrics.exports.total}
              change={`+${metrics.exports.new} nouveaux`}
              color="from-orange-500 to-orange-700"
              iconBg="bg-orange-500/20"
              iconColor="text-orange-400"
            />
          </div>
        )}

        {/* Activity 24h */}
        {metrics && (
          <Card3D className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-orient-gold" />
              <h2 className="text-2xl font-display font-bold text-orient-dark">
                Activité des dernières 24h
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActivityStat
                label="Nouveaux utilisateurs"
                value={metrics.activity_24h.new_users}
              />
              <ActivityStat
                label="Nouveaux projets"
                value={metrics.activity_24h.new_projects}
              />
              <ActivityStat
                label="Illustrations générées"
                value={metrics.activity_24h.new_illustrations}
              />
              <ActivityStat
                label="Exports créés"
                value={metrics.activity_24h.new_exports}
              />
            </div>
          </Card3D>
        )}

        {/* Users Distribution */}
        {metrics && (
          <Card3D className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-orient-gold" />
              <h2 className="text-2xl font-display font-bold text-orient-dark">
                Répartition des utilisateurs
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(metrics.users.by_tier).map(([tier, count]) => (
                <TierStat key={tier} tier={tier} count={count} />
              ))}
            </div>
          </Card3D>
        )}

        {/* Users Table */}
        <Card3D>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-orient-gold" />
              <h2 className="text-2xl font-display font-bold text-orient-dark">
                Gestion des utilisateurs
              </h2>
            </div>

            <div className="flex gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-orient-gold focus:ring-2 focus:ring-orient-gold/20 outline-none"
                />
              </div>

              {/* Filter */}
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-300 focus:border-orient-gold focus:ring-2 focus:ring-orient-gold/20 outline-none"
              >
                <option value="">Tous les tiers</option>
                <option value="free">Free</option>
                <option value="creator">Creator</option>
                <option value="author">Author</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-orient-gold/20">
                  <th className="text-left py-3 px-4 text-orient-dark font-semibold">
                    Utilisateur
                  </th>
                  <th className="text-left py-3 px-4 text-orient-dark font-semibold">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-orient-dark font-semibold">
                    Abonnement
                  </th>
                  <th className="text-left py-3 px-4 text-orient-dark font-semibold">
                    Crédits
                  </th>
                  <th className="text-left py-3 px-4 text-orient-dark font-semibold">
                    Inscription
                  </th>
                  <th className="text-left py-3 px-4 text-orient-dark font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-orient-gold/5 transition"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-orient-dark">
                          {user.full_name || "N/A"}
                        </p>
                        {user.is_admin && (
                          <span className="text-xs bg-orient-gold/20 text-orient-gold px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.subscription_tier}
                        onChange={(e) =>
                          updateUserTier(user.id, e.target.value)
                        }
                        className="px-3 py-1 rounded-lg border border-gray-300 focus:border-orient-gold outline-none text-sm"
                      >
                        <option value="free">Free</option>
                        <option value="creator">Creator</option>
                        <option value="author">Author</option>
                        <option value="studio">Studio</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {user.credits_illustrations || 0}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé
            </div>
          )}
        </Card3D>

        {/* Security Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-orange-600 font-semibold mb-1">
              Accès administrateur sensible
            </h3>
            <p className="text-orange-700 text-sm">
              Vous avez accès aux données de tous les utilisateurs. Respectez la
              confidentialité et les réglementations RGPD.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Components
const StatCard3D = ({
  icon,
  title,
  value,
  change,
  color,
  iconBg,
  iconColor,
}) => {
  return (
    <Card3D hover={true}>
      <div
        className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 ${iconColor}`}
      >
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h3 className="text-gray-600 text-sm mb-1 font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-orient-dark mb-1">
        {value.toLocaleString()}
      </p>
      <p className="text-green-600 text-sm font-semibold">{change}</p>
    </Card3D>
  );
};

const ActivityStat = ({ label, value }) => (
  <div className="bg-orient-gold/5 rounded-xl p-4 border border-orient-gold/20">
    <p className="text-2xl font-bold text-orient-dark">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

const TierStat = ({ tier, count }) => {
  const tierColors = {
    free: "from-gray-400 to-gray-600",
    creator: "from-blue-400 to-blue-600",
    author: "from-purple-400 to-purple-600",
    studio: "from-orient-gold to-amber-600",
  };

  return (
    <div
      className={`bg-gradient-to-br ${tierColors[tier]} rounded-xl p-4 text-white`}
    >
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm mt-1 capitalize opacity-90">{tier}</p>
    </div>
  );
};
