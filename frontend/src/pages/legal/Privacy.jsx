import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
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
          🔒 Politique de Confidentialité
        </h1>
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 21 décembre 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Bienvenue sur Hakawa. Nous respectons votre vie privée et nous
            engageons à protéger vos données personnelles conformément au
            Règlement Général sur la Protection des Données (RGPD).
          </p>

          <h2>2. Responsable du traitement</h2>
          <p>
            <strong>Hakawa</strong>
            <br />
            Contact : privacy@hakawa.com
          </p>

          <h2>3. Données collectées</h2>

          <h3>3.1 Données d'identification</h3>
          <ul>
            <li>Nom complet</li>
            <li>Adresse e-mail</li>
            <li>Photo de profil (optionnel)</li>
          </ul>

          <h3>3.2 Données de contenu</h3>
          <ul>
            <li>Titres de projets</li>
            <li>Textes et chapitres créés</li>
            <li>Conversations avec l'IA</li>
            <li>Illustrations générées</li>
          </ul>

          <h3>3.3 Données techniques</h3>
          <ul>
            <li>Adresse IP</li>
            <li>Type de navigateur</li>
            <li>Pages visitées</li>
            <li>Durée de session</li>
            <li>Cookies (voir section Cookies)</li>
          </ul>

          <h2>4. Vos droits RGPD</h2>
          <p>Vous disposez des droits suivants :</p>
          <ul>
            <li>
              <strong>Droit d'accès</strong> : Demander une copie de vos données
            </li>
            <li>
              <strong>Droit de rectification</strong> : Corriger vos données
            </li>
            <li>
              <strong>Droit à l'effacement</strong> : Supprimer vos données
            </li>
            <li>
              <strong>Droit à la portabilité</strong> : Recevoir vos données en
              JSON/CSV
            </li>
            <li>
              <strong>Droit d'opposition</strong> : Vous opposer au traitement
            </li>
          </ul>

          <p>
            <strong>Pour exercer vos droits :</strong>
            <br />
            Envoyez un e-mail à :{" "}
            <a href="mailto:privacy@hakawa.com">privacy@hakawa.com</a>
          </p>

          <h2>5. Sécurité des données</h2>
          <p>Nous protégeons vos données avec :</p>
          <ul>
            <li>✅ Chiffrement SSL/TLS (HTTPS)</li>
            <li>✅ Chiffrement des données en base</li>
            <li>✅ Authentification sécurisée (JWT)</li>
            <li>✅ Row Level Security (RLS)</li>
            <li>✅ Sauvegardes quotidiennes chiffrées</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            Nous utilisons des cookies essentiels (authentification, sécurité)
            et optionnels (analytics). Vous pouvez gérer vos préférences dans
            les paramètres.
          </p>

          <h2>7. Contact</h2>
          <p>
            Pour toute question :<br />
            📧 E-mail :{" "}
            <a href="mailto:privacy@hakawa.com">privacy@hakawa.com</a>
          </p>

          <p className="text-sm text-gray-500 mt-12">
            <Link to="/terms" className="text-orient-purple hover:underline">
              Voir les Conditions Générales d'Utilisation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
