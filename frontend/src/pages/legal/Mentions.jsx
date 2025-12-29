import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Mail, MapPin, Phone } from "lucide-react";

export default function Mentions() {
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
          <div className="bg-orient-blue/10 p-3 rounded-lg">
            <Building2 className="w-8 h-8 text-orient-blue" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              Mentions Légales
            </h1>
            <p className="text-gray-600 mt-2">
              Informations juridiques et coordonnées
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Éditeur */}
          <section className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-orient-purple" />
              Éditeur de la plateforme Hakawa
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Identité juridique
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <strong>Raison sociale :</strong> JARVIS
                  </li>
                  <li>
                    <strong>Forme juridique :</strong> Société par actions
                    simplifiée (SAS)
                  </li>
                  <li>
                    <strong>Capital social :</strong> 1 000,00 EUR
                  </li>
                  <li>
                    <strong>SIREN :</strong> 984 594 565
                  </li>
                  <li>
                    <strong>TVA intracommunautaire :</strong> FR XX 984594565
                  </li>
                  <li>
                    <strong>Date de création :</strong> 24 décembre 2024
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orient-purple" />
                  Siège social
                </h3>
                <address className="not-italic text-sm text-gray-700 mb-4">
                  22 Rue du Docteur Louis Marçon
                  <br />
                  34070 MONTPELLIER
                  <br />
                  France
                </address>

                <h3 className="font-semibold text-gray-800 mb-3">
                  Directeur de publication
                </h3>
                <p className="text-sm text-gray-700">
                  Représentant légal de JARVIS SAS
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-orient-blue" />
              Coordonnées de contact
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Email général
                  </h4>
                  <a
                    href="mailto:contact@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    contact@hakawa.app
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Support client
                  </h4>
                  <a
                    href="mailto:support@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    support@hakawa.app
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Service juridique
                  </h4>
                  <a
                    href="mailto:legal@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    legal@hakawa.app
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    DPO (Protection des données)
                  </h4>
                  <a
                    href="mailto:dpo@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    dpo@hakawa.app
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Facturation
                  </h4>
                  <a
                    href="mailto:billing@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    billing@hakawa.app
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Confidentialité
                  </h4>
                  <a
                    href="mailto:privacy@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    privacy@hakawa.app
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Hébergement */}
          <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Hébergement
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Base de données
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Supabase Inc.</strong>
                  <br />
                  970 Toa Payoh North #07-04
                  <br />
                  Singapore 318992
                  <br />
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orient-purple hover:underline"
                  >
                    https://supabase.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Frontend (Application web)
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Vercel Inc.</strong>
                  <br />
                  340 S Lemon Ave #4133
                  <br />
                  Walnut, CA 91789, USA
                  <br />
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orient-purple hover:underline"
                  >
                    https://vercel.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Backend API
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Render Services Inc.</strong>
                  <br />
                  525 Brannan Street, Suite 300
                  <br />
                  San Francisco, CA 94107, USA
                  <br />
                  <a
                    href="https://render.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orient-purple hover:underline"
                  >
                    https://render.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Propriété Intellectuelle
            </h2>
            <p className="text-gray-700 mb-4">
              L'ensemble des éléments de la plateforme Hakawa (textes,
              graphismes, logiciels, photographies, images, vidéos, sons,
              marques, logos, etc.) est la propriété exclusive de{" "}
              <strong>JARVIS SAS</strong>, sauf mention contraire.
            </p>
            <p className="text-gray-700">
              Toute reproduction, représentation, modification, publication ou
              adaptation de tout ou partie des éléments du site, quel que soit
              le moyen ou le procédé utilisé, est interdite, sauf autorisation
              écrite préalable de JARVIS SAS.
            </p>
          </section>

          {/* CNIL et RGPD */}
          <section className="bg-blue-50 p-8 rounded-xl border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Protection des Données Personnelles
            </h2>
            <p className="text-gray-700 mb-4">
              Hakawa traite les données personnelles de ses utilisateurs
              conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés.
            </p>
            <p className="text-gray-700 mb-4">
              Pour plus d'informations sur la collecte et le traitement de vos
              données, consultez notre{" "}
              <Link
                to="/legal/privacy"
                className="text-orient-purple hover:underline font-semibold"
              >
                Politique de Confidentialité
              </Link>
              .
            </p>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Délégué à la Protection des Données (DPO) :</strong>
                <br />
                Email :{" "}
                <a
                  href="mailto:dpo@hakawa.app"
                  className="text-orient-purple hover:underline"
                >
                  dpo@hakawa.app
                </a>
              </p>
            </div>
          </section>

          {/* Médiation */}
          <section className="bg-purple-50 p-8 rounded-xl border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Médiation de la Consommation
            </h2>
            <p className="text-gray-700 mb-4">
              Conformément à l'article L.612-1 du Code de la consommation, nous
              proposons un dispositif de médiation gratuit pour tout litige non
              résolu à l'amiable :
            </p>
            <div className="bg-white p-6 rounded-lg">
              <p className="font-semibold text-purple-900 mb-2">
                Centre de Médiation de la Consommation de Conciliateurs de
                Justice (CM2C)
              </p>
              <p className="text-sm text-gray-700 space-y-1">
                <span className="block">14 rue Saint-Jean</span>
                <span className="block">75017 PARIS</span>
                <span className="block">France</span>
                <span className="block mt-2">
                  Email :{" "}
                  <a
                    href="mailto:cm2c@cm2c.net"
                    className="text-orient-purple hover:underline"
                  >
                    cm2c@cm2c.net
                  </a>
                </span>
                <span className="block">
                  Site web :{" "}
                  <a
                    href="https://www.cm2c.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orient-purple hover:underline"
                  >
                    www.cm2c.net
                  </a>
                </span>
              </p>
            </div>
          </section>

          {/* Loi applicable */}
          <section className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Loi Applicable et Juridiction
            </h2>
            <p className="text-gray-700 mb-4">
              Les présentes mentions légales ainsi que l'utilisation de la
              plateforme Hakawa sont régies par le{" "}
              <strong>droit français</strong>.
            </p>
            <p className="text-gray-700">
              En cas de litige et à défaut d'accord amiable, compétence
              exclusive est attribuée au{" "}
              <strong>Tribunal de commerce de Montpellier</strong>, nonobstant
              pluralité de défendeurs ou appel en garantie.
            </p>
          </section>

          {/* Liens externes */}
          <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Documentation Légale Complète
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/legal/cgu"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-orient-purple transition"
              >
                <span className="text-2xl">📜</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Conditions Générales d'Utilisation
                  </p>
                  <p className="text-xs text-gray-600">CGU complètes</p>
                </div>
              </Link>

              <Link
                to="/legal/cgv"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-orient-purple transition"
              >
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Conditions Générales de Vente
                  </p>
                  <p className="text-xs text-gray-600">CGV et tarifs</p>
                </div>
              </Link>

              <Link
                to="/legal/privacy"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-orient-purple transition"
              >
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Politique de Confidentialité
                  </p>
                  <p className="text-xs text-gray-600">RGPD et données</p>
                </div>
              </Link>

              <Link
                to="/legal/terms"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-orient-purple transition"
              >
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Conditions d'Utilisation
                  </p>
                  <p className="text-xs text-gray-600">Termes du service</p>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Dernière mise à jour : 29 décembre 2024
          </p>
        </div>
      </div>
    </div>
  );
}
