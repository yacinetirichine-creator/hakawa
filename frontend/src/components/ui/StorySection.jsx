import React from "react";
import { motion } from "framer-motion";
import { Scroll, Moon, Star, Sparkles } from "lucide-react";

export const StorySection = () => {
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
                {/* Illustration: conteur assis */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <svg
                    viewBox="0 0 320 220"
                    className="w-full h-auto"
                    role="img"
                    aria-label="Un conteur assis qui raconte une histoire"
                  >
                    <g
                      className="text-orient-gold"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M34 178 C78 140, 118 140, 156 178" />
                      <path d="M166 178 C198 145, 236 145, 286 178" />
                      <path
                        d="M68 160 C92 138, 118 134, 138 150"
                        opacity="0.65"
                      />
                      <path
                        d="M206 152 C230 132, 254 132, 276 150"
                        opacity="0.65"
                      />
                    </g>

                    <g
                      className="text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Head */}
                      <circle cx="160" cy="78" r="18" />
                      {/* Body */}
                      <path d="M160 96 L160 136" />
                      <path d="M144 118 L176 118" />
                      {/* Arms holding a book */}
                      <path d="M144 118 C132 126, 126 136, 120 146" />
                      <path d="M176 118 C188 126, 194 136, 200 146" />
                      <path d="M120 146 L150 150" />
                      <path d="M200 146 L170 150" />

                      {/* Book */}
                      <path d="M150 150 L150 172" />
                      <path d="M170 150 L170 172" />
                      <path d="M150 150 C156 146, 164 146, 170 150" />
                      <path d="M150 172 C156 168, 164 168, 170 172" />

                      {/* Seated legs */}
                      <path d="M160 136 C146 148, 138 160, 132 174" />
                      <path d="M160 136 C174 148, 182 160, 188 174" />
                      <path d="M132 174 C146 178, 158 178, 170 174" />
                      <path d="M188 174 C174 182, 156 184, 140 180" />
                    </g>

                    {/* Sparkles */}
                    <g
                      className="text-orient-blue"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.9"
                    >
                      <path d="M52 64 L58 70 L52 76 L46 70 Z" />
                      <path d="M276 62 L282 68 L276 74 L270 68 Z" />
                      <path d="M246 34 L250 38 L246 42 L242 38 Z" />
                    </g>
                  </svg>
                </div>

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
