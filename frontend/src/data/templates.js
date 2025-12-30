export const PROJECT_TEMPLATES = [
  {
    id: "fantasy-epic",
    name: "Fantasy Épique",
    icon: "🐉",
    description: "Une aventure dans un monde magique avec quête héroïque",
    genre: "Fantasy",
    style: "epic",
    defaultSettings: {
      tone: "épique",
      targetAudience: "young_adult",
      length: "long",
    },
    startingPrompt: {
      title: "La Prophétie Oubliée",
      synopsis:
        "Dans un royaume où la magie s'éteint peu à peu, un jeune apprenti découvre une ancienne prophétie qui pourrait sauver ou détruire le monde.",
      characters: [
        {
          name: "Aria",
          role: "Protagoniste",
          description: "Jeune mage apprentie, courageuse mais inexpérimentée",
        },
        {
          name: "Maître Eldrin",
          role: "Mentor",
          description: "Vieux sage gardien des anciens secrets",
        },
      ],
      worldBuilding: {
        setting: "Royaume de Lunaria",
        magicSystem: "Magie élémentaire liée aux cycles lunaires",
        conflict: "La magie disparaît progressivement du monde",
      },
    },
  },
  {
    id: "scifi-dystopia",
    name: "Science-Fiction Dystopique",
    icon: "🚀",
    description: "Un futur sombre où l'humanité lutte pour sa survie",
    genre: "Science Fiction",
    style: "dark",
    defaultSettings: {
      tone: "sombre",
      targetAudience: "adult",
      length: "medium",
    },
    startingPrompt: {
      title: "Néon City 2157",
      synopsis:
        "Dans une mégalopole contrôlée par des corporations, une hackeuse découvre un complot qui menace l'existence même de l'humanité.",
      characters: [
        {
          name: "Nova",
          role: "Protagoniste",
          description: "Hackeuse rebelle avec un passé mystérieux",
        },
        {
          name: "Cipher",
          role: "Allié",
          description: "IA révolutionnaire aux intentions ambiguës",
        },
      ],
      worldBuilding: {
        setting: "Néon City, mégalopole verticale de 2157",
        technology: "Implants neuronaux, hologrammes, IA avancées",
        conflict:
          "Contrôle totalitaire des corporations vs liberté individuelle",
      },
    },
  },
  {
    id: "romance-contemporary",
    name: "Romance Contemporaine",
    icon: "💕",
    description: "Une histoire d'amour moderne et touchante",
    genre: "Romance",
    style: "warm",
    defaultSettings: {
      tone: "chaleureux",
      targetAudience: "adult",
      length: "medium",
    },
    startingPrompt: {
      title: "Un Été à Paris",
      synopsis:
        "Deux personnes que tout oppose se rencontrent dans un café parisien. Un été va tout changer.",
      characters: [
        {
          name: "Emma",
          role: "Protagoniste",
          description: "Artiste passionnée mais désenchantée par l'amour",
        },
        {
          name: "Lucas",
          role: "Intérêt Amoureux",
          description: "Chef cuisinier perfectionniste en quête de sens",
        },
      ],
      worldBuilding: {
        setting: "Paris contemporain, quartier du Marais",
        atmosphere: "Romantique, nostalgique, chaleureux",
        conflict: "Peurs du passé vs espoir d'un avenir ensemble",
      },
    },
  },
  {
    id: "thriller-mystery",
    name: "Thriller & Mystère",
    icon: "🔍",
    description: "Une enquête palpitante pleine de rebondissements",
    genre: "Thriller",
    style: "suspenseful",
    defaultSettings: {
      tone: "suspense",
      targetAudience: "adult",
      length: "medium",
    },
    startingPrompt: {
      title: "Le Secret du Manoir",
      synopsis:
        "Une détective privée est appelée pour résoudre un meurtre dans un manoir isolé. Mais rien n'est ce qu'il semble être.",
      characters: [
        {
          name: "Detective Morgan",
          role: "Protagoniste",
          description: "Enquêtrice brillante avec des méthodes peu orthodoxes",
        },
        {
          name: "Lord Ashford",
          role: "Suspect",
          description: "Aristocrate mystérieux propriétaire du manoir",
        },
      ],
      worldBuilding: {
        setting: "Manoir victorien dans les landes écossaises",
        atmosphere: "Gothique, mystérieux, inquiétant",
        conflict: "Chaque suspect cache un secret mortel",
      },
    },
  },
  {
    id: "horror-psychological",
    name: "Horreur Psychologique",
    icon: "👻",
    description: "Un récit terrifiant qui joue sur les peurs profondes",
    genre: "Horror",
    style: "dark",
    defaultSettings: {
      tone: "terrifiant",
      targetAudience: "adult",
      length: "short",
    },
    startingPrompt: {
      title: "La Maison qui Murmure",
      synopsis:
        "Un écrivain en panne d'inspiration s'installe dans une vieille maison isolée. Les murmures dans les murs ne sont que le début.",
      characters: [
        {
          name: "James",
          role: "Protagoniste",
          description: "Écrivain hanté par son passé, en quête d'isolation",
        },
        {
          name: "L'Entité",
          role: "Antagoniste",
          description: "Présence invisible qui se nourrit des peurs",
        },
      ],
      worldBuilding: {
        setting: "Vieille maison victorienne dans les bois",
        atmosphere: "Oppressant, claustrophobe, paranormal",
        conflict: "La frontière entre réalité et folie s'estompe",
      },
    },
  },
  {
    id: "adventure-historical",
    name: "Aventure Historique",
    icon: "⚔️",
    description: "Une épopée dans une période historique fascinante",
    genre: "Historical Fiction",
    style: "epic",
    defaultSettings: {
      tone: "aventureux",
      targetAudience: "young_adult",
      length: "long",
    },
    startingPrompt: {
      title: "Les Corsaires de la Méditerranée",
      synopsis:
        "En 1720, une jeune femme se déguise en homme pour rejoindre un équipage de corsaires et venger sa famille.",
      characters: [
        {
          name: "Isabelle / 'Isaac'",
          role: "Protagoniste",
          description: "Noble déguisée en matelot, audacieuse et déterminée",
        },
        {
          name: "Capitaine Moreno",
          role: "Mentor",
          description: "Corsaire légendaire au cœur d'or",
        },
      ],
      worldBuilding: {
        setting: "Méditerranée, 1720, âge d'or de la piraterie",
        atmosphere: "Aventure, liberté, danger constant",
        conflict: "Vengeance vs découverte de soi et nouvelle famille",
      },
    },
  },
  {
    id: "blank",
    name: "Page Blanche",
    icon: "📝",
    description: "Commencez de zéro avec votre propre histoire",
    genre: "Custom",
    style: "neutral",
    defaultSettings: {
      tone: "neutre",
      targetAudience: "general",
      length: "medium",
    },
    startingPrompt: {
      title: "Mon Histoire",
      synopsis: "Laissez votre imagination vous guider...",
      characters: [],
      worldBuilding: {
        setting: "À définir",
        atmosphere: "À définir",
        conflict: "À définir",
      },
    },
  },
];

export const ILLUSTRATION_PROMPTS_LIBRARY = [
  {
    category: "Paysages Fantasy",
    prompts: [
      "Château de cristal flottant dans les nuages, coucher de soleil rose et or, style anime détaillé",
      "Forêt enchantée avec arbres luminescents bleus, champignons géants, brume magique au sol",
      "Temple ancien sur montagne enneigée, aurores boréales, architecture gothique",
      "Ville sous-marine avec dômes de verre, poissons bioluminescents, style steampunk",
    ],
  },
  {
    category: "Personnages Fantasy",
    prompts: [
      "Elfe guerrière avec armure de feuilles argentées, arc magique, forêt en arrière-plan",
      "Mage vieux sage avec robe étoilée, bâton cristallin, livre flottant",
      "Dragon majestueux couleur émeraude, ailes déployées, perché sur falaise",
      "Fée avec ailes de papillon iridescentes, robe de pétales, jardin mystique",
    ],
  },
  {
    category: "Science-Fiction",
    prompts: [
      "Vaisseau spatial futuriste type destroyer, néons bleus, fond étoilé",
      "Cyborg féminin avec implants lumineux, cheveux holographiques, style cyberpunk",
      "Cité futuriste avec gratte-ciels transparents, voitures volantes, néons multicolores",
      "Robot humanoïde élégant, chrome poli, yeux LED bleus, design minimaliste",
    ],
  },
  {
    category: "Romance",
    prompts: [
      "Couple s'embrassant sous cerisiers en fleurs, pétales roses dans le vent, coucher de soleil",
      "Dîner romantique sur terrasse parisienne, tour Eiffel illuminée en arrière-plan",
      "Promenade main dans la main sur plage au crépuscule, vagues dorées",
      "Regard tendre entre deux personnes dans café cosy, pluie sur fenêtre",
    ],
  },
  {
    category: "Horreur",
    prompts: [
      "Manoir abandonné gothique, fenêtres cassées, brume inquiétante, pleine lune",
      "Couloir d'hôpital abandonné, néons clignotants, ombres menaçantes",
      "Forêt sombre avec arbres tordus, brume au sol, yeux rouges dans l'obscurité",
      "Miroir antique fissuré reflétant une silhouette spectrale, pièce victorienne délabrée",
    ],
  },
  {
    category: "Historique",
    prompts: [
      "Bataille médiévale épique, chevaliers en armure, château en arrière-plan, style réaliste",
      "Marché médiéval animé, costumes d'époque, étals colorés, architecture gothique",
      "Bateau pirate voguant sur océan orageux, drapeau noir, éclairs",
      "Bal royal dans château baroque, robes somptueuses, chandeliers dorés",
    ],
  },
];

export const CHARACTER_TEMPLATES = [
  {
    archetype: "Le Héros Réticent",
    traits: ["courageux malgré lui", "loyal", "autodérision"],
    background:
      "Personne ordinaire qui se retrouve dans une situation extraordinaire",
    arc: "De l'incrédulité et la résistance à l'acceptation de son destin",
  },
  {
    archetype: "La Femme Fatale",
    traits: ["séductrice", "mystérieuse", "dangereuse"],
    background: "Passé trouble qui a façonné sa personnalité complexe",
    arc: "Révélation de vulnérabilités cachées sous l'armure",
  },
  {
    archetype: "Le Mentor Sage",
    traits: ["sage", "patient", "secrets du passé"],
    background: "A vécu des épreuves similaires dans sa jeunesse",
    arc: "Transmission de savoir et sacrifice ultime possible",
  },
  {
    archetype: "L'Anti-Héros",
    traits: ["moralement ambigu", "compétent", "cynique"],
    background: "Traumatisme passé qui a brisé ses idéaux",
    arc: "Découverte qu'il reste de l'espoir et de la bonté",
  },
  {
    archetype: "Le Génie Excentrique",
    traits: ["brillant", "socialement maladroit", "obsessif"],
    background: "Isolement social compensé par l'intellect",
    arc: "Apprendre la valeur des connexions humaines",
  },
];
