# 🛡️ POLITIQUE RGPD - CONFORMITÉ COMPLÈTE

**HAKAWA - Registre des activités de traitement et documentation RGPD**

**Dernière mise à jour : 28 décembre 2024**

---

## SOMMAIRE

1. Introduction et engagement RGPD
2. Registre des activités de traitement
3. Analyse d'impact (AIPD)
4. Mesures de sécurité
5. Violations de données
6. Relations avec les sous-traitants
7. Transferts internationaux
8. Droits des personnes
9. Durées de conservation
10. Formation et sensibilisation
11. Audit et conformité

---

## 1. INTRODUCTION ET ENGAGEMENT RGPD

### 1.1 Engagement de JARVIS

JARVIS SAS s'engage à respecter la réglementation européenne en matière de protection des données personnelles et notamment :

- **RGPD** : Règlement (UE) 2016/679 du 27 avril 2016
- **Loi Informatique et Libertés** : Loi n°78-17 du 6 janvier 1978 modifiée
- **Directive ePrivacy** : Directive 2002/58/CE
- **Cybersécurité** : Directive NIS 2

### 1.2 Principes fondamentaux appliqués

Conformément à l'article 5 du RGPD, JARVIS respecte les principes suivants :

✅ **Licéité, loyauté, transparence** : Traitement légal, informations claires  
✅ **Limitation des finalités** : Données collectées pour des objectifs précis  
✅ **Minimisation** : Seules les données nécessaires sont collectées  
✅ **Exactitude** : Données à jour et correctes  
✅ **Limitation de conservation** : Durées définies et respectées  
✅ **Intégrité et confidentialité** : Sécurité maximale  
✅ **Responsabilité** (accountability) : Documentation et preuves de conformité

---

## 2. REGISTRE DES ACTIVITÉS DE TRAITEMENT

Conformément à l'article 30 du RGPD, JARVIS tient un registre détaillé de toutes les activités de traitement.

### 2.1 Traitement n°1 - Gestion des comptes utilisateurs

**Finalité :** Création et gestion des comptes  
**Base légale :** Exécution du contrat (Art. 6.1.b RGPD)  
**Catégories de données :**

- Identité : nom, prénom, email
- Authentification : mot de passe chiffré (bcrypt)
- Profil : photo, langue préférée
- Technique : date création, dernière connexion, IP

**Catégories de personnes concernées :** Utilisateurs inscrits  
**Destinataires :** Personnel JARVIS, Supabase (hébergement)  
**Transferts hors UE :** Supabase (Singapore) - CCT appliquées  
**Durée conservation :** Durée abonnement + 30 jours après résiliation  
**Mesures sécurité :** Chiffrement SSL/TLS, bcrypt, 2FA disponible

---

### 2.2 Traitement n°2 - Création de contenu (livres, textes)

**Finalité :** Fourniture du service de création de livres assistée par IA  
**Base légale :** Exécution du contrat (Art. 6.1.b RGPD)  
**Catégories de données :**

- Projets : titres, genres, styles, résumés
- Chapitres : textes rédigés ou générés par IA
- Métadonnées : dates création/modification, versions
- Conversations : historique chat IA
- Manuscrits importés : fichiers TXT, DOCX, PDF uploadés

**Catégories de personnes concernées :** Utilisateurs créateurs  
**Destinataires :**

- Personnel JARVIS (support technique)
- Supabase (stockage base de données)
- Anthropic (traitement IA - prompts uniquement)

**Transferts hors UE :**

- Anthropic Inc. (USA) - Clauses Contractuelles Types
- Données traitées : prompts et réponses IA (non utilisées pour entraînement)

**Durée conservation :** Durée abonnement + 30 jours  
**Mesures sécurité :**

- Chiffrement base de données (AES-256)
- Row Level Security (RLS) Supabase
- Isolation des données entre utilisateurs
- Sauvegardes chiffrées quotidiennes

---

### 2.3 Traitement n°3 - Génération d'illustrations par IA

**Finalité :** Création d'images pour les livres  
**Base légale :** Exécution du contrat (Art. 6.1.b RGPD)  
**Catégories de données :**

- Prompts de génération (descriptions textuelles)
- Images générées (URLs, métadonnées)
- Images uploadées par utilisateur (photos personnelles)
- Paramètres : style, résolution, modèle IA

**Catégories de personnes concernées :** Utilisateurs abonnés  
**Destinataires :**

- JARVIS (stockage URLs et métadonnées)
- Replicate Inc. (génération images)
- Supabase Storage (hébergement images)

**Transferts hors UE :**

- Replicate (USA) - DPA signé, conservation 30 jours max

**Durée conservation :**

- Images générées : durée abonnement + 30 jours
- Images uploadées : durée abonnement + 30 jours
- Prompts Replicate : 30 jours max puis suppression

**Mesures sécurité :**

- Upload sécurisé (validation format, taille max 10 Mo)
- Scan antivirus automatique
- Stockage privé avec authentification
- Watermarking désactivable

---

### 2.4 Traitement n°4 - Import et amélioration de manuscrits

**Finalité :** Permettre l'upload de livres existants pour correction/amélioration IA  
**Base légale :** Exécution du contrat (Art. 6.1.b RGPD)  
**Catégories de données :**

- Fichiers manuscrits (TXT, DOCX, PDF)
- Contenu textuel extrait
- Métadonnées (titre, auteur, nombre pages)
- Suggestions IA de corrections
- Historique versions

**Catégories de personnes concernées :** Utilisateurs uploadant des manuscrits  
**Destinataires :**

- JARVIS (traitement et stockage)
- Anthropic (analyse et suggestions IA)
- Supabase (stockage fichiers)

**Transferts hors UE :** Anthropic (USA) - CCT  
**Durée conservation :** Durée abonnement + 30 jours  
**Mesures sécurité :**

- Validation format (whitelist)
- Scan malware
- Chiffrement fichiers au repos
- Suppression automatique après conversion

---

### 2.5 Traitement n°5 - Facturation et paiements

**Finalité :** Gestion des abonnements et facturation  
**Base légale :**

- Exécution du contrat (Art. 6.1.b)
- Obligation légale comptable (Art. 6.1.c)

**Catégories de données :**

- Facturation : nom, prénom, adresse, pays, TVA
- Paiement : via Stripe (pas de données bancaires stockées chez JARVIS)
- Transactions : montants, dates, statuts
- Factures PDF générées

**Catégories de personnes concernées :** Utilisateurs abonnés payants  
**Destinataires :**

- JARVIS (facturation)
- Stripe Inc. (traitement paiement)
- Expert-comptable (obligations fiscales)

**Transferts hors UE :** Stripe (USA/Irlande) - Certification PCI-DSS Niveau 1  
**Durée conservation :**

- Factures : 10 ans (Code de commerce)
- Données paiement : voir politique Stripe
- Historique transactions : 10 ans

**Mesures sécurité :**

- Aucune donnée bancaire stockée chez JARVIS
- Stripe certifié PCI-DSS
- Factures chiffrées
- Accès restreint (comptabilité uniquement)

---

### 2.6 Traitement n°6 - Support client et assistance

**Finalité :** Répondre aux demandes d'aide et questions  
**Base légale :** Intérêt légitime (Art. 6.1.f RGPD)  
**Catégories de données :**

- Emails de support
- Tickets de support (contenu, pièces jointes)
- Logs techniques (captures écran, erreurs)
- Historique conversations

**Catégories de personnes concernées :** Utilisateurs contactant le support  
**Destinataires :** Personnel support JARVIS  
**Transferts hors UE :** Aucun  
**Durée conservation :** 3 ans après clôture ticket  
**Mesures sécurité :**

- Accès limité équipe support
- Chiffrement emails
- Anonymisation après 3 ans

---

### 2.7 Traitement n°7 - Analytics et amélioration du service

**Finalité :** Comprendre l'usage, détecter bugs, améliorer UX  
**Base légale :**

- Intérêt légitime (Art. 6.1.f) pour analytics internes
- Consentement (Art. 6.1.a) pour Google Analytics

**Catégories de données :**

- Technique : IP (anonymisée), navigateur, OS
- Navigation : pages visitées, clics, durée sessions
- Fonctionnalités : utilisation features, erreurs rencontrées
- Agrégées : statistiques anonymisées

**Catégories de personnes concernées :** Tous visiteurs et utilisateurs  
**Destinataires :**

- JARVIS (analytics internes)
- Google Analytics (si consentement)
- Sentry.io (logs erreurs)

**Transferts hors UE :**

- Google (USA) - Anonymisation IP
- Sentry (USA) - DPA

**Durée conservation :**

- Logs techniques : 12 mois
- Google Analytics : 26 mois
- Statistiques agrégées : 3 ans (anonymisées)

**Mesures sécurité :**

- Anonymisation IP systématique
- Données agrégées uniquement
- Opt-out possible
- Pas de tracking cross-site

---

### 2.8 Traitement n°8 - Sécurité et prévention fraude

**Finalité :** Protéger plateforme et utilisateurs contre abus  
**Base légale :** Intérêt légitime (Art. 6.1.f RGPD)  
**Catégories de données :**

- Logs connexion (IP, date/heure, succès/échec)
- Tentatives connexion échouées
- Actions suspectes (rate limiting triggers)
- Comptes signalés ou bannis

**Catégories de personnes concernées :** Tous utilisateurs  
**Destinataires :** Équipe sécurité JARVIS  
**Transferts hors UE :** Aucun (logs stockés UE)  
**Durée conservation :** 12 mois  
**Mesures sécurité :**

- Logs chiffrés
- Accès ultra-restreint
- Monitoring temps réel
- Alertes automatiques

---

### 2.9 Traitement n°9 - Marketing et newsletters

**Finalité :** Communication commerciale et actualités  
**Base légale :** Consentement (Art. 6.1.a RGPD)  
**Catégories de données :**

- Email
- Prénom (personnalisation)
- Statut abonnement (segmentation)
- Statistiques ouverture/clic

**Catégories de personnes concernées :** Utilisateurs ayant accepté newsletters  
**Destinataires :**

- JARVIS (envoi emails)
- Éventuellement plateforme emailing (à définir)

**Transferts hors UE :** À définir selon outil choisi  
**Durée conservation :** Jusqu'à désinscription + 3 ans (preuve consentement)  
**Mesures sécurité :**

- Opt-in explicite (double opt-in)
- Lien désinscription dans chaque email
- Gestion préférences accessible

---

## 3. ANALYSE D'IMPACT (AIPD)

### 3.1 Quand réaliser une AIPD ?

Une Analyse d'Impact relative à la Protection des Données (AIPD) est requise lorsque le traitement est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes.

**Critères CNIL déclenchant AIPD :**

- Évaluation ou notation (scoring)
- Décision automatisée avec effet juridique
- Surveillance systématique à grande échelle
- Données sensibles à grande échelle
- Croisement de données
- Personnes vulnérables (mineurs)
- Usage innovant de technologie
- Exclusion du bénéfice d'un droit/contrat

### 3.2 AIPD réalisée pour Hakawa

**Traitement concerné :** Génération de contenu par IA (Anthropic Claude)

**Risques identifiés :**

1. **Divulgation non autorisée** de contenus créatifs sensibles
2. **Perte de données** (manuscrits, projets)
3. **Utilisation abusive** des contenus par des tiers
4. **Biais IA** pouvant affecter qualité contenu

**Mesures d'atténuation :**

1. Chiffrement end-to-end, RLS Supabase
2. Sauvegardes quotidiennes géo-répliquées
3. DPA Anthropic (pas d'entraînement sur données utilisateurs)
4. Revue humaine recommandée, avertissements utilisateurs

**Conclusion AIPD :** Risques résiduels acceptables après mise en place des mesures.

---

## 4. MESURES DE SÉCURITÉ

### 4.1 Sécurité technique

**Chiffrement :**

- ✅ SSL/TLS (HTTPS) : toutes communications
- ✅ Mots de passe : bcrypt + salt unique
- ✅ Données sensibles : AES-256
- ✅ Base de données : chiffrement at-rest (Supabase)
- ✅ Sauvegardes : chiffrées

**Authentification et contrôle d'accès :**

- ✅ Authentification forte (OAuth Google + email/password)
- ✅ 2FA disponible (TOTP)
- ✅ Row Level Security (RLS) - isolation utilisateurs
- ✅ Tokens JWT signés (expiration 24h)
- ✅ Rate limiting (protection bruteforce)

**Infrastructure :**

- ✅ Firewall applicatif (WAF)
- ✅ Protection DDoS (Cloudflare)
- ✅ Monitoring 24/7 (Sentry, logs)
- ✅ Détection intrusions
- ✅ Sauvegardes automatiques quotidiennes
- ✅ Géo-réplication (multi-région)

**Développement sécurisé :**

- ✅ Code review obligatoire
- ✅ Tests sécurité automatisés
- ✅ Scan vulnérabilités (Dependabot)
- ✅ Validation inputs (protection XSS, SQLi)
- ✅ CORS configuré strictement

### 4.2 Sécurité organisationnelle

**Accès et habilitations :**

- ✅ Principe du moindre privilège
- ✅ Revue accès trimestrielle
- ✅ Logs accès administrateur
- ✅ Séparation dev/prod stricte

**Formation :**

- ✅ Sensibilisation RGPD annuelle (équipe)
- ✅ Formation sécurité informatique
- ✅ Procédures de réponse incidents

**Contrats :**

- ✅ Clauses confidentialité (employés)
- ✅ DPA (Data Processing Agreements) avec sous-traitants
- ✅ Clauses Contractuelles Types (transferts hors UE)

---

## 5. VIOLATIONS DE DONNÉES (DATA BREACH)

### 5.1 Procédure de notification

Conformément à l'article 33 du RGPD :

**En cas de violation de données personnelles :**

**Étape 1 - Détection (0-24h) :**

- Identification de la violation
- Qualification de la gravité
- Constitution équipe de crise

**Étape 2 - Évaluation (24-48h) :**

- Nature de la violation
- Catégories et nombre de personnes concernées
- Catégories et volume de données
- Conséquences probables

**Étape 3 - Notification CNIL (< 72h) :**
Si risque pour les droits et libertés :

- Notification CNIL obligatoire sous 72h
- Via plateforme : https://www.cnil.fr/notifier-une-violation
- Contenu : nature, catégories, conséquences, mesures

**Étape 4 - Notification personnes concernées :**
Si risque élevé :

- Email personnalisé à chaque personne affectée
- Informations claires sur la violation
- Mesures prises et recommandations

**Étape 5 - Documentation :**

- Registre interne des violations
- Mesures correctives appliquées
- Leçons apprises (amélioration continue)

### 5.2 Registre des violations

JARVIS tient un registre de toutes les violations (même non notifiées) contenant :

- Date et heure
- Circonstances
- Effets
- Mesures prises

**Aucune violation signalée à ce jour.**

---

## 6. RELATIONS AVEC LES SOUS-TRAITANTS

### 6.1 Liste des sous-traitants (Art. 28 RGPD)

| Sous-traitant      | Pays         | Service              | DPA signé | Certification    |
| ------------------ | ------------ | -------------------- | --------- | ---------------- |
| Supabase Inc.      | Singapore/UE | Base données         | ✅ Oui    | SOC 2, ISO 27001 |
| Vercel Inc.        | USA          | Hébergement frontend | ✅ Oui    | SOC 2            |
| Render Services    | USA          | Backend API          | ✅ Oui    | SOC 2            |
| Anthropic Inc.     | USA          | IA texte (Claude)    | ✅ Oui    | SOC 2            |
| Replicate Inc.     | USA          | IA images            | ✅ Oui    | -                |
| Stripe Inc.        | USA/IRL      | Paiements            | ✅ Oui    | PCI-DSS Niveau 1 |
| Google (Analytics) | USA          | Analytics            | ✅ Oui    | ISO 27001        |
| Sentry.io          | USA          | Monitoring erreurs   | ✅ Oui    | SOC 2            |

### 6.2 Obligations contractuelles

Tous les DPA (Data Processing Agreements) incluent :

✅ **Instructions documentées** : traitement uniquement selon nos instructions  
✅ **Confidentialité** : engagement personnel autorisé  
✅ **Sécurité** : mesures techniques et organisationnelles  
✅ **Sous-traitance ultérieure** : autorisation préalable requise  
✅ **Assistance** : aide pour réponse aux demandes personnes concernées  
✅ **Suppression/restitution** : en fin de contrat  
✅ **Audits** : droit de vérification  
✅ **Notification violations** : sans délai

---

## 7. TRANSFERTS INTERNATIONAUX

### 7.1 Cadre juridique

Les transferts de données hors UE/EEE vers pays tiers sont encadrés par le Chapitre V du RGPD.

**Mécanismes utilisés par JARVIS :**

**1. Clauses Contractuelles Types (CCT) :**

- Anthropic Inc. (USA) - CCT 2021
- Replicate Inc. (USA) - CCT 2021
- Sentry.io (USA) - CCT 2021

**2. Certifications :**

- Stripe Inc. : PCI-DSS + DPA renforcé
- Google : DPA + Mesures supplémentaires post-Schrems II

**3. Localisation données UE (quand possible) :**

- Supabase : région Frankfurt (Allemagne)
- Render : région Paris (France) disponible

### 7.2 Évaluation Schrems II

Suite à l'arrêt Schrems II (CJUE, 16 juillet 2020), JARVIS a réalisé une évaluation des transferts vers USA :

**Risques identifiés :**

- FISA Section 702 (surveillance USA)
- Executive Order 12333

**Mesures supplémentaires :**

- Chiffrement systématique (données en transit et au repos)
- Minimisation des données transférées
- Pseudonymisation quand possible
- Clauses contractuelles renforcées
- Engagement sous-traitants : notification si réquisition

**Conclusion :** Garanties appropriées en place.

---

## 8. DROITS DES PERSONNES

### 8.1 Procédures d'exercice des droits

**Contact :** privacy@hakawa.app

**Délai de réponse :** 1 mois (prolongation 2 mois si complexe)

**Vérification identité :** Pièce d'identité (CNI, passeport) si doute

**Gratuité :** Oui (sauf demandes manifestement infondées/excessives)

### 8.2 Droits implémentés

**Droit d'accès (Art. 15) :**

- ✅ Interface : Paramètres > Mes données
- ✅ Export JSON de toutes données personnelles
- ✅ Informations : finalités, destinataires, durées

**Droit de rectification (Art. 16) :**

- ✅ Interface : Paramètres > Profil
- ✅ Modification directe nom, email, photo

**Droit à l'effacement (Art. 17) :**

- ✅ Interface : Paramètres > Supprimer mon compte
- ✅ Suppression définitive sous 30 jours
- ✅ Exception : factures (obligation légale 10 ans)

**Droit à la portabilité (Art. 20) :**

- ✅ Interface : Paramètres > Exporter mes données
- ✅ Format : JSON structuré
- ✅ Contenu : profil, projets, chapitres, métadonnées

**Droit d'opposition (Art. 21) :**

- ✅ Marketing : désinscription newsletters
- ✅ Analytics : refus cookies

**Droit limitation (Art. 18) :**

- ⚙️ Sur demande par email (gel traitement)

---

## 9. DURÉES DE CONSERVATION

| Catégorie données         | Durée base active | Durée archivage            | Suppression définitive |
| ------------------------- | ----------------- | -------------------------- | ---------------------- |
| Compte utilisateur        | Abonnement actif  | 30 jours après résiliation | Après archivage        |
| Projets et textes         | Abonnement actif  | 30 jours                   | Après archivage        |
| Images générées/uploadées | Abonnement actif  | 30 jours                   | Après archivage        |
| Manuscrits importés       | Abonnement actif  | 30 jours                   | Après archivage        |
| Factures                  | 10 ans            | N/A                        | Après 10 ans           |
| Logs techniques           | 12 mois           | N/A                        | Après 12 mois          |
| Support (tickets)         | 3 ans             | N/A                        | Après 3 ans            |
| Analytics (anonymisé)     | 26 mois           | N/A                        | Après 26 mois          |
| Consentement marketing    | Jusqu'à retrait   | 3 ans (preuve)             | Après 3 ans            |

---

## 10. FORMATION ET SENSIBILISATION

### 10.1 Plan de formation

**Personnel JARVIS :**

- ✅ Formation RGPD initiale (onboarding)
- ✅ Rappel annuel (mise à jour connaissances)
- ✅ Formation sécurité informatique
- ✅ Procédures incidents et violations

**Contenu formation :**

- Principes RGPD
- Droits des personnes
- Sécurité données
- Procédures internes
- Cas pratiques

### 10.2 Documentation interne

- ✅ Guide RGPD interne
- ✅ Fiches réflexes (data breach, demandes droits)
- ✅ Checklist conformité
- ✅ Contacts utiles (CNIL, DPO)

---

## 11. AUDIT ET CONFORMITÉ

### 11.1 Revue de conformité

**Fréquence :** Trimestrielle

**Points vérifiés :**

- ✅ Registre des traitements à jour
- ✅ DPA sous-traitants valides
- ✅ Mesures sécurité effectives
- ✅ Durées conservation respectées
- ✅ Demandes droits traitées dans les délais
- ✅ Formation équipe réalisée

### 11.2 Audits externes

**Prévus :**

- Audit sécurité : Annuel (pentest)
- Audit RGPD : Tous les 2 ans (cabinet spécialisé)

### 11.3 Améliorations continues

- Veille juridique (évolutions RGPD)
- Retours utilisateurs
- Incidents de sécurité (leçons apprises)
- Nouvelles technologies (évaluation privacy by design)

---

## 12. CONTACT ET RESSOURCES

**Délégué à la Protection des Données (DPO) :**  
Email : dpo@hakawa.app  
Courrier : JARVIS SAS - DPO, 22 Rue du Docteur Louis Marçon, 34070 MONTPELLIER

**Service protection des données :**  
Email : privacy@hakawa.app

**Autorité de contrôle :**  
CNIL - 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07  
Tél : +33 1 53 73 22 22  
https://www.cnil.fr

**Ressources utiles :**

- Texte RGPD : https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Guides CNIL : https://www.cnil.fr/fr/rgpd-passer-a-laction
- Modèles CCT : https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_fr

---

**Date de dernière révision : 28 décembre 2024**

**Version : 2.0**

**Prochaine revue programmée : 28 mars 2025**

---

## ANNEXE - MODÈLE DE DEMANDE D'EXERCICE DES DROITS

```
Objet : Demande d'exercice de mes droits RGPD

Madame, Monsieur,

Je soussigné(e) [NOM Prénom], titulaire du compte Hakawa [email@example.com],
vous demande, conformément au RGPD, de procéder à [choisir] :

☐ L'accès à mes données personnelles (Art. 15)
☐ La rectification de mes données (Art. 16) : [préciser]
☐ L'effacement de mes données / "droit à l'oubli" (Art. 17)
☐ La portabilité de mes données au format JSON (Art. 20)
☐ L'opposition au traitement de mes données pour [finalité] (Art. 21)
☐ La limitation du traitement de mes données (Art. 18)

[Précisions éventuelles]

Je joins une copie de ma pièce d'identité pour vérification.

Je vous remercie de me répondre sous un délai d'un mois.

Cordialement,
[Signature]
```

---

**Document confidentiel - Usage interne JARVIS et autorités de contrôle**
