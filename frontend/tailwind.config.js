/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette Pastel 1001 Nuits
        "orient-sky": "#E0F7FA", // Ciel clair
        "orient-cloud": "#F3E5F5", // Nuages violets
        "orient-sand": "#FFF3E0", // Sable doux
        "orient-gold": "#FFD54F", // Or doux
        "orient-coral": "#FFAB91", // Corail doux
        "orient-purple": "#BA68C8", // Violet magique
        "orient-blue": "#4FC3F7", // Bleu lagon
        "orient-text": "#455A64", // Gris bleu foncé (lisible)
        "orient-dark": "#37474F", // Pour les titres

        // Anciennes couleurs (gardées pour compatibilité ou variantes sombres)
        "bleu-nuit": "#0F1B2E",
        or: "#D4A853",
        sable: "#E8DCC4",
      },
      fontFamily: {
        arabic: ["Amiri", "serif"],
        display: ["Amiri", "serif"], // Utiliser Amiri pour les titres aussi
        body: ["Quicksand", "sans-serif"], // Quicksand pour le corps (très lisible pour enfants)
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      perspective: {
        1000: "1000px",
        2000: "2000px",
      },
      boxShadow: {
        "3d": "0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.15)",
        "3d-lg":
          "0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 15px rgba(0, 0, 0, 0.2)",
        glow: "0 0 20px rgba(212, 168, 83, 0.5)",
        "glow-lg": "0 0 40px rgba(212, 168, 83, 0.7)",
      },
      backgroundImage: {
        "gradient-orient": "linear-gradient(to bottom, #E0F7FA, #F3E5F5)",
        "gradient-magic": "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
