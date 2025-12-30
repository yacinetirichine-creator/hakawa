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
  DollarSign,
  TrendingDown,
  Activity,
  Download,
  FileDown,
  Bell,
  X,
} from "lucide-react";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalIllustrations: 0,
    totalExports: 0,
  });
  const [financials, setFinancials] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    margin: 0,
    marginPercent: 0,
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    fetchAdminData();

    // Mise à jour en temps réel
    const subscription = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchAdminData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchAdminData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "illustrations" },
        () => {
          fetchAdminData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

      // Calcul des financiers en temps réel
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("subscription_tier, subscription_expires_at");

      const { data: illustrationsData } = await supabase
        .from("illustrations")
        .select("id");

      // Calcul du CA basé sur les abonnements actifs
      const tierPrices = {
        free: 0,
        conteur: 9.99,
        pro: 29.99,
        studio: 99.99,
      };

      const now = new Date();
      let totalRevenue = 0;

      profilesData?.forEach((profile) => {
        const expiresAt = new Date(profile.subscription_expires_at);
        if (expiresAt > now && profile.subscription_tier !== "free") {
          totalRevenue += tierPrices[profile.subscription_tier] || 0;
        }
      });

      // Calcul des coûts (estimation OpenAI)
      const costPerIllustration = 0.04; // $0.04 par image DALL-E
      const totalCosts = (illustrationsData?.length || 0) * costPerIllustration;

      // Calcul de la marge
      const margin = totalRevenue - totalCosts;
      const marginPercent =
        totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0;

      setFinancials({
        totalRevenue,
        totalCosts,
        margin,
        marginPercent,
      });

      // Récupérer les derniers utilisateurs avec tri optimisé
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

      // Générer des alertes basées sur les métriques
      generateAlerts({
        margin: financials.margin,
        marginPercent: financials.marginPercent,
        totalUsers: usersRes.count || 0,
        totalCosts: totalCosts,
      });

      // Ajouter aux données historiques (simulation)
      setHistoricalData((prev) => {
        const newData = {
          date: new Date().toISOString(),
          revenue: totalRevenue,
          costs: totalCosts,
          margin: totalRevenue - totalCosts,
          users: usersRes.count || 0,
        };
        const updated = [...prev, newData].slice(-30); // Garder 30 derniers points
        return updated;
      });

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
        .update({
          subscription_tier: newTier,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Mise à jour immédiate de l'état local
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, subscription_tier: newTier } : user
        )
      );
    } catch (error) {
      console.error("Error updating user tier:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const generateAlerts = (metrics) => {
    const newAlerts = [];

    // Alert si marge < 30%
    if (metrics.marginPercent < 30 && metrics.marginPercent > 0) {
      newAlerts.push({
        id: "margin-low",
        type: "warning",
        message: `Marge faible: ${metrics.marginPercent.toFixed(
          1
        )}% - Envisagez d'optimiser les coûts`,
      });
    }

    // Alert si marge négative
    if (metrics.margin < 0) {
      newAlerts.push({
        id: "margin-negative",
        type: "error",
        message: `Marge négative: ${metrics.margin.toFixed(
          2
        )}€ - Action urgente requise!`,
      });
    }

    // Alert si coûts élevés
    if (metrics.totalCosts > 100) {
      newAlerts.push({
        id: "costs-high",
        type: "info",
        message: `Coûts de production élevés: ${metrics.totalCosts.toFixed(
          2
        )}€`,
      });
    }

    // Alert si croissance utilisateurs
    if (metrics.totalUsers > 50) {
      newAlerts.push({
        id: "users-milestone",
        type: "success",
        message: `Milestone atteint: ${metrics.totalUsers} utilisateurs!`,
      });
    }

    setAlerts(newAlerts);
  };

  const exportToCSV = () => {
    const csvData = [
      [
        "Date",
        "CA (€)",
        "Coûts (€)",
        "Marge (€)",
        "Utilisateurs",
        "Projets",
        "Illustrations",
      ],
      [
        new Date().toLocaleDateString("fr-FR"),
        financials.totalRevenue.toFixed(2),
        financials.totalCosts.toFixed(2),
        financials.margin.toFixed(2),
        stats.totalUsers,
        stats.totalProjects,
        stats.totalIllustrations,
      ],
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hakawa-admin-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    // Créer un contenu HTML pour le PDF
    const content = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #D4AF37; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #1a1a2e; color: #D4AF37; }
          .metric { margin: 10px 0; padding: 10px; background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>📊 Rapport Admin Hakawa</h1>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
        
        <h2>💰 Métriques Financières</h2>
        <div class="metric"><strong>Chiffre d'Affaires:</strong> ${financials.totalRevenue.toFixed(
          2
        )} €</div>
        <div class="metric"><strong>Coûts de Production:</strong> ${financials.totalCosts.toFixed(
          2
        )} €</div>
        <div class="metric"><strong>Marge Brute:</strong> ${financials.margin.toFixed(
          2
        )} € (${financials.marginPercent.toFixed(1)}%)</div>
        
        <h2>📈 Statistiques</h2>
        <table>
          <tr><th>Métrique</th><th>Valeur</th></tr>
          <tr><td>Utilisateurs</td><td>${stats.totalUsers}</td></tr>
          <tr><td>Projets</td><td>${stats.totalProjects}</td></tr>
          <tr><td>Illustrations</td><td>${stats.totalIllustrations}</td></tr>
          <tr><td>Exports</td><td>${stats.totalExports}</td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const win = window.open(url);
    setTimeout(() => {
      win.print();
    }, 250);
  };

  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-or" />
              <h1 className="text-4xl font-display font-bold text-or">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/30 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
          <p className="text-sable">
            Bienvenue, {profile?.full_name || "Admin"}
          </p>
        </div>

        {/* Alertes */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between p-4 rounded-lg border ${
                  alert.type === "error"
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : alert.type === "warning"
                    ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                    : alert.type === "success"
                    ? "bg-green-500/10 border-green-500/50 text-green-400"
                    : "bg-blue-500/10 border-blue-500/50 text-blue-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{alert.message}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

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

        {/* Graphique d'évolution */}
        {historicalData.length > 0 && (
          <div className="bg-nuit-light rounded-xl p-6 border border-or/20 mb-8">
            <h2 className="text-2xl font-display font-bold text-or mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Évolution des Métriques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-bleu-nuit/50 rounded-lg p-4">
                <p className="text-sable text-sm mb-1">CA Moyen</p>
                <p className="text-2xl font-bold text-green-400">
                  {(
                    historicalData.reduce((acc, d) => acc + d.revenue, 0) /
                    historicalData.length
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-bleu-nuit/50 rounded-lg p-4">
                <p className="text-sable text-sm mb-1">Coûts Moyens</p>
                <p className="text-2xl font-bold text-orange-400">
                  {(
                    historicalData.reduce((acc, d) => acc + d.costs, 0) /
                    historicalData.length
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-bleu-nuit/50 rounded-lg p-4">
                <p className="text-sable text-sm mb-1">Marge Moyenne</p>
                <p className="text-2xl font-bold text-blue-400">
                  {(
                    historicalData.reduce((acc, d) => acc + d.margin, 0) /
                    historicalData.length
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-1">
              {historicalData.slice(-10).map((data, index) => {
                const maxRevenue = Math.max(
                  ...historicalData.map((d) => d.revenue)
                );
                const height =
                  maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-green-500/20 rounded-t"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: "20%" }}
                      />
                    </div>
                    <span className="text-xs text-sable rotate-45 origin-left">
                      {new Date(data.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cartes Financières */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Chiffre d'Affaires"
            value={`${financials.totalRevenue.toFixed(2)} €`}
            trend="+12.5%"
            trendUp={true}
          />
          <FinancialCard
            icon={<TrendingDown className="w-6 h-6" />}
            title="Coûts Production"
            value={`${financials.totalCosts.toFixed(2)} €`}
            subtitle={`~${stats.totalIllustrations} illustrations`}
            trendUp={false}
          />
          <FinancialCard
            icon={<Activity className="w-6 h-6" />}
            title="Marge Brute"
            value={`${financials.margin.toFixed(2)} €`}
            trend={`${financials.marginPercent.toFixed(1)}%`}
            trendUp={financials.margin > 0}
          />
          <FinancialCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Taux de Marge"
            value={`${financials.marginPercent.toFixed(1)}%`}
            subtitle={
              financials.marginPercent > 60
                ? "Excellent"
                : financials.marginPercent > 30
                ? "Bon"
                : "À améliorer"
            }
            trendUp={financials.marginPercent > 30}
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
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-or/10 hover:bg-bleu-nuit/30 transition-colors"
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
                        className="bg-bleu-nuit text-parchemin border border-or/30 rounded px-3 py-1.5 text-sm hover:border-or/50 focus:border-or focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="free">Free (0€)</option>
                        <option value="conteur">Conteur (9.99€)</option>
                        <option value="pro">Pro (29.99€)</option>
                        <option value="studio">Studio (99.99€)</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          user.credits_illustrations > 50
                            ? "text-green-400"
                            : user.credits_illustrations > 10
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {user.credits_illustrations}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sable text-sm">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
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

const FinancialCard = ({ icon, title, value, trend, trendUp, subtitle }) => {
  return (
    <div className="bg-gradient-to-br from-nuit-light to-bleu-nuit rounded-xl p-6 border border-or/20 hover:border-or/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${
            trendUp ? "bg-green-500/10" : "bg-orange-500/10"
          } rounded-lg flex items-center justify-center ${
            trendUp ? "text-green-400" : "text-orange-400"
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-sm font-semibold px-2 py-1 rounded ${
              trendUp
                ? "text-green-400 bg-green-500/10"
                : "text-orange-400 bg-orange-500/10"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sable text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold text-parchemin mb-1">{value}</p>
      {subtitle && <p className="text-xs text-sable">{subtitle}</p>}
    </div>
  );
};
