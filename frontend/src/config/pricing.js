export const CURRENCIES = {
  EUR: { code: "EUR", locale: "fr-FR" },
  USD: { code: "USD", locale: "en-US" },
  MAD: { code: "MAD", locale: "fr-MA" },
  XOF: { code: "XOF", locale: "fr-SN" },
  CAD: { code: "CAD", locale: "fr-CA" },
  MXN: { code: "MXN", locale: "es-MX" },
  ARS: { code: "ARS", locale: "es-AR" },
  COP: { code: "COP", locale: "es-CO" },
};

/**
 * Prices provided by the API are assumed to be in EUR.
 * We apply a PPP factor, then convert using an exchange rate.
 */
export const REGIONS = {
  // Europe
  FR: {
    code: "FR",
    currency: "EUR",
    locale: "fr-FR",
    exchangeRate: 1,
    pppFactor: 1,
  },
  BE: {
    code: "BE",
    currency: "EUR",
    locale: "fr-BE",
    exchangeRate: 1,
    pppFactor: 1,
  },
  CH: {
    code: "CH",
    currency: "EUR",
    locale: "fr-CH",
    exchangeRate: 1,
    pppFactor: 1.1,
  },
  ES: {
    code: "ES",
    currency: "EUR",
    locale: "es-ES",
    exchangeRate: 1,
    pppFactor: 0.9,
  },

  // North America
  CA: {
    code: "CA",
    currency: "CAD",
    locale: "fr-CA",
    exchangeRate: 1.45,
    pppFactor: 1,
  },
  US: {
    code: "US",
    currency: "USD",
    locale: "en-US",
    exchangeRate: 1.08,
    pppFactor: 1,
  },

  // LatAm
  MX: {
    code: "MX",
    currency: "MXN",
    locale: "es-MX",
    exchangeRate: 18.5,
    pppFactor: 0.5,
  },
  AR: {
    code: "AR",
    currency: "ARS",
    locale: "es-AR",
    exchangeRate: 950,
    pppFactor: 0.3,
  },
  CO: {
    code: "CO",
    currency: "COP",
    locale: "es-CO",
    exchangeRate: 4200,
    pppFactor: 0.4,
  },

  // Africa
  MA: {
    code: "MA",
    currency: "MAD",
    locale: "fr-MA",
    exchangeRate: 10.8,
    pppFactor: 0.45,
  },
  SN: {
    code: "SN",
    currency: "XOF",
    locale: "fr-SN",
    exchangeRate: 655.96,
    pppFactor: 0.3,
  },
  CI: {
    code: "CI",
    currency: "XOF",
    locale: "fr-CI",
    exchangeRate: 655.96,
    pppFactor: 0.3,
  },
};

export const DEFAULT_REGION_CODE = "FR";

export function isValidRegionCode(code) {
  return Boolean(code && REGIONS[String(code).toUpperCase()]);
}

export function getRegion(code) {
  const normalized = String(code || "").toUpperCase();
  return REGIONS[normalized] || REGIONS[DEFAULT_REGION_CODE];
}

export function adjustPriceFromEur(eurAmount, region) {
  const base = Number(eurAmount);
  if (!Number.isFinite(base) || base <= 0) return 0;

  const adjusted = base * region.pppFactor * region.exchangeRate;

  // Round per currency conventions
  if (["XOF", "ARS", "COP"].includes(region.currency)) {
    return Math.round(adjusted / 100) * 100;
  }

  const rounded = Math.round(adjusted);
  // Avoid negative cents for small values
  return Math.max(0, rounded - 0.01);
}

export function formatCurrency(amount, region) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "";

  const fractionDigits = region.currency === "XOF" ? 0 : 2;
  return new Intl.NumberFormat(region.locale, {
    style: "currency",
    currency: region.currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
