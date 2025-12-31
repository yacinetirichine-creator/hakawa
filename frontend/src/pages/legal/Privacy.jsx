import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orient-purple hover:text-orient-blue font-medium text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="bg-green-500/10 p-3 rounded-lg">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              Politique de Confidentialité
            </h1>
            <p className="text-gray-600 mt-2">
              Dernière mise à jour : 29 décembre 2024
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-sm text-blue-900">
            <strong>Version juridique complète :</strong> Ce document est un
            résumé simplifié. Pour la version juridique complète, consultez{" "}
            <code>/docs/POLITIQUE_CONFIDENTIALITE.md</code>
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Bienvenue sur Hakawa. Nous respectons votre vie privée et nous
            engageons à protéger vos données personnelles conformément au
            Règlement Général sur la Protection des Données (RGPD).
          </p>

          <h2>2. Responsable du traitement</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="font-semibold mb-2">
              Responsable du traitement des données :
            </p>
            <ul className="space-y-1 text-gray-700">
              <li>
                <strong>Raison sociale :</strong> JARVIS SAS
              </li>
              <li>
                <strong>SIREN :</strong> 938 848 546
              </li>
              <li>
                <strong>Siège social :</strong> 64 Avenue Marinville, 94100
                Saint-Maur-des-Fossés
              </li>
              <li>
                <strong>DPO (Délégué à la Protection des Données) :</strong>{" "}
                <a
                  href="mailto:dpo@hakawa.app"
                  className="text-orient-purple hover:underline"
                >
                  dpo@hakawa.app
                </a>
              </li>
              <li>
                <strong>Contact Privacy :</strong>{" "}
                <a
                  href="mailto:privacy@hakawa.app"
                  className="text-orient-purple hover:underline"
                >
                  privacy@hakawa.app
                </a>
              </li>
            </ul>
          </div>

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
