import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Baby,
  BookText,
  Lightbulb,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

const UseCaseCard = ({ icon: Icon, title, description, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}
      >
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-orient-dark mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export const UseCasesSection = () => {
  const { t } = useTranslation();

  const platforms = [
    "Amazon KDP",
    "Apple Books",
    "Kobo Writing Life",
    "Lulu",
    "Blurb",
    "Fnac",
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-orient-gold font-bold tracking-wider uppercase text-sm"
          >
            {t("landing.use_cases.badge")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-orient-dark mt-2 mb-6"
          >
            {t("landing.use_cases.title_prefix")}{" "}
            <span className="text-orient-purple">
              {t("landing.use_cases.title_highlight")}
            </span>
          </motion.h2>
          <p className="text-xl text-gray-600">
            {t("landing.use_cases.subtitle")}
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <UseCaseCard
            icon={Heart}
            title={t("landing.use_cases.cards.therapy.title")}
            description={t("landing.use_cases.cards.therapy.description")}
            color="bg-pink-500"
            delay={0.1}
          />
          <UseCaseCard
            icon={Baby}
            title={t("landing.use_cases.cards.kids.title")}
            description={t("landing.use_cases.cards.kids.description")}
            color="bg-blue-400"
            delay={0.2}
          />
          <UseCaseCard
            icon={BookText}
            title={t("landing.use_cases.cards.memoirs.title")}
            description={t("landing.use_cases.cards.memoirs.description")}
            color="bg-amber-600"
            delay={0.3}
          />
          <UseCaseCard
            icon={Lightbulb}
            title={t("landing.use_cases.cards.imagination.title")}
            description={t("landing.use_cases.cards.imagination.description")}
            color="bg-purple-600"
            delay={0.4}
          />
        </div>

        {/* Publication Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-orient-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orient-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4 text-orient-gold">
                <UploadCloud size={28} />
                <span className="font-bold tracking-wide uppercase">
                  {t("landing.use_cases.publication.badge")}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {t("landing.use_cases.publication.title")}
              </h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {t("landing.use_cases.publication.description")}
              </p>

              <div className="flex flex-wrap gap-3">
                {platforms.map((platform, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium border border-white/20 flex items-center gap-2"
                  >
                    <CheckCircle2 size={14} className="text-green-400" />
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 p-6 flex flex-col justify-center items-center text-center backdrop-blur-sm">
                <BookText size={64} className="text-white/80 mb-4" />
                <p className="text-xl font-display font-bold mb-2">
                  {t("landing.use_cases.publication.format_title")}
                </p>
                <p className="text-gray-400 text-sm">
                  {t("landing.use_cases.publication.format_subtitle")}
                </p>
                <div className="mt-6 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-orient-gold to-orient-purple"
                  />
                </div>
                <p className="text-xs text-orient-gold mt-2 font-mono">
                  {t("landing.use_cases.publication.format_footer")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
