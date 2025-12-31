import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { usePricing } from "../../hooks/usePricing";
import { Button } from "./Button";
import { Card } from "./Card";
import { RegionSelector } from "./RegionSelector";

export const PricingSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { region, convertFromEur, format } = usePricing();

  const DEFAULT_PLANS = [
    {
      id: "free",
      price_monthly: 0,
      price_annual: 0,
      features: [
        "projects_1",
        "chapters_3_per_project",
        "ai_generations_5_per_day",
        "images_2_per_month",
        "styles_1",
        "export_pdf_watermark",
        "kids_mode",
      ],
      popular: false,
    },
    {
      id: "conteur",
      price_monthly: 19,
      price_annual: 149,
      features: [
        "projects_5",
        "chapters_unlimited",
        "ai_generations_50_per_day",
        "images_20_per_month",
        "styles_3",
        "export_pdf_epub",
        "export_kdp_basic",
        "kids_mode",
        "email_support",
      ],
      popular: false,
    },
    {
      id: "auteur",
      price_monthly: 39,
      price_annual: 319,
      features: [
        "projects_unlimited",
        "ai_generations_unlimited",
        "images_80_per_month",
        "styles_all",
        "export_kdp_full",
        "ai_cover",
        "priority_generation",
        "priority_support",
      ],
      popular: true,
    },
    {
      id: "studio",
      price_monthly: 99,
      price_annual: 799,
      features: [
        "everything_auteur",
        "images_200_per_month",
        "api_access",
        "white_label",
        "dedicated_support",
        "training_1to1",
      ],
      popular: false,
    },
  ];

  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const response = await api.get("/stripe/pricing");
      if (
        response.data &&
        response.data.plans &&
        Array.isArray(response.data.plans) &&
        response.data.plans.length > 0
      ) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des prix (utilisation des valeurs par défaut):",
        error
      );
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
        plan_id: plan.id,
        region_code: region.code,
        currency: region.currency,
        billing_period: billingPeriod,
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      alert(
        t("pricing.errors.checkout", {
          defaultValue: "Une erreur est survenue. Veuillez réessayer.",
        })
      );
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

  const getPlanDisplayName = (plan) => {
    const translated = t(`pricing.plans.${plan.id}.name`, { defaultValue: "" });
    if (translated) return `${getPlanIcon(plan.id)} ${translated}`;
    return plan.name || `${getPlanIcon(plan.id)} ${plan.id}`;
  };

  const getPlanDescription = (plan) => {
    const translated = t(`pricing.plans.${plan.id}.description`, {
      defaultValue: "",
    });
    return translated || plan.description || "";
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
            {t("pricing.title", { defaultValue: "Choisissez votre plan" })}
          </h2>
          <p className="text-xl text-orient-text mb-8">
            {t("pricing.subtitle", {
              defaultValue: "Créez des histoires extraordinaires avec l'IA",
            })}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <RegionSelector />
            <p className="text-xs text-gray-500">
              {t("pricing.price_for_region", {
                region: region.code,
                defaultValue: `Prix pour ${region.code}`,
              })}
            </p>
          </div>

          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-orient-purple text-white"
                  : "text-gray-600"
              }`}
            >
              {t("pricing.billing.monthly", { defaultValue: "Mensuel" })}
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingPeriod === "annual"
                  ? "bg-orient-purple text-white"
                  : "text-gray-600"
              }`}
            >
              {t("pricing.billing.annual", { defaultValue: "Annuel" })}
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const savings = getSavings(plan);

            const basePriceEur =
              billingPeriod === "monthly"
                ? plan.price_monthly
                : plan.price_annual;

            const displayPrice =
              basePriceEur === 0
                ? t("pricing.free_label", { defaultValue: "Gratuit" })
                : format(convertFromEur(basePriceEur));

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
                    ⭐ {t("pricing.popular", { defaultValue: "Populaire" })}
                  </div>
                )}

                <div className="p-6 flex-grow">
                  <div className="mb-6">
                    <div className="text-4xl mb-2">{getPlanIcon(plan.id)}</div>
                    <h3 className="text-xl font-bold text-orient-dark mb-2">
                      {getPlanDisplayName(plan)}
                    </h3>
                    {getPlanDescription(plan) ? (
                      <p className="text-sm text-gray-600 mb-4">
                        {getPlanDescription(plan)}
                      </p>
                    ) : null}

                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-orient-dark">
                          {displayPrice}
                        </span>
                        {basePriceEur !== 0 ? (
                          <span className="text-gray-600 ml-2">
                            {billingPeriod === "monthly"
                              ? t("pricing.per_month", {
                                  defaultValue: "/mois",
                                })
                              : t("pricing.per_year", { defaultValue: "/an" })}
                          </span>
                        ) : null}
                      </div>

                      {billingPeriod === "annual" &&
                      savings &&
                      basePriceEur !== 0 ? (
                        <div className="text-sm text-green-600 mt-1">
                          {t("pricing.save_amount", {
                            amount: format(convertFromEur(savings.amount)),
                            percent: savings.percentage,
                            defaultValue: `Économisez ${format(
                              convertFromEur(savings.amount)
                            )} (${savings.percentage}%)`,
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          {t(`pricing.features.${feature}`, {
                            defaultValue: feature,
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-orient-purple hover:bg-orient-purple/90 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {plan.id === "free"
                      ? t("pricing.buttons.start_free", {
                          defaultValue: "Commencer",
                        })
                      : t("pricing.buttons.try_7_days", {
                          defaultValue: "Essayer 7 jours",
                        })}
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
