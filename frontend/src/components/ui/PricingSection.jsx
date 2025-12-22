import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export const PricingSection = () => {
  const DEFAULT_PLANS = [
    {
      id: "free",
      name: "🌙 Gratuit",
      price_monthly: 0,
      price_annual: 0,
      features: [
        "1 projet",
        "3 chapitres par projet",
        "5 générations IA/jour",
        "2 illustrations/mois",
        "1 style d'illustration",
        "Export PDF avec watermark",
        "Mode enfant",
      ],
      popular: false,
    },
    {
      id: "conteur",
      name: "✨ Conteur",
      price_monthly: 19,
      price_annual: 149,
      features: [
        "5 projets",
        "Chapitres illimités",
        "50 générations IA/jour",
        "20 illustrations/mois",
        "3 styles d'illustration",
        "Export PDF + EPUB",
        "Export KDP basique",
        "Mode enfant",
        "Support email",
      ],
      popular: false,
    },
    {
      id: "auteur",
      name: "📚 Auteur",
      price_monthly: 39,
      price_annual: 319,
      features: [
        "Projets illimités",
        "Générations IA illimitées",
        "80 illustrations/mois",
        "Tous les styles",
        "Export KDP complet",
        "Couverture IA",
        "Priorité de génération",
        "Support prioritaire",
      ],
      popular: true,
    },
    {
      id: "studio",
      name: "🏢 Studio",
      price_monthly: 99,
      price_annual: 799,
      features: [
        "Tout du plan Auteur",
        "200 illustrations/mois",
        "Accès API",
        "White-label",
        "Support dédié",
        "Formation 1-to-1",
      ],
      popular: false,
    },
  ];

  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await api.get("/stripe/pricing");
      if (
        response.data &&
        response.data.plans &&
        response.data.plans.length > 0
      ) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des prix (utilisation des valeurs par défaut):",
        error
      );
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      // Redirect to register with plan param
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
      <div className="py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orient-purple"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-orient-dark mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-orient-text mb-8">
            Créez des histoires extraordinaires avec l'IA
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-orient-purple text-white"
                  : "text-gray-600"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingPeriod === "annual"
                  ? "bg-orient-purple text-white"
                  : "text-gray-600"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const savings = getSavings(plan);
            const price =
              billingPeriod === "monthly"
                ? plan.price_monthly
                : plan.price_annual;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden flex flex-col ${
                  plan.popular
                    ? "border-2 border-orient-purple shadow-xl scale-105 z-10"
                    : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-orient-purple text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    ⭐ Populaire
                  </div>
                )}

                <div className="p-6 flex-grow">
                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className="text-4xl mb-2">{getPlanIcon(plan.id)}</div>
                    <h3 className="text-xl font-bold text-orient-dark mb-2">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      {price === 0 ? (
                        <div className="text-3xl font-bold text-orient-dark">
                          Gratuit
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-orient-dark">
                              {price}€
                            </span>
                            <span className="text-gray-600 ml-2">
                              /{billingPeriod === "monthly" ? "mois" : "an"}
                            </span>
                          </div>
                          {billingPeriod === "annual" && savings && (
                            <div className="text-sm text-green-600 mt-1">
                              Économisez {savings.amount}€ ({savings.percentage}
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
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-orient-purple hover:bg-orient-purple/90 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {plan.id === "free" ? "Commencer" : "Essayer 7 jours"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
