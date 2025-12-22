import React from "react";
import { Layout } from "../../components/layout/Layout";
import { Lightbulb, Sparkles, Wand2, Heart } from "lucide-react";

export default function Inspiration() {
  const inspirationCategories = [
    {
      title: "Contes de fées",
      icon: Sparkles,
      color: "orient-purple",
      examples: [
        "Un dragon qui préfère jardiner",
        "Une princesse qui devient inventrice",
        "Un château enchanté dans les nuages",
      ],
    },
    {
      title: "Aventures",
      icon: Wand2,
      color: "orient-blue",
      examples: [
        "Un voyage à travers le temps",
        "La recherche du trésor perdu",
        "Une île mystérieuse à explorer",
      ],
    },
    {
      title: "Animaux magiques",
      icon: Heart,
      color: "orient-gold",
      examples: [
        "Un chat qui parle aux étoiles",
        "Un renard gardien de la forêt",
        "Un oiseau messager entre deux mondes",
      ],
    },
  ];

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-orient-dark mb-2">
          Inspiration
        </h1>
        <p className="text-gray-500 text-lg">
          Trouvez l'inspiration pour votre prochaine histoire
        </p>
      </div>

      <div className="grid gap-8">
        {inspirationCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`bg-${category.color}/10 p-4 rounded-2xl`}>
                  <Icon className={`w-8 h-8 text-${category.color}`} />
                </div>
                <h2 className="text-2xl font-display font-bold text-orient-dark">
                  {category.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {category.examples.map((example, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group"
                  >
                    <Lightbulb className="w-5 h-5 text-orient-gold mb-2 group-hover:scale-110 transition" />
                    <p className="text-sm text-gray-700 font-medium">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip Section */}
      <div className="mt-12 bg-gradient-to-r from-orient-purple/10 to-orient-blue/10 rounded-3xl p-8 border border-orient-purple/20">
        <div className="flex items-start gap-4">
          <div className="bg-orient-purple/20 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-orient-purple" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orient-dark mb-2">
              Astuce de création
            </h3>
            <p className="text-gray-700">
              Mélangez plusieurs idées pour créer une histoire unique ! Par
              exemple : combinez "un dragon qui jardine" avec "un voyage à
              travers le temps" pour une aventure extraordinaire.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
