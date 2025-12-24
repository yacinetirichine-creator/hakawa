import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

/**
 * Composant SEO dynamique pour optimiser chaque page
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de la page
 * @param {string} props.description - Description de la page
 * @param {string} props.keywords - Mots-clés SEO
 * @param {string} props.image - URL de l'image pour OG
 * @param {string} props.url - URL canonique
 * @param {string} props.type - Type de page (website, article, etc.)
 */
export function SEO({
  title,
  description,
  keywords,
  image = "https://hakawa.app/og-image.jpg",
  url,
  type = "website",
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const siteTitle = "Hakawa - Créateur de Livres IA";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const canonicalUrl = url || `https://hakawa.app${window.location.pathname}`;

  return (
    <Helmet>
      {/* Titre */}
      <title>{fullTitle}</title>

      {/* Meta de base */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Hakawa" />
      <html lang={lang} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Langues alternatives */}
      <link rel="alternate" hrefLang="fr" href={`${canonicalUrl}?lang=fr`} />
      <link rel="alternate" hrefLang="en" href={`${canonicalUrl}?lang=en`} />
      <link rel="alternate" hrefLang="ar" href={`${canonicalUrl}?lang=ar`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title || "Hakawa"} />
      <meta
        property="og:locale"
        content={lang === "fr" ? "fr_FR" : lang === "ar" ? "ar_AR" : "en_US"}
      />
      <meta property="og:site_name" content="Hakawa" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@hakawa" />

      {/* WhatsApp / Telegram */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Robots */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />

      {/* PWA */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Hakawa" />

      {/* Vérification moteurs de recherche (à configurer) */}
      {/* <meta name="google-site-verification" content="YOUR_CODE" /> */}
      {/* <meta name="msvalidate.01" content="YOUR_CODE" /> */}
    </Helmet>
  );
}

export default SEO;
