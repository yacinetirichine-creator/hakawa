import { useTranslation } from "react-i18next";
import { usePricing } from "../../hooks/usePricing";

export function RegionSelector() {
  const { t } = useTranslation();
  const { regionCode, setRegionCode, availableRegions } = usePricing();

  const groups = {
    europe: ["FR", "BE", "CH", "ES"],
    americas: ["CA", "US", "MX", "AR", "CO"],
    africa: ["MA", "SN", "CI"],
  };

  const byCode = new Map(availableRegions.map((r) => [r.code, r]));

  return (
    <div className="relative">
      <select
        value={regionCode}
        onChange={(e) => setRegionCode(e.target.value)}
        className="bg-white rounded-full px-4 py-2 pr-10 shadow-md border border-gray-200 text-gray-700 text-sm font-medium"
        aria-label={t("pricing.region_selector_label", {
          defaultValue: "Region",
        })}
      >
        <optgroup
          label={t("pricing.region_groups.europe", {
            defaultValue: "🇪🇺 Europe",
          })}
        >
          {groups.europe.map((code) => {
            const r = byCode.get(code);
            return r ? (
              <option key={code} value={code}>
                {code} ({r.currency})
              </option>
            ) : null;
          })}
        </optgroup>
        <optgroup
          label={t("pricing.region_groups.americas", {
            defaultValue: "🌎 Amériques",
          })}
        >
          {groups.americas.map((code) => {
            const r = byCode.get(code);
            return r ? (
              <option key={code} value={code}>
                {code} ({r.currency})
              </option>
            ) : null;
          })}
        </optgroup>
        <optgroup
          label={t("pricing.region_groups.africa", {
            defaultValue: "🌍 Afrique",
          })}
        >
          {groups.africa.map((code) => {
            const r = byCode.get(code);
            return r ? (
              <option key={code} value={code}>
                {code} ({r.currency})
              </option>
            ) : null;
          })}
        </optgroup>
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orient-gold pointer-events-none">
        ▼
      </span>
    </div>
  );
}
