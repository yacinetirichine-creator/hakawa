import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Copy,
  Check,
  Sparkles,
  Image,
  Filter,
  Heart,
  TrendingUp,
} from "lucide-react";
import { ILLUSTRATION_PROMPTS_LIBRARY } from "../../data/templates";
import { useTranslation } from "react-i18next";

export default function PromptLibrary({ onSelectPrompt }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    "all",
    ...ILLUSTRATION_PROMPTS_LIBRARY.map((cat) => cat.category),
  ];

  const filteredPrompts = ILLUSTRATION_PROMPTS_LIBRARY.filter((cat) => {
    if (selectedCategory !== "all" && cat.category !== selectedCategory)
      return false;
    if (
      searchTerm &&
      !cat.prompts.some((p) =>
        p.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
      return false;
    return true;
  }).flatMap((cat) =>
    cat.prompts
      .filter(
        (p) => !searchTerm || p.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((p) => ({ prompt: p, category: cat.category }))
  );

  const popularPrompts = [
    t("prompts.popular.0"),
    t("prompts.popular.1"),
    t("prompts.popular.2"),
    t("prompts.popular.3"),
  ];

  const handleCopyPrompt = (prompt, index) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleFavorite = (index) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image className="w-6 h-6 text-or" />
        <h2 className="text-2xl font-bold text-or">{t("prompts.title")}</h2>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-parchemin/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("prompts.search_placeholder")}
            className="w-full pl-12 pr-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin placeholder:text-parchemin/30 focus:outline-none focus:border-or"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-parchemin/50" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-12 pr-8 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin focus:outline-none focus:border-or appearance-none"
          >
            <option value="all">{t("prompts.all_categories")}</option>
            {ILLUSTRATION_PROMPTS_LIBRARY.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Popular Prompts */}
      {selectedCategory === "all" && !searchTerm && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-or" />
            <h3 className="font-bold text-parchemin">
              {t("prompts.popular_title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
                className="p-4 bg-gradient-to-r from-or/20 to-or/10 border border-or/30 rounded-lg text-left hover:border-or/50 transition-all"
              >
                <p className="text-sm text-parchemin/90">{prompt}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-or" />
                  <span className="text-xs text-or">
                    {t("prompts.very_used")}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Prompts List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-parchemin">
            {t("prompts.count", { count: filteredPrompts.length })}
          </h3>
          {favorites.size > 0 && (
            <button
              onClick={() => {
                /* Filter by favorites */
              }}
              className="flex items-center gap-2 px-3 py-1 bg-or/20 rounded-lg text-sm text-or hover:bg-or/30 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {t("prompts.favorites_count", { count: favorites.size })}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredPrompts.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-bleu-nuit/50 border border-or/10 rounded-lg hover:border-or/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-parchemin/90 leading-relaxed mb-2">
                    {item.prompt}
                  </p>
                  <span className="inline-block px-2 py-1 bg-or/10 rounded text-xs text-or">
                    {item.category}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(idx)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.has(idx)
                        ? "bg-red-500/20 text-red-500"
                        : "bg-or/10 text-parchemin/50 hover:text-or"
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={favorites.has(idx) ? "currentColor" : "none"}
                    />
                  </button>

                  <button
                    onClick={() => handleCopyPrompt(item.prompt, idx)}
                    className="p-2 bg-or/10 hover:bg-or/20 text-or rounded-lg transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {onSelectPrompt && (
                    <button
                      onClick={() => onSelectPrompt(item.prompt)}
                      className="px-3 py-2 bg-gradient-to-r from-or to-or/80 text-bleu-nuit text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      {t("prompts.use")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-parchemin/30 mx-auto mb-4" />
              <p className="text-parchemin/70">{t("prompts.empty")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-or/10 border border-or/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-or flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-parchemin mb-2">
              {t("prompts.tips_title")}
            </p>
            <ul className="text-sm text-parchemin/80 space-y-1">
              <li>• {t("prompts.tips.0")}</li>
              <li>• {t("prompts.tips.1")}</li>
              <li>• {t("prompts.tips.2")}</li>
              <li>• {t("prompts.tips.3")}</li>
              <li>• {t("prompts.tips.4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
