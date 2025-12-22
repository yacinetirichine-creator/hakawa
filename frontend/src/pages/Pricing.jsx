import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function Pricing() {
  const [searchParams] = useSearchParams();
  const [billingPeriod, setBillingPeriod] = useState(() => {
    const billing = searchParams.get("billing");
    return billing === "annual" ? "annual" : "monthly";
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const planParam = searchParams.get("plan");

  useEffect(() => {
    fetchPricing();
  }, []);

  useEffect(() => {
    if (plans.length > 0 && planParam && user) {
      const selectedPlan = plans.find((p) => p.id === planParam);
      if (selectedPlan) {
        handleSubscribe(selectedPlan);
      }
    }
  }, [plans, planParam, user]);

  const fetchPricing = async () => {
    try {
      const response = await api.get("/stripe/pricing");
      setPlans(response.data.plans);
    } catch (error) {
      console.error("Erreur lors du chargement des prix:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate(
        `/register?plan=${encodeURIComponent(
          plan.id
        )}&billing=${encodeURIComponent(billingPeriod)}`
      );
      return;
    }

    if (plan.id === "free") {
      navigate("/dashboard");
      return;
    }

    try {
      const priceId =
        billingPeriod === "monthly"
          ? plan.stripe_price_id_monthly
          : plan.stripe_price_id_annual;

      const response = await api.post("/stripe/create-checkout-session", {
        price_id: priceId,
        billing_period: billingPeriod,
      });

      // Rediriger vers Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const getPlanIcon = (planId) => {
    const icons = {
      free: "🌙",
      conteur: "✨",
      auteur: "📚",
      studio: "🏢",
    };
    return icons[planId] || "✨";
  };

  const getSavings = (plan) => {
    if (!plan.price_annual || !plan.price_monthly) return null;
    const monthlyTotal = plan.price_monthly * 12;
    const savings = monthlyTotal - plan.price_annual;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Créez des histoires extraordinaires avec l'IA
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingPeriod === "annual"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="max-w-xl mx-auto mb-12">
            <Card className="p-8 border border-gray-200 dark:border-gray-700 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Plans indisponibles
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Impossible de charger les plans pour le moment. Réessayez.
              </p>
              <Button
                onClick={fetchPricing}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Réessayer
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => {
              const savings = getSavings(plan);
              const price =
                billingPeriod === "monthly"
                  ? plan.price_monthly
                  : plan.price_annual;
              const pricePerMonth =
                billingPeriod === "annual"
                  ? (plan.price_annual / 12).toFixed(2)
                  : price;

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden ${
                    plan.popular
                      ? "border-2 border-purple-500 shadow-xl scale-105"
                      : "border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                      ⭐ Populaire
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <div className="text-4xl mb-2">
                        {getPlanIcon(plan.id)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-4">
                        {price === 0 ? (
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            Gratuit
                          </div>
                        ) : (
                          <>
                            <div className="flex items-baseline">
                              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                {price}€
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 ml-2">
                                /{billingPeriod === "monthly" ? "mois" : "an"}
                              </span>
                            </div>
                            {billingPeriod === "annual" && savings && (
                              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Économisez {savings.amount}€ (
                                {savings.percentage}
                                %)
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full ${
                        plan.popular
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                      }`}
                    >
                      {plan.id === "free" ? "Commencer" : "Essayer 7 jours"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Avantages vs concurrence */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Pourquoi Hakawa
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
            Pensé pour la création d'histoires jeunesse, de l'idée jusqu'à
            l'export.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Hakawa
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Parcours guidé: idée → chapitres → illustrations → export
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Exports prêts pour l'édition (PDF / EPUB / KDP)
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    IA calibrée pour les enfants (ton, vocabulaire, structure)
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Un style graphique cohérent d'une illustration à l'autre
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Solutions génériques
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-gray-400">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Outils séparés: écriture d'un côté, images de l'autre
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-gray-400">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Exports souvent manuels (mise en page, formats, packaging)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-gray-400">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Peu optimisé pour la jeunesse (niveau, rythme, sécurité)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-gray-400">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Styles d'images difficiles à garder cohérents
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Comparaison détaillée
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-900 dark:text-white font-medium">
                    Fonctionnalité
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center">
                      <div className="text-2xl mb-1">
                        {getPlanIcon(plan.id)}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {plan.name.replace(/^[^\s]+\s/, "")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    Projets
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="py-3 px-4 text-center text-gray-900 dark:text-white"
                    >
                      {plan.limits.projects === 999999
                        ? "Illimité"
                        : plan.limits.projects}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    Générations IA/jour
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="py-3 px-4 text-center text-gray-900 dark:text-white"
                    >
                      {plan.limits.ai_generations_daily === 999999
                        ? "Illimité"
                        : plan.limits.ai_generations_daily}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    Illustrations/mois
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="py-3 px-4 text-center text-gray-900 dark:text-white"
                    >
                      {plan.limits.illustrations_monthly}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    Styles d'illustration
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="py-3 px-4 text-center text-gray-900 dark:text-white"
                    >
                      {plan.limits.illustration_styles === 999
                        ? "Tous"
                        : plan.limits.illustration_styles}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Puis-je annuler à tout moment ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis
                votre tableau de bord. Aucune pénalité, aucune question posée.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Puis-je changer de plan ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolument ! Vous pouvez upgrader ou downgrader votre plan à
                tout moment. Les changements prennent effet immédiatement.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Y a-t-il une garantie de remboursement ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Oui ! Garantie satisfait ou remboursé de 30 jours sur tous les
                plans payants.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
