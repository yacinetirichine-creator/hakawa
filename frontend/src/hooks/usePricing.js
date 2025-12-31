import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_REGION_CODE,
  adjustPriceFromEur,
  formatCurrency,
  getRegion,
  isValidRegionCode,
  REGIONS,
} from "../config/pricing";

function detectRegionCode() {
  // 1) URL param (testing)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const regionParam = urlParams.get("region");
    if (isValidRegionCode(regionParam)) {
      return String(regionParam).toUpperCase();
    }
  } catch {
    // ignore
  }

  // 2) localStorage
  try {
    const saved = localStorage.getItem("hakawa_region");
    if (isValidRegionCode(saved)) return String(saved).toUpperCase();
  } catch {
    // ignore
  }

  // 3) navigator locale country
  const locale = navigator.language || "fr-FR";
  const countryCode = locale.split("-")[1]?.toUpperCase();
  if (isValidRegionCode(countryCode)) return countryCode;

  return DEFAULT_REGION_CODE;
}

export function usePricing() {
  const [regionCode, setRegionCodeState] = useState(() => detectRegionCode());

  const setRegionCode = useCallback((nextCode) => {
    const code = String(nextCode || "").toUpperCase();
    if (!isValidRegionCode(code)) return;

    setRegionCodeState(code);
    try {
      localStorage.setItem("hakawa_region", code);
    } catch {
      // ignore
    }
  }, []);

  const region = useMemo(() => getRegion(regionCode), [regionCode]);

  const convertFromEur = useCallback(
    (eurAmount) => adjustPriceFromEur(eurAmount, region),
    [region]
  );

  const format = useCallback(
    (amount) => formatCurrency(amount, region),
    [region]
  );

  const availableRegions = useMemo(() => Object.values(REGIONS), []);

  return {
    region,
    regionCode,
    setRegionCode,
    convertFromEur,
    format,
    availableRegions,
  };
}
