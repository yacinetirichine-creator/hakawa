import React from "react";
import { Moon, Sparkles, BookOpen } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bleu-nuit to-nuit-dark">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-8 h-8 text-or" />
            <span className="text-2xl font-display font-bold text-or">
              HAKAWA
            </span>
          </div>
          <button className="px-6 py-2 bg-or text-bleu-nuit rounded-lg font-semibold hover:bg-gold-light transition">
            Connexion
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-display font-bold mb-6 text-glow">
            L'art de raconter,
            <br />
            <span className="text-or">réinventé</span>
          </h1>

          <p className="text-xl text-sable mb-12 leading-relaxed">
            De l'idée brute au livre publié sur Amazon KDP,
            <br />
            Hakawa accompagne auteurs, parents et créateurs dans leur voyage
            créatif.
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <button className="px-8 py-4 bg-or text-bleu-nuit rounded-lg font-semibold text-lg hover:bg-gold-light transition shadow-glow">
              Commencer gratuitement
            </button>
            <button className="px-8 py-4 border-2 border-or text-or rounded-lg font-semibold text-lg hover:bg-or hover:text-bleu-nuit transition">
              Voir la démo
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-nuit-light p-8 rounded-xl border border-or/20 hover:border-or/50 transition">
              <div className="w-12 h-12 bg-or/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-or" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-or">
                Atelier Créatif
              </h3>
              <p className="text-sable">
                Un chat conversationnel pour développer vos idées avec l'aide de
                l'IA
              </p>
            </div>

            <div className="bg-nuit-light p-8 rounded-xl border border-or/20 hover:border-or/50 transition">
              <div className="w-12 h-12 bg-or/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-or" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-or">
                Écriture Assistée
              </h3>
              <p className="text-sable">
                L'IA vous aide à écrire, mais vous gardez le contrôle créatif
              </p>
            </div>

            <div className="bg-nuit-light p-8 rounded-xl border border-or/20 hover:border-or/50 transition">
              <div className="w-12 h-12 bg-or/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Moon className="w-6 h-6 text-or" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-or">
                Export KDP
              </h3>
              <p className="text-sable">
                PDF prêts pour Amazon, EPUB pour Kindle, en un clic
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-or/20">
        <div className="text-center text-sable">
          <p className="font-arabic">الحكواتي</p>
          <p className="text-sm mt-2">
            © 2025 Hakawa - L'art de raconter, réinventé
          </p>
        </div>
      </footer>
    </div>
  );
}
