import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Wand2, Upload } from "lucide-react";

const StepCard = ({ number, icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Number Badge */}
      <div className="absolute -top-4 -right-4 w-10 h-10 bg-orient-gold text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
        {number}
      </div>

      {/* Icon Circle */}
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6 border-4 border-orient-sand group hover:border-orient-gold transition-colors duration-300">
        <Icon
          size={40}
          className="text-orient-purple group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-display font-bold text-orient-dark mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed max-w-xs">{description}</p>

      {/* Connector Line (for desktop) */}
      {number < 3 && (
        <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gray-200 -z-10 transform translate-x-1/2">
          <div className="absolute inset-0 bg-orient-gold origin-left transform scale-x-0 transition-transform duration-1000 delay-500" />
        </div>
      )}
    </motion.div>
  );
};

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-orient-purple font-bold tracking-wider uppercase text-sm"
          >
            Simple comme bonjour
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-orient-dark mt-2 mb-6"
          >
            De l'idée au livre en{" "}
            <span className="text-orient-gold">3 étapes</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative z-10">
          <StepCard
            number={1}
            icon={Lightbulb}
            title="Racontez votre idée"
            description="Décrivez votre histoire en quelques phrases, ou laissez l'IA vous proposer des thèmes magiques."
            delay={0.2}
          />
          <StepCard
            number={2}
            icon={Wand2}
            title="L'IA tisse la magie"
            description="Hakawa rédige les chapitres et génère des illustrations uniques pour chaque page."
            delay={0.4}
          />
          <StepCard
            number={3}
            icon={Upload}
            title="Publiez et Partagez"
            description="Exportez votre œuvre en PDF ou publiez-la directement sur Amazon KDP pour le monde entier."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};
