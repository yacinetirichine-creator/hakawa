import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Settings } from "lucide-react";
import { Button } from "../ui/Button";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, not changeable
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("hakawa_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const saved = JSON.parse(consent);
      setPreferences(saved);
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem("hakawa_cookie_consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("hakawa_cookie_consent", JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const rejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem(
      "hakawa_cookie_consent",
      JSON.stringify(essentialOnly)
    );
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {!showSettings ? (
            // Simple banner
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orient-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <Cookie className="w-6 h-6 text-orient-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-2">
                    🍪 Nous utilisons des cookies
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience,
                    analyser le trafic et personnaliser le contenu. En cliquant
                    sur "Tout accepter", vous consentez à l'utilisation de TOUS
                    les cookies. Vous pouvez également personnaliser vos
                    préférences.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={acceptAll} className="flex-1 md:flex-none">
                      Tout accepter
                    </Button>
                    <Button
                      onClick={rejectNonEssential}
                      variant="outline"
                      className="flex-1 md:flex-none"
                    >
                      Rejeter non essentiels
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      className="flex-1 md:flex-none"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Personnaliser
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Pour en savoir plus, consultez notre{" "}
                    <a
                      href="/privacy"
                      className="text-orient-purple underline hover:text-orient-blue"
                    >
                      Politique de confidentialité
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Settings panel
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-gray-900">
                  Paramètres des cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Cookies essentiels
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nécessaires au fonctionnement du site (authentification,
                      sécurité). Toujours activés.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 rounded border-gray-300 text-orient-purple opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Cookies d'analyse
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nous aident à comprendre comment vous utilisez le site
                      pour l'améliorer (données anonymisées).
                    </p>
                  </div>
                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          analytics: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-orient-purple focus:ring-orient-purple cursor-pointer"
                    />
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-gray-900 mb-1">
                      Cookies marketing
                    </h4>
                    <p className="text-sm text-gray-600">
                      Utilisés pour afficher des publicités pertinentes et
                      mesurer l'efficacité des campagnes.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          marketing: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-orient-purple focus:ring-orient-purple cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={savePreferences} className="flex-1">
                  Enregistrer mes préférences
                </Button>
                <Button
                  onClick={acceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  Tout accepter
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
