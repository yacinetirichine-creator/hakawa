import React from "react";
import { motion } from "framer-motion";
import { Scroll, Moon, Star, Sparkles } from "lucide-react";
import Storyteller3D from "./Storyteller3D";
import { useTranslation } from "react-i18next";

export const StorySection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative overflow-hidden bg-bleu-nuit text-white">
      {/* Background (storytelling night) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-orient-purple/25 via-transparent to-black/40" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-orient-gold/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -right-48 w-[620px] h-[620px] bg-orient-blue/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-25">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="story-stars"
                x="0"
                y="0"
                width="64"
                height="64"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="12" r="1" fill="currentColor" />
                <circle cx="42" cy="18" r="1.2" fill="currentColor" />
                <circle cx="30" cy="44" r="1" fill="currentColor" />
                <circle cx="56" cy="52" r="0.9" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#story-stars)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orient-gold/20 text-orient-gold rounded-full font-bold text-sm mb-6 border border-orient-gold/30">
              <Scroll size={16} />
              <span>{t("landing.story.badge")}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {t("landing.story.title_prefix")}{" "}
              <span className="text-orient-gold">
                {t("landing.story.title_highlight")}
              </span>
            </h2>

            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>{t("landing.story.p1")}</p>
              <p>{t("landing.story.p2")}</p>
              <p>{t("landing.story.p3")}</p>
            </div>

            <div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-orient-gold backdrop-blur-sm">
              <p className="italic text-xl text-white font-display">
                {t("landing.story.quote")}
              </p>
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative Circle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orient-purple to-orient-gold rounded-full opacity-20 blur-3xl animate-pulse"></div>

            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 shadow-2xl">
              <div className="absolute -top-6 -right-6 bg-orient-gold p-4 rounded-full shadow-lg animate-bounce">
                <Moon size={32} className="text-white fill-current" />
              </div>

              <div className="space-y-8">
                {/* Illustration: conteur assis */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-1 overflow-hidden">
                  <Storyteller3D />
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orient-purple/20 p-3 rounded-xl">
                    <Star className="text-orient-purple w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("landing.story.blocks.tradition.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("landing.story.blocks.tradition.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orient-blue/20 p-3 rounded-xl">
                    <Sparkles className="text-orient-blue w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("landing.story.blocks.modern.title")}
                    </h3>
                    <p className="text-gray-400">
                      {t("landing.story.blocks.modern.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
