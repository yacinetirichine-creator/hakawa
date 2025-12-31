import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText } from "lucide-react";

export default function CGU() {
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
          <div className="bg-orient-purple/10 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-orient-purple" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              Conditions Générales d'Utilisation
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
            <code>/docs/CGU_OFFICIEL.md</code>
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Mentions Légales
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="font-semibold mb-2">
                Éditeur de la plateforme Hakawa :
              </p>
              <ul className="space-y-1 text-gray-700">
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
                  <strong>SIREN :</strong> 938 848 546
                </li>
                <li>
                  <strong>Siège social :</strong> 64 Avenue Marinville, 94100
                  Saint-Maur-des-Fossés, France
                </li>
                <li>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:contact@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    contact@hakawa.app
                  </a>
                </li>
                <li>
                  <strong>Directeur de publication :</strong> Présidente : Asmae
                  HOUAT (nom d'usage TIRICHINE)
                </li>
              </ul>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent
              l'accès et l'utilisation de la plateforme web{" "}
              <strong>Hakawa</strong>, accessible à l'adresse{" "}
              <a
                href="https://hakawa.app"
                className="text-orient-purple hover:underline"
              >
                https://hakawa.app
              </a>
              .
            </p>
            <p>
              Hakawa est une plateforme SaaS permettant de créer des livres
              assistés par intelligence artificielle (génération de texte,
              illustrations, mise en forme et export).
            </p>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Acceptation des CGU
            </h2>
            <p>
              L'utilisation de Hakawa implique l'acceptation pleine et entière
              des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez
              ne pas utiliser le Service.
            </p>
            <p>
              JARVIS SAS se réserve le droit de modifier les CGU à tout moment.
              Les utilisateurs seront informés par email et/ou notification sur
              la plateforme.
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Inscription et Compte Utilisateur
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              4.1 Conditions d'inscription
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Avoir au moins 18 ans (ou 16 ans avec autorisation parentale)
              </li>
              <li>Fournir des informations exactes et à jour</li>
              <li>Créer un mot de passe sécurisé</li>
              <li>Ne créer qu'un seul compte par personne</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              4.2 Sécurité du compte
            </h3>
            <p>
              Vous êtes responsable de la confidentialité de vos identifiants.
              Toute activité effectuée depuis votre compte est présumée être de
              votre fait.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Utilisation du Service
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                  ✅ Utilisation Autorisée
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Créer des livres personnels ou commerciaux</li>
                  <li>• Générer des textes et illustrations avec l'IA</li>
                  <li>• Importer vos manuscrits existants pour amélioration</li>
                  <li>• Uploader vos propres images</li>
                  <li>• Exporter vos créations (PDF, EPUB, KDP)</li>
                  <li>• Utiliser le contenu à des fins commerciales</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                  ❌ Utilisation Interdite
                </h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Contenu illégal, haineux, discriminatoire</li>
                  <li>• Contenu pornographique ou violent</li>
                  <li>• Usurpation d'identité</li>
                  <li>• Utilisation de bots ou scripts automatisés</li>
                  <li>• Contournement des mesures de sécurité</li>
                  <li>• Revente du service sans autorisation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Propriété Intellectuelle
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              6.1 Votre contenu
            </h3>
            <p>
              <strong>Vous conservez l'intégralité des droits</strong> sur les
              textes, projets et créations que vous générez sur Hakawa. En
              utilisant le service, vous nous accordez une licence non-exclusive
              pour héberger, afficher et traiter votre contenu dans le cadre du
              service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              6.2 Contenu généré par l'IA
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Textes :</strong> Générés via Anthropic Claude - Vous en
                êtes propriétaire sous réserve des conditions d'Anthropic
              </li>
              <li>
                <strong>Images :</strong> Générées via Replicate - Soumises aux
                licences des modèles utilisés
              </li>
              <li>
                <strong>Images personnelles :</strong> Vous conservez tous les
                droits sur vos uploads
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              6.3 Plateforme Hakawa
            </h3>
            <p>
              Tous les éléments de la plateforme (code, design, logo, marque)
              sont la propriété exclusive de JARVIS SAS et protégés par le droit
              d'auteur français et international.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Abonnements et Tarification
            </h2>
            <p className="mb-4">
              Consultez nos{" "}
              <Link
                to="/legal/cgv"
                className="text-orient-purple hover:underline font-semibold"
              >
                Conditions Générales de Vente
              </Link>{" "}
              pour les détails complets sur les abonnements, paiements et
              remboursements.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Formules disponibles :</h4>
              <ul className="space-y-2">
                <li>
                  🆓 <strong>Gratuit :</strong> 1 projet, 10 crédits/mois
                </li>
                <li>
                  📖 <strong>Conteur (9€/mois) :</strong> 5 projets, 50 crédits
                </li>
                <li>
                  ✍️ <strong>Auteur (29€/mois) :</strong> 20 projets, 200
                  crédits, correction IA
                </li>
                <li>
                  🎬 <strong>Studio (99€/mois) :</strong> Illimité, 1000
                  crédits, API
                </li>
              </ul>
            </div>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Protection des Données (RGPD)
            </h2>
            <p>
              JARVIS SAS traite vos données personnelles conformément au
              Règlement Général sur la Protection des Données (RGPD). Consultez
              notre{" "}
              <Link
                to="/legal/privacy"
                className="text-orient-purple hover:underline font-semibold"
              >
                Politique de Confidentialité
              </Link>{" "}
              pour plus de détails.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-4">
              <h4 className="font-semibold mb-2 text-blue-900">Vos droits :</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Droit d'accès et de rectification</li>
                <li>• Droit à l'effacement (« droit à l'oubli »)</li>
                <li>• Droit à la portabilité</li>
                <li>• Droit d'opposition</li>
                <li>• Droit de limitation du traitement</li>
              </ul>
              <p className="mt-3 text-sm text-blue-900">
                Contact DPO :{" "}
                <a href="mailto:dpo@hakawa.app" className="underline">
                  dpo@hakawa.app
                </a>
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Responsabilités et Garanties
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              9.1 Disponibilité du service
            </h3>
            <p>
              JARVIS SAS s'efforce d'assurer une disponibilité maximale du
              service (objectif 99,5%). Toutefois, nous ne pouvons garantir une
              disponibilité 24/7 ininterrompue.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              9.2 Limitation de responsabilité
            </h3>
            <p>JARVIS SAS ne peut être tenu responsable de :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>La perte de données due à une défaillance technique</li>
              <li>L'inexactitude du contenu généré par l'IA</li>
              <li>
                Les violations de droits d'auteur commises par les utilisateurs
              </li>
              <li>Les dommages indirects ou pertes de profit</li>
            </ul>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Résiliation
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              10.1 Résiliation par l'utilisateur
            </h3>
            <p>
              Vous pouvez résilier votre compte à tout moment depuis les
              paramètres. Aucun remboursement au prorata ne sera effectué pour
              les abonnements en cours.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              10.2 Résiliation par JARVIS SAS
            </h3>
            <p>
              Nous nous réservons le droit de suspendre ou supprimer votre
              compte en cas de :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violation des présentes CGU</li>
              <li>Non-paiement</li>
              <li>Utilisation abusive du service</li>
              <li>Activité frauduleuse</li>
            </ul>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Médiation et Règlement des Litiges
            </h2>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-2 text-purple-900">
                Médiation de la consommation
              </h4>
              <p className="text-sm text-purple-800 mb-3">
                Conformément à l'article L.612-1 du Code de la consommation,
                nous proposons un dispositif de médiation :
              </p>
              <div className="text-sm text-purple-900">
                <p>
                  <strong>
                    Centre de Médiation de la Consommation de Conciliateurs de
                    Justice (CM2C)
                  </strong>
                </p>
                <p>14 rue Saint-Jean, 75017 PARIS</p>
                <p>
                  Email :{" "}
                  <a href="mailto:cm2c@cm2c.net" className="underline">
                    cm2c@cm2c.net
                  </a>
                </p>
                <p>
                  Site :{" "}
                  <a
                    href="https://www.cm2c.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    https://www.cm2c.net
                  </a>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              Loi applicable et juridiction
            </h3>
            <p>
              Les présentes CGU sont régies par le droit français. En cas de
              litige, et à défaut d'accord amiable, compétence exclusive est
              attribuée au <strong>Tribunal de commerce de Créteil</strong>.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Modifications des CGU
            </h2>
            <p>
              JARVIS SAS se réserve le droit de modifier les présentes CGU à
              tout moment. Les utilisateurs seront informés par email et/ou
              notification sur la plateforme au moins 30 jours avant l'entrée en
              vigueur des modifications.
            </p>
            <p>
              La poursuite de l'utilisation du service après modification vaut
              acceptation des nouvelles CGU.
            </p>
          </section>

          {/* Article 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-3">
                Pour toute question concernant les présentes CGU :
              </p>
              <ul className="space-y-2">
                <li>
                  📧 Email général :{" "}
                  <a
                    href="mailto:contact@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    contact@hakawa.app
                  </a>
                </li>
                <li>
                  ⚖️ Email juridique :{" "}
                  <a
                    href="mailto:legal@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    legal@hakawa.app
                  </a>
                </li>
                <li>
                  🔒 DPO (RGPD) :{" "}
                  <a
                    href="mailto:dpo@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    dpo@hakawa.app
                  </a>
                </li>
                <li>
                  💳 Facturation :{" "}
                  <a
                    href="mailto:billing@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    billing@hakawa.app
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer de la page */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>
              Document juridiquement contraignant - Version du 29 décembre 2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
