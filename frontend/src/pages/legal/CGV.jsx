import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";

export default function CGV() {
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
          <div className="bg-orient-gold/10 p-3 rounded-lg">
            <ShoppingCart className="w-8 h-8 text-orient-gold" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              Conditions Générales de Vente
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
            <code>/docs/CGV_OFFICIEL.md</code>
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Informations Légales
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="font-semibold mb-2">Vendeur :</p>
              <ul className="space-y-1 text-gray-700">
                <li>
                  <strong>Raison sociale :</strong> JARVIS
                </li>
                <li>
                  <strong>Forme juridique :</strong> SAS - Capital social 1
                  000,00 EUR
                </li>
                <li>
                  <strong>SIREN :</strong> 938 848 546
                </li>
                <li>
                  <strong>RCS :</strong> 938 848 546 R.C.S. Créteil
                </li>
                <li>
                  <strong>Adresse :</strong> 64 Avenue Marinville, 94100
                  Saint-Maur-des-Fossés
                </li>
                <li>
                  <strong>Email :</strong> billing@hakawa.app
                </li>
              </ul>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Offres d'Abonnement
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Gratuit */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🆓</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Gratuit</h3>
                    <p className="text-2xl font-bold text-gray-600">0€</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ 1 projet actif</li>
                  <li>✓ 10 crédits IA/mois</li>
                  <li>✓ Export PDF basique</li>
                  <li>✓ 100 MB stockage images</li>
                </ul>
              </div>

              {/* Conteur */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📖</span>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">
                      Conteur
                    </h3>
                    <p className="text-2xl font-bold text-purple-600">
                      9€/mois
                    </p>
                    <p className="text-sm text-purple-600">ou 90€/an (-17%)</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ 5 projets actifs</li>
                  <li>✓ 50 crédits IA/mois</li>
                  <li>✓ Export PDF & EPUB</li>
                  <li>✓ 500 MB stockage images</li>
                </ul>
              </div>

              {/* Auteur */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">✍️</span>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Auteur</h3>
                    <p className="text-2xl font-bold text-blue-600">29€/mois</p>
                    <p className="text-sm text-blue-600">ou 290€/an (-17%)</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ 20 projets actifs</li>
                  <li>✓ 200 crédits IA/mois</li>
                  <li>✓ Export KDP Amazon</li>
                  <li>✓ Correction IA manuscrits</li>
                  <li>✓ 2 GB stockage images</li>
                </ul>
              </div>

              {/* Studio */}
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-300 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎬</span>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">
                      Studio
                    </h3>
                    <p className="text-2xl font-bold text-purple-600">
                      99€/mois
                    </p>
                    <p className="text-sm text-purple-600">ou 990€/an (-17%)</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ Projets illimités</li>
                  <li>✓ 1000 crédits IA/mois</li>
                  <li>✓ Accès API développeur</li>
                  <li>✓ Support prioritaire</li>
                  <li>✓ 10 GB stockage images</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>💡 Astuce :</strong> Les abonnements annuels bénéficient
                d'une réduction de 17% (2 mois offerts).
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Prix et TVA
            </h2>
            <p>
              Tous les prix sont indiqués en euros (EUR){" "}
              <strong>Toutes Taxes Comprises (TTC)</strong>, TVA française à 20%
              incluse.
            </p>
            <p className="mt-2">
              Pour les professionnels établis dans l'UE avec numéro de TVA
              intracommunautaire valide, la TVA sera facturée selon le mécanisme
              d'autoliquidation.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2 text-blue-900">
                Exemple de calcul :
              </h4>
              <p className="text-sm text-blue-800">
                Abonnement Auteur : 29€ TTC = 24,17€ HT + 4,83€ TVA (20%)
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Modalités de Paiement
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-orient-purple" />
              <p className="font-semibold">Paiement sécurisé via Stripe</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Moyens de paiement acceptés :
            </h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
              <li>Apple Pay / Google Pay</li>
              <li>SEPA (virement bancaire)</li>
            </ul>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>🔒 Sécurité :</strong> Hakawa ne stocke aucune donnée
                bancaire. Tous les paiements sont traités par Stripe (certifié
                PCI-DSS niveau 1).
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
              Renouvellement automatique
            </h3>
            <p>
              Les abonnements sont renouvelés automatiquement à chaque échéance
              (mensuelle ou annuelle). Vous pouvez annuler le renouvellement à
              tout moment depuis vos paramètres.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Droit de Rétractation
            </h2>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">
                ⚠️ Exclusion du droit de rétractation
              </p>
              <p className="text-sm text-red-800">
                Conformément à l'article L221-28 du Code de la consommation, le
                droit de rétractation de 14 jours{" "}
                <strong>ne s'applique pas</strong> aux contenus numériques dont
                l'exécution a commencé avec votre accord exprès avant la fin du
                délai de rétractation.
              </p>
            </div>

            <p className="mt-4">
              En souscrivant à un abonnement Hakawa et en utilisant le service
              (génération de texte, images, exports), vous renoncez expressément
              à votre droit de rétractation.
            </p>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Politique de Remboursement
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Cas de remboursement :
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Double facturation :</strong> Remboursement intégral
                immédiat
              </li>
              <li>
                <strong>Service non disponible :</strong> Remboursement au
                prorata des jours d'indisponibilité
              </li>
              <li>
                <strong>Impossibilité technique :</strong> Remboursement partiel
                ou total après diagnostic
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              Cas d'exclusion :
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Changement d'avis après utilisation du service</li>
              <li>Non-utilisation du compte (crédits non consommés)</li>
              <li>Résiliation en cours d'abonnement sans motif légitime</li>
            </ul>

            <p className="mt-4 text-sm text-gray-600">
              Délai de remboursement : 14 jours ouvrés après acceptation de la
              demande.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Résiliation
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              7.1 Résiliation par le client
            </h3>
            <p>
              Vous pouvez résilier votre abonnement à tout moment depuis{" "}
              <strong>
                Paramètres &gt; Abonnement &gt; Annuler le renouvellement
              </strong>
              . L'accès reste actif jusqu'à la fin de la période payée.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              7.2 Résiliation par JARVIS SAS
            </h3>
            <p>
              Nous nous réservons le droit de résilier votre abonnement en cas
              de :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Non-paiement après relance (délai 15 jours)</li>
              <li>Violation des CGU ou CGV</li>
              <li>Utilisation frauduleuse du service</li>
            </ul>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Facturation
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Conservation des factures
            </h3>
            <p>
              Conformément à l'article 289 du Code général des impôts, les
              factures sont conservées pendant <strong>10 ans</strong>.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              Accès aux factures
            </h3>
            <p>
              Vous pouvez télécharger toutes vos factures depuis{" "}
              <strong>Paramètres &gt; Facturation</strong> ou sur votre espace
              client Stripe.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>Mentions sur les factures :</strong> Raison sociale,
                SIREN, adresse, TVA, détail prestations, montants HT/TTC
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Propriété Intellectuelle et Licences
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Contenu généré
            </h3>
            <p>
              En souscrivant à un abonnement payant, vous obtenez une{" "}
              <strong>licence commerciale complète</strong> pour exploiter les
              contenus générés (textes, illustrations) sans limite de temps ni
              de territoire.
            </p>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-4">
              <p className="text-sm text-purple-900">
                <strong>✅ Vous pouvez :</strong> Publier, vendre, distribuer
                vos livres créés avec Hakawa sur Amazon KDP, Apple Books, Google
                Play, etc.
              </p>
            </div>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Protection des Données
            </h2>
            <p>
              Le traitement de vos données personnelles (nom, email,
              informations de paiement) est conforme au RGPD. Consultez notre{" "}
              <Link
                to="/legal/privacy"
                className="text-orient-purple hover:underline font-semibold"
              >
                Politique de Confidentialité
              </Link>
              .
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-900">
                <strong>Sous-traitants de paiement :</strong> Stripe Inc. (USA)
                - Transferts hors UE encadrés par Clauses Contractuelles Types
                (CCT).
              </p>
            </div>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Garanties et Responsabilité
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Garantie de conformité
            </h3>
            <p>
              Hakawa s'engage à fournir un service conforme aux descriptions et
              fonctionnalités annoncées. En cas de non-conformité, vous disposez
              d'un droit de mise en conformité ou de résolution du contrat.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
              Limitation de responsabilité
            </h3>
            <p>
              JARVIS SAS ne peut être tenu responsable des dommages indirects
              (perte de données, manque à gagner, préjudice commercial)
              résultant de l'utilisation du service.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Médiation et Litiges
            </h2>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h4 className="font-semibold mb-2 text-purple-900">
                Médiation de la consommation
              </h4>
              <p className="text-sm text-purple-800 mb-3">
                En cas de litige, vous pouvez saisir gratuitement le médiateur
                de la consommation :
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

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
              Plateforme européenne de règlement des litiges en ligne
            </h3>
            <p className="text-sm">
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orient-purple hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
              Juridiction compétente
            </h3>
            <p>
              À défaut d'accord amiable, compétence exclusive est attribuée au{" "}
              <strong>Tribunal de commerce de Créteil</strong>.
            </p>
          </section>

          {/* Article 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact Service Client
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2">
                <li>
                  📧 Support client :{" "}
                  <a
                    href="mailto:support@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    support@hakawa.app
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
                <li>
                  ⚖️ Juridique :{" "}
                  <a
                    href="mailto:legal@hakawa.app"
                    className="text-orient-purple hover:underline"
                  >
                    legal@hakawa.app
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Délai de réponse : 48h ouvrées maximum
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="w-4 h-4 text-green-600" />
            <span>
              Document juridiquement contraignant - Version du 29 décembre 2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
