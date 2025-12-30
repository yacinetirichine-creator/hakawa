import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Book, Users, MapPin, Zap } from "lucide-react";
import { PROJECT_TEMPLATES } from "../../data/templates";

export default function TemplateSelector({ onClose, onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleConfirm = () => {
    onSelectTemplate(selectedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-bleu-nuit to-bleu-nuit/90 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-or/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-or/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-or" />
              <h2 className="text-2xl font-bold text-or">
                Choisissez votre Template
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-or/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-parchemin" />
            </button>
          </div>
          <p className="text-parchemin/70 mt-2">
            Démarrez rapidement avec un template pré-configuré ou partez de zéro
          </p>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-180px)]">
          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECT_TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedTemplate?.id === template.id
                      ? "border-or bg-or/10"
                      : "border-or/20 bg-bleu-nuit/50 hover:border-or/40"
                  }`}
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-lg font-bold text-or mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-parchemin/70">
                    {template.description}
                  </p>
                  <div className="mt-4 inline-block px-3 py-1 bg-or/20 rounded-full text-xs text-or">
                    {template.genre}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <AnimatePresence>
            {showPreview && selectedTemplate && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="w-96 border-l border-or/20 bg-bleu-nuit/30 overflow-y-auto"
              >
                <div className="p-6 sticky top-0 bg-bleu-nuit/90 backdrop-blur-sm border-b border-or/20">
                  <div className="text-4xl mb-3">{selectedTemplate.icon}</div>
                  <h3 className="text-xl font-bold text-or mb-2">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-parchemin/70">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {selectedTemplate.id !== "blank" && (
                    <>
                      {/* Starting Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Book className="w-5 h-5 text-or" />
                          <h4 className="font-bold text-parchemin">
                            Contenu de départ
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-parchemin/50 mb-1">
                              Titre
                            </p>
                            <p className="text-sm text-parchemin">
                              {selectedTemplate.startingPrompt.title}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-parchemin/50 mb-1">
                              Synopsis
                            </p>
                            <p className="text-sm text-parchemin/80">
                              {selectedTemplate.startingPrompt.synopsis}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Characters */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-or" />
                          <h4 className="font-bold text-parchemin">
                            Personnages
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {selectedTemplate.startingPrompt.characters.map(
                            (char, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-bleu-nuit/50 rounded-lg border border-or/10"
                              >
                                <p className="text-sm font-bold text-or">
                                  {char.name}
                                </p>
                                <p className="text-xs text-parchemin/50">
                                  {char.role}
                                </p>
                                <p className="text-xs text-parchemin/70 mt-1">
                                  {char.description}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* World Building */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-or" />
                          <h4 className="font-bold text-parchemin">Univers</h4>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-parchemin/50">Cadre</p>
                            <p className="text-sm text-parchemin">
                              {
                                selectedTemplate.startingPrompt.worldBuilding
                                  .setting
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-parchemin/50">
                              Atmosphère
                            </p>
                            <p className="text-sm text-parchemin">
                              {
                                selectedTemplate.startingPrompt.worldBuilding
                                  .atmosphere
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-parchemin/50">Conflit</p>
                            <p className="text-sm text-parchemin">
                              {
                                selectedTemplate.startingPrompt.worldBuilding
                                  .conflict
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Default Settings */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-5 h-5 text-or" />
                          <h4 className="font-bold text-parchemin">
                            Paramètres par défaut
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-or/20 rounded-full text-xs text-or">
                            {selectedTemplate.defaultSettings.tone}
                          </span>
                          <span className="px-3 py-1 bg-or/20 rounded-full text-xs text-or">
                            {selectedTemplate.defaultSettings.targetAudience}
                          </span>
                          <span className="px-3 py-1 bg-or/20 rounded-full text-xs text-or">
                            {selectedTemplate.defaultSettings.length}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedTemplate.id === "blank" && (
                    <div className="text-center py-8">
                      <p className="text-parchemin/70">
                        Créez votre propre histoire de A à Z
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-or/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-or/30 text-parchemin hover:bg-or/10 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTemplate}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTemplate
                ? "bg-gradient-to-r from-or to-or/80 text-bleu-nuit hover:shadow-lg hover:shadow-or/20"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Utiliser ce template
          </button>
        </div>
      </motion.div>
    </div>
  );
}
