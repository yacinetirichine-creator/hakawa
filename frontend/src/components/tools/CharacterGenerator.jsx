import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  User,
  Heart,
  Brain,
  Book,
  Zap,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import { CHARACTER_TEMPLATES } from "../../data/templates";

export default function CharacterGenerator({ onSave, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [character, setCharacter] = useState(null);
  const [params, setParams] = useState({
    archetype: "",
    genre: "",
    role: "",
    age: "",
    gender: "",
  });

  const archetypes = CHARACTER_TEMPLATES.map((t) => t.archetype);
  const genres = [
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Thriller",
    "Horreur",
    "Historique",
  ];
  const roles = [
    "Protagoniste",
    "Antagoniste",
    "Mentor",
    "Allié",
    "Rival",
    "Amour",
  ];

  const generateCharacter = async () => {
    setGenerating(true);

    // Simulate AI generation with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const template = CHARACTER_TEMPLATES.find(
      (t) => t.archetype === params.archetype
    );

    const names = {
      Fantasy: [
        "Aria",
        "Kael",
        "Lyra",
        "Theron",
        "Elara",
        "Zephyr",
        "Nyx",
        "Orion",
      ],
      "Science Fiction": [
        "Nova",
        "Cipher",
        "Echo",
        "Atlas",
        "Vega",
        "Phoenix",
        "Quantum",
        "Nebula",
      ],
      Romance: ["Emma", "Lucas", "Sophie", "Alexandre", "Chloé", "Julien"],
      Thriller: ["Morgan", "Blake", "Reese", "Harper", "Jordan", "Casey"],
      Horreur: ["Raven", "Ash", "Salem", "Crow", "Mortimer", "Lilith"],
      Historique: ["Isabelle", "Alexandre", "Catherine", "Henri", "Marguerite"],
    };

    const selectedNames = names[params.genre] || names.Fantasy;
    const randomName =
      selectedNames[Math.floor(Math.random() * selectedNames.length)];

    const appearances = {
      eyes: [
        "yeux verts perçants",
        "yeux bleus profonds",
        "yeux noirs intenses",
        "yeux noisette chaleureux",
        "yeux gris orageux",
        "yeux ambrés lumineux",
      ],
      hair: [
        "cheveux noirs corbeau",
        "cheveux blonds dorés",
        "cheveux châtains",
        "cheveux roux flamboyants",
        "cheveux argentés",
        "cheveux sombres avec mèches blanches",
      ],
      build: [
        "carrure athlétique",
        "silhouette élancée",
        "stature imposante",
        "physique gracieux",
        "corps robuste",
        "allure délicate",
      ],
      features: [
        "cicatrice sur la joue",
        "sourire énigmatique",
        "regard déterminé",
        "aura mystérieuse",
        "présence imposante",
        "charme naturel",
      ],
    };

    const personalities = [
      "Courageux mais impulsif, toujours prêt à foncer tête baissée",
      "Intelligent et calculateur, analyse chaque situation avant d'agir",
      "Loyal et protecteur envers ses proches, parfois à ses dépens",
      "Cynique en apparence mais cache un cœur tendre",
      "Charismatique et persuasif, sait rallier les autres à sa cause",
      "Réservé et observateur, voit ce que les autres manquent",
    ];

    const backgrounds = [
      `Orphelin élevé dans les rues, ${randomName} a appris à survivre par ses propres moyens. Son passé difficile l'a rendu méfiant mais déterminé.`,
      `Issu d'une famille noble déchue, ${randomName} cherche à restaurer l'honneur de son nom tout en luttant contre les privilèges qu'il a perdus.`,
      `Ancien protégé d'un maître disparu, ${randomName} porte le poids de secrets qui pourraient changer le monde.`,
      `Né avec un don rare et redouté, ${randomName} a dû apprendre à vivre en marge de la société.`,
      `Survivant d'une tragédie qui a marqué son enfance, ${randomName} est hanté par des souvenirs qu'il tente d'oublier.`,
    ];

    const motivations = [
      "Venger un être cher perdu dans des circonstances mystérieuses",
      "Découvrir la vérité sur ses origines cachées",
      "Protéger ceux qu'il aime à tout prix",
      "Prouver sa valeur au monde qui l'a rejeté",
      "Trouver sa place dans un monde qui change",
      "Empêcher que le passé ne se répète",
    ];

    const flaws = [
      "Trop fier pour demander de l'aide, même quand il en a besoin",
      "Fait confiance trop facilement, ce qui le met en danger",
      "Obsédé par son objectif au point d'ignorer tout le reste",
      "Incapable de pardonner, même les erreurs du passé",
      "Cache ses émotions derrière un masque d'indifférence",
      "Agit avant de réfléchir dans les moments de stress",
    ];

    const strengths = [
      "Maîtrise exceptionnelle de son art/compétence principale",
      "Capacité à inspirer et motiver les autres",
      "Intelligence tactique et stratégique",
      "Résilience face à l'adversité",
      "Empathie profonde qui lui permet de comprendre les autres",
      "Détermination inébranlable",
    ];

    const generatedCharacter = {
      name: randomName,
      role: params.role,
      age: params.age || `${20 + Math.floor(Math.random() * 30)} ans`,
      gender:
        params.gender ||
        ["Homme", "Femme", "Non-binaire"][Math.floor(Math.random() * 3)],
      archetype: template?.archetype || params.archetype,
      appearance: {
        eyes: appearances.eyes[
          Math.floor(Math.random() * appearances.eyes.length)
        ],
        hair: appearances.hair[
          Math.floor(Math.random() * appearances.hair.length)
        ],
        build:
          appearances.build[
            Math.floor(Math.random() * appearances.build.length)
          ],
        feature:
          appearances.features[
            Math.floor(Math.random() * appearances.features.length)
          ],
      },
      personality:
        personalities[Math.floor(Math.random() * personalities.length)],
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      motivation: motivations[Math.floor(Math.random() * motivations.length)],
      flaw: flaws[Math.floor(Math.random() * flaws.length)],
      strength: strengths[Math.floor(Math.random() * strengths.length)],
      relationships: [
        {
          with: "À définir",
          type: "Mentor/Élève",
          description: "Relation complexe basée sur le respect mutuel",
        },
        {
          with: "À définir",
          type: "Rivalité",
          description: "Antagonisme qui cache une certaine admiration",
        },
      ],
      arc: template?.arc || "Évolution du personnage à définir",
      quotes: [
        `"Je ne reculerai jamais, peu importe les obstacles."`,
        `"Le passé nous définit, mais il ne nous emprisonne pas."`,
        `"Parfois, le plus grand courage c'est de demander de l'aide."`,
      ],
    };

    setCharacter(generatedCharacter);
    setGenerating(false);
  };

  const handleCopyToClipboard = () => {
    const text = `
${character.name} - ${character.role}
${character.age}, ${character.gender}

APPARENCE:
${character.appearance.eyes}, ${character.appearance.hair}, ${character.appearance.build}, ${character.appearance.feature}

PERSONNALITÉ:
${character.personality}

BACKGROUND:
${character.background}

MOTIVATION:
${character.motivation}

FORCES: ${character.strength}
FAIBLESSES: ${character.flaw}

ARC NARRATIF:
${character.arc}
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Personnage copié dans le presse-papier !");
  };

  const handleDownload = () => {
    const json = JSON.stringify(character, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${character.name.replace(/\s/g, "_")}.json`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-or" />
        <h2 className="text-2xl font-bold text-or">
          Générateur de Personnages AI
        </h2>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-parchemin mb-2">
            Archétype
          </label>
          <select
            value={params.archetype}
            onChange={(e) =>
              setParams({ ...params, archetype: e.target.value })
            }
            className="w-full px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin focus:outline-none focus:border-or"
          >
            <option value="">Choisir...</option>
            {archetypes.map((arch) => (
              <option key={arch} value={arch}>
                {arch}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-parchemin mb-2">
            Genre littéraire
          </label>
          <select
            value={params.genre}
            onChange={(e) => setParams({ ...params, genre: e.target.value })}
            className="w-full px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin focus:outline-none focus:border-or"
          >
            <option value="">Choisir...</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-parchemin mb-2">
            Rôle
          </label>
          <select
            value={params.role}
            onChange={(e) => setParams({ ...params, role: e.target.value })}
            className="w-full px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin focus:outline-none focus:border-or"
          >
            <option value="">Choisir...</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-parchemin mb-2">
            Âge (optionnel)
          </label>
          <input
            type="text"
            value={params.age}
            onChange={(e) => setParams({ ...params, age: e.target.value })}
            placeholder="ex: 25 ans"
            className="w-full px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin placeholder:text-parchemin/30 focus:outline-none focus:border-or"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-parchemin mb-2">
            Genre (optionnel)
          </label>
          <select
            value={params.gender}
            onChange={(e) => setParams({ ...params, gender: e.target.value })}
            className="w-full px-4 py-3 bg-bleu-nuit/50 border border-or/20 rounded-lg text-parchemin focus:outline-none focus:border-or"
          >
            <option value="">Au hasard</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Non-binaire">Non-binaire</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateCharacter}
        disabled={
          !params.archetype || !params.genre || !params.role || generating
        }
        className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
          !params.archetype || !params.genre || !params.role || generating
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-or to-or/80 text-bleu-nuit hover:shadow-lg hover:shadow-or/20"
        }`}
      >
        {generating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Générer le personnage
          </>
        )}
      </button>

      {/* Generated Character */}
      <AnimatePresence>
        {character && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header with actions */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-or/20 to-or/10 rounded-xl border border-or/30">
              <div>
                <h3 className="text-3xl font-bold text-or mb-1">
                  {character.name}
                </h3>
                <p className="text-parchemin/70">
                  {character.role} • {character.age} • {character.gender}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="p-3 bg-or/20 hover:bg-or/30 text-or rounded-lg transition-colors"
                  title="Copier"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-3 bg-or/20 hover:bg-or/30 text-or rounded-lg transition-colors"
                  title="Télécharger JSON"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Character Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appearance */}
              <div className="p-6 bg-bleu-nuit/50 rounded-xl border border-or/10">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-or" />
                  <h4 className="font-bold text-parchemin">Apparence</h4>
                </div>
                <ul className="space-y-2 text-sm text-parchemin/80">
                  <li>• {character.appearance.eyes}</li>
                  <li>• {character.appearance.hair}</li>
                  <li>• {character.appearance.build}</li>
                  <li>• {character.appearance.feature}</li>
                </ul>
              </div>

              {/* Personality */}
              <div className="p-6 bg-bleu-nuit/50 rounded-xl border border-or/10">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-or" />
                  <h4 className="font-bold text-parchemin">Personnalité</h4>
                </div>
                <p className="text-sm text-parchemin/80">
                  {character.personality}
                </p>
              </div>

              {/* Background */}
              <div className="p-6 bg-bleu-nuit/50 rounded-xl border border-or/10 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <Book className="w-5 h-5 text-or" />
                  <h4 className="font-bold text-parchemin">Histoire</h4>
                </div>
                <p className="text-sm text-parchemin/80 mb-4">
                  {character.background}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-parchemin/50 mb-1">Motivation</p>
                    <p className="text-sm text-parchemin/80">
                      {character.motivation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-parchemin/50 mb-1">
                      Arc narratif
                    </p>
                    <p className="text-sm text-parchemin/80">{character.arc}</p>
                  </div>
                </div>
              </div>

              {/* Strengths & Flaws */}
              <div className="p-6 bg-bleu-nuit/50 rounded-xl border border-or/10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-green-500" />
                  <h4 className="font-bold text-parchemin">Forces</h4>
                </div>
                <p className="text-sm text-parchemin/80">
                  {character.strength}
                </p>
              </div>

              <div className="p-6 bg-bleu-nuit/50 rounded-xl border border-or/10">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h4 className="font-bold text-parchemin">Faiblesses</h4>
                </div>
                <p className="text-sm text-parchemin/80">{character.flaw}</p>
              </div>

              {/* Quotes */}
              <div className="p-6 bg-bleu-nuit/50 rounded-xl border border-or/10 md:col-span-2">
                <h4 className="font-bold text-parchemin mb-4">
                  Citations emblématiques
                </h4>
                <div className="space-y-2">
                  {character.quotes.map((quote, idx) => (
                    <p key={idx} className="text-sm italic text-parchemin/70">
                      {quote}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            {onSave && (
              <button
                onClick={() => onSave(character)}
                className="w-full py-4 bg-gradient-to-r from-or to-or/80 text-bleu-nuit font-bold rounded-lg hover:shadow-lg hover:shadow-or/20 transition-all"
              >
                Sauvegarder ce personnage
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
