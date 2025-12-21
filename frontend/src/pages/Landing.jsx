import React from "react";
import {
  Moon,
  Sparkles,
  BookOpen,
  Cloud,
  Star,
  Wand2,
  Rocket,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-orient font-body text-orient-text overflow-hidden">
      {/* Décoration Nuages Flottants */}
      <div className="absolute top-20 left-10 text-white/40 animate-float pointer-events-none">
        <Cloud size={120} fill="currentColor" />
      </div>
      <div
        className="absolute top-40 right-20 text-white/30 animate-float pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        <Cloud size={180} fill="currentColor" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between bg-white/30 backdrop-blur-md p-4 rounded-full shadow-sm border border-white/50">
          <div className="flex items-center gap-3 pl-4">
            <div className="bg-orient-gold p-2 rounded-full text-white shadow-md">
              <Moon className="w-6 h-6 fill-current" />
            </div>
            <span className="text-3xl font-display font-bold text-orient-dark tracking-wide">
              HAKAWA
            </span>
          </div>
          <div className="flex gap-4">
            <button className="hidden md:block px-6 py-2 text-orient-dark font-bold hover:text-orient-purple transition">
              Découvrir
            </button>
            <button className="px-8 py-3 bg-orient-gold text-white rounded-full font-bold hover:bg-yellow-400 transition shadow-lg transform hover:scale-105 active:scale-95">
              Connexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6 animate-bounce">
            <span className="px-6 py-2 bg-orient-purple/10 text-orient-purple rounded-full font-bold text-sm border border-orient-purple/20">
              ✨ La magie commence ici
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 text-orient-dark leading-tight">
            Deviens le Héros <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orient-purple to-orient-blue">
              de ton Histoire
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-orient-text/80 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Imagine des contes merveilleux, crée des personnages fantastiques et
            transforme tes rêves en vrais livres !
            <br />
            <span className="text-sm mt-4 block text-orient-purple font-bold">
              Idéal pour les enfants de 6 à 99 ans 🎈
            </span>
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center mb-24 items-center">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-orient-purple to-orient-blue text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <Wand2 className="w-6 h-6 group-hover:rotate-12 transition" />
                Commencer l'Aventure
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <button className="px-10 py-5 bg-white text-orient-dark rounded-full font-bold text-xl shadow-md hover:shadow-lg border-2 border-orient-sand hover:border-orient-gold transition flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-orient-gold" />
              Voir un exemple
            </button>
          </div>

          {/* Features Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orient-blue hover:-translate-y-2 transition duration-300 group">
              <div className="w-20 h-20 bg-orient-sky rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition">
                <Sparkles className="w-10 h-10 text-orient-blue" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-orient-dark">
                1. Imagine
              </h3>
              <p className="text-orient-text text-lg">
                Raconte ton idée à notre génie magique. Il t'aidera à trouver
                l'inspiration !
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orient-purple hover:-translate-y-2 transition duration-300 group">
              <div className="w-20 h-20 bg-orient-cloud rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition">
                <Wand2 className="w-10 h-10 text-orient-purple" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-orient-dark">
                2. Crée
              </h3>
              <p className="text-orient-text text-lg">
                L'IA écrit les textes et dessine les images. Tu es le chef
                d'orchestre !
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orient-gold hover:-translate-y-2 transition duration-300 group">
              <div className="w-20 h-20 bg-orient-sand rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition">
                <Rocket className="w-10 h-10 text-orient-gold" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-orient-dark">
                3. Décolle
              </h3>
              <p className="text-orient-text text-lg">
                Reçois ton livre en PDF ou publie-le pour que le monde entier le
                lise.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Décoratif */}
      <div className="relative mt-20">
        <svg
          className="w-full h-24 md:h-48 text-white fill-current"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <footer className="bg-white pb-10 pt-4">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center gap-4 mb-6">
              <Star className="text-orient-gold w-6 h-6 animate-pulse" />
              <Star className="text-orient-purple w-6 h-6 animate-pulse delay-100" />
              <Star className="text-orient-blue w-6 h-6 animate-pulse delay-200" />
            </div>
            <p className="font-display text-2xl text-orient-dark mb-2">
              الحكواتي
            </p>
            <p className="text-orient-text">
              © 2025 Hakawa - Fait avec ❤️ et un peu de poussière d'étoiles
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
