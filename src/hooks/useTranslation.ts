import { useLangStore } from "@/stores/lang-store";
import { translations, TranslationKey } from "@/lib/translations";

export function useT() {
  const lang = useLangStore((s) => s.lang);
  return (key: TranslationKey): string => translations[key][lang];
}
