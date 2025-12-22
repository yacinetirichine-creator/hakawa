import React from "react";
import { motion } from "framer-motion";
import { Scroll, Moon, Star, Sparkles } from "lucide-react";

export const StorySection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-orient-dark text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="arabesque"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M20 0L40 20L20 40L0 20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="20" cy="20" r="5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arabesque)" />
        </svg>
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
              <span>NOTRE HÉRITAGE</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              L'Âme du <span className="text-orient-gold">Hakawati</span>
            </h2>

            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">Hakawa</strong> puise son nom de
                l'arabe <em>Al-Hakawati</em> (الحكواتي), le Conteur.
              </p>
              <p>
                Dans les ruelles parfumées de Bagdad et de Damas, sous les
                étoiles du désert, le Hakawati s'asseyait au centre du café.
                Pendant des heures, il tissait des récits de djinns, de sultans
                et d'amours impossibles, captivant les cœurs et les esprits.
              </p>
              <p>
                Inspirés par la légende de <strong>Shéhérazade</strong> qui
                sauva sa vie par la force de ses récits, nous croyons que chaque
                histoire mérite d'être racontée.
              </p>
            </div>

            <div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4 border-orient-gold backdrop-blur-sm">
              <p className="italic text-xl text-white font-display">
                "L'histoire sauve la vie. Le récit transforme le monde."
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
                <div className="flex items-start gap-4">
                  <div className="bg-orient-purple/20 p-3 rounded-xl">
                    <Star className="text-orient-purple w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Tradition Millénaire
                    </h3>
                    <p className="text-gray-400">
                      Un héritage remontant à l'âge d'or de la civilisation, où
                      la parole était reine.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orient-blue/20 p-3 rounded-xl">
                    <Sparkles className="text-orient-blue w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Magie Moderne
                    </h3>
                    <p className="text-gray-400">
                      Aujourd'hui, l'IA devient votre nouveau Hakawati, vous
                      aidant à tisser vos propres légendes.
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
