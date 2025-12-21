import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <div className="mb-8">
          <Link
            to="/"
            className="text-orient-purple hover:text-orient-blue font-medium text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>

        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          📜 Conditions Générales d'Utilisation
        </h1>
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 21 décembre 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <h2>1. Présentation du service</h2>
          <p>
            <strong>Hakawa</strong> est une plateforme web permettant de créer
            des livres assistés par intelligence artificielle.
          </p>

          <h2>2. Acceptation des CGU</h2>
          <p>
            En utilisant Hakawa, vous acceptez sans réserve les présentes CGU.
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le
            Service.
          </p>

          <h2>3. Inscription et compte</h2>
          <h3>Conditions d'inscription</h3>
          <ul>
            <li>Avoir au moins 13 ans</li>
            <li>Fournir des informations exactes</li>
            <li>Créer un mot de passe sécurisé</li>
          </ul>

          <h2>4. Utilisation du service</h2>

          <h3>Utilisation autorisée ✅</h3>
          <ul>
            <li>Créer des livres personnels ou commerciaux</li>
            <li>Générer des illustrations avec l'IA</li>
            <li>Exporter vos créations (PDF/EPUB)</li>
          </ul>

          <h3>Utilisation interdite ❌</h3>
          <ul>
            <li>Créer du contenu illégal, haineux, ou pornographique</li>
            <li>Usurper l'identité d'autrui</li>
            <li>Utiliser des bots ou scripts automatisés</li>
            <li>Tenter de contourner les mesures de sécurité</li>
            <li>Surcharger le système (spam, attaques)</li>
          </ul>

          <h2>5. Propriété intellectuelle</h2>

          <h3>Votre contenu</h3>
          <p>
            <strong>Vous conservez la propriété</strong> de vos créations
            (textes, projets). En publiant sur Hakawa, vous nous accordez une
            licence non-exclusive pour fournir le service.
          </p>

          <h3>Contenu généré par l'IA</h3>
          <p>
            Les textes créés via Anthropic Claude vous appartiennent, sous
            réserve de leurs conditions. Les illustrations sont soumises aux
            licences des modèles utilisés.
          </p>

          <h2>6. Offres et tarification</h2>
          <ul>
            <li>
              <strong>Gratuit</strong> : Projets limités, 3 crédits
              illustration/mois
            </li>
            <li>
              <strong>Conteur (9,99€/mois)</strong> : Projets illimités, 30
              crédits
            </li>
            <li>
              <strong>Pro (24,99€/mois)</strong> : 100 crédits, exports KDP
            </li>
            <li>
              <strong>Studio (49,99€/mois)</strong> : Crédits illimités, API
            </li>
          </ul>

          <h2>7. Responsabilités</h2>
          <p>
            Hakawa ne peut être tenu responsable de la perte de données,
            interruptions de service, ou du contenu généré par l'IA.{" "}
            <strong>Vérifiez toujours le contenu avant publication.</strong>
          </p>

          <h2>8. Protection des données</h2>
          <p>
            Consultez notre{" "}
            <Link to="/privacy" className="text-orient-purple hover:underline">
              Politique de Confidentialité
            </Link>{" "}
            pour connaître vos droits RGPD.
          </p>

          <h2>9. Contact</h2>
          <p>
            📧 E-mail : <a href="mailto:legal@hakawa.com">legal@hakawa.com</a>
            <br />
            🌐 Site web :{" "}
            <a href="https://hakawa.com/support">hakawa.com/support</a>
          </p>

          <p className="text-sm text-gray-500 mt-12">
            Date d'entrée en vigueur : 21 décembre 2025
          </p>
        </div>
      </div>
    </div>
  );
}
