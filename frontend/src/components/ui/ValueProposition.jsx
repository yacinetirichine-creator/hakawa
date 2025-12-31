import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  PenTool,
  Image as ImageIcon,
  Book,
  Sparkles,
  Wand2,
  Crown,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-full"
    >
      <div
        className={`h-full bg-white rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 ${
          isHovered
            ? "border-transparent transform -translate-y-2"
            : "border-gray-100"
        }`}
      >
        {/* Background Gradient on Hover */}
        <div
          className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-10" : ""
          }`}
          style={{ background: color }}
        />

        {/* Icon */}
        <div className="relative z-10 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110"
            style={{ background: color }}
          >
            <Icon size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-display font-bold text-orient-dark mb-4">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
        </div>

        {/* Floating Particles on Hover */}
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: 20, y: -20 }}
              className="absolute top-4 right-4 text-yellow-400"
            >
              <Sparkles size={20} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x: -10, y: 10 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-4 left-4 text-purple-400"
            >
              <Wand2 size={16} />
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export const ValueProposition = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orient-gold/10 text-orient-gold rounded-full font-bold text-sm mb-6"
          >
            <Crown size={16} />
            <span>{t("landing.experience.badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-orient-dark mb-6"
          >
            {t("landing.experience.title_prefix")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orient-purple to-orient-blue">
              {t("landing.experience.title_highlight")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            {t("landing.experience.subtitle")}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={PenTool}
            title={t("landing.experience.cards.co_creation.title")}
            description={t("landing.experience.cards.co_creation.description")}
            color="linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)"
            delay={0.2}
          />

          <FeatureCard
            icon={ImageIcon}
            title={t("landing.experience.cards.illustrator.title")}
            description={t("landing.experience.cards.illustrator.description")}
            color="linear-gradient(135deg, #D69E2E 0%, #ECC94B 100%)"
            delay={0.3}
          />

          <FeatureCard
            icon={Book}
            title={t("landing.experience.cards.editor.title")}
            description={t("landing.experience.cards.editor.description")}
            color="linear-gradient(135deg, #3182CE 0%, #4299E1 100%)"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};
