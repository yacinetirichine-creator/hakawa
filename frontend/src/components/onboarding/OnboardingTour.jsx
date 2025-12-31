import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const getTourSteps = (t) => [
  {
    id: "welcome",
    title: t("onboarding.steps.welcome.title"),
    description: t("onboarding.steps.welcome.description"),
    target: null,
    position: "center",
  },
  {
    id: "dashboard",
    title: t("onboarding.steps.dashboard.title"),
    description: t("onboarding.steps.dashboard.description"),
    target: ".dashboard-overview",
    position: "bottom",
  },
  {
    id: "new-project",
    title: t("onboarding.steps.new_project.title"),
    description: t("onboarding.steps.new_project.description"),
    target: ".btn-new-project",
    position: "bottom",
  },
  {
    id: "projects",
    title: t("onboarding.steps.projects.title"),
    description: t("onboarding.steps.projects.description"),
    target: ".nav-projects",
    position: "right",
  },
  {
    id: "inspiration",
    title: t("onboarding.steps.inspiration.title"),
    description: t("onboarding.steps.inspiration.description"),
    target: ".nav-inspiration",
    position: "right",
  },
  {
    id: "settings",
    title: t("onboarding.steps.settings.title"),
    description: t("onboarding.steps.settings.description"),
    target: ".nav-settings",
    position: "right",
  },
  {
    id: "complete",
    title: t("onboarding.steps.complete.title"),
    description: t("onboarding.steps.complete.description"),
    target: null,
    position: "center",
  },
];

export function OnboardingTour({ onComplete }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const TOUR_STEPS = React.useMemo(() => getTourSteps(t), [t]);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le tour
    const hasSeenTour = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const skipTour = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isCenter = step.position === "center";

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
        onClick={skipTour}
      >
        {/* Tooltip */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative bg-white rounded-2xl shadow-2xl max-w-md ${
            isCenter ? "mx-4" : ""
          }`}
        >
          {/* Close button */}
          <button
            onClick={skipTour}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon/Emoji */}
            <div className="text-5xl mb-4 text-center">
              {currentStep === 0 && "🌙"}
              {currentStep === 1 && "📊"}
              {currentStep === 2 && "✍️"}
              {currentStep === 3 && "📚"}
              {currentStep === 4 && "💡"}
              {currentStep === 5 && "⚙️"}
              {currentStep === TOUR_STEPS.length - 1 && "🎉"}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-display font-bold text-orient-dark mb-3">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    index <= currentStep ? "bg-orient-purple" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={skipTour}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {t("onboarding.actions.skip")}
              </button>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("onboarding.actions.previous")}
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orient-purple to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  {currentStep === TOUR_STEPS.length - 1 ? (
                    <>
                      {t("onboarding.actions.finish")}
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      {t("onboarding.actions.next")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step counter */}
            <div className="text-center mt-4 text-sm text-gray-400">
              {t("onboarding.progress", {
                current: currentStep + 1,
                total: TOUR_STEPS.length,
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
