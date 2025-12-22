import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/stripe/subscription/status");
      setSubscription(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'abonnement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await api.post("/stripe/create-portal-session");
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erreur lors de l'ouverture du portail:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const getTierInfo = (tier) => {
    const info = {
      free: {
        name: "🌙 Gratuit",
        color: "gray",
        features: [
          "1 projet",
          "3 chapitres",
          "5 générations IA/jour",
          "2 illustrations",
        ],
      },
      conteur: {
        name: "✨ Conteur",
        color: "blue",
        features: [
          "5 projets",
          "Chapitres illimités",
          "50 générations IA/jour",
          "20 illustrations/mois",
        ],
      },
      auteur: {
        name: "📚 Auteur",
        color: "purple",
        features: [
          "Projets illimités",
          "Générations IA illimitées",
          "80 illustrations/mois",
          "Tous les styles",
        ],
      },
      studio: {
        name: "🏢 Studio",
        color: "indigo",
        features: [
          "Tout du plan Auteur",
          "200 illustrations/mois",
          "Accès API",
          "White-label",
        ],
      },
    };
    return info[tier] || info.free;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const tierInfo = getTierInfo(subscription.tier);
  const isActive = subscription.is_active;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Votre abonnement
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez votre plan et vos paiements
            </p>
          </div>
          <Badge
            className={`bg-${tierInfo.color}-100 text-${tierInfo.color}-800`}
          >
            {tierInfo.name}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Plan Info */}
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Plan actuel
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {tierInfo.name}
              </div>
            </div>

            {isActive && subscription.expires_at && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Renouvellement
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(subscription.expires_at)}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Crédits illustrations
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscription.credits_illustrations.toLocaleString("fr-FR")}
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Fonctionnalités incluses
            </div>
            <ul className="space-y-2">
              {tierInfo.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {isActive ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleManageSubscription}
                className="flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Gérer mon abonnement
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/pricing")}
              >
                Changer de plan
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Plan gratuit
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Passez à un plan payant pour débloquer toutes les
                      fonctionnalités de Hakawa
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => (window.location.href = "/pricing")}
                className="w-full sm:w-auto"
              >
                Voir les plans
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Benefits */}
      {!isActive && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Pourquoi passer à un plan premium ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-3">
                <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Créations illimitées
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Créez autant de projets que vous voulez
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-3">
                <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Plus d'illustrations
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Jusqu'à 200 illustrations IA par mois
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-3">
                <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Export professionnel
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  PDF, EPUB, et format KDP prêt à publier
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-3">
                <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Support prioritaire
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Réponses rapides à toutes vos questions
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payment History */}
      {isActive && subscription.stripe_customer_id && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Historique des paiements
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Consultez votre historique de paiements complet dans le portail
            client Stripe.
          </p>
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            className="mt-4"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Voir l'historique
          </Button>
        </Card>
      )}
    </div>
  );
}
