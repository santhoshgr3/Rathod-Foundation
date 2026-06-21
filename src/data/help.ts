// The 8 "Seek Help" categories, each trilingual. `icon` maps to Icon.* keys.
export type HelpCategory = {
  id: string;
  icon: string;
  en: string;
  te: string;
  hi: string;
  descEn: string;
};

export const helpCategories: HelpCategory[] = [
  { id: "medical", icon: "medical", en: "Medical assistance", te: "వైద్య సహాయం", hi: "चिकित्सा सहायता", descEn: "Hospital referrals, surgery aid, medicines, health camps." },
  { id: "education", icon: "book", en: "Education support", te: "విద్యా సహాయం", hi: "शिक्षा सहायता", descEn: "School/college admissions, fees, scholarships, books." },
  { id: "scheme", icon: "doc", en: "Government scheme guidance", te: "ప్రభుత్వ పథకాల మార్గదర్శనం", hi: "सरकारी योजना मार्गदर्शन", descEn: "Find and apply for the schemes you're entitled to." },
  { id: "pension", icon: "rupee", en: "Pension issues", te: "పెన్షన్ సమస్యలు", hi: "पेंशन समस्याएँ", descEn: "Old-age, widow, disability pension applications & delays." },
  { id: "ration", icon: "card", en: "Ration card issues", te: "రేషన్ కార్డు సమస్యలు", hi: "राशन कार्ड समस्याएँ", descEn: "New cards, corrections, additions, and missing rations." },
  { id: "electricity", icon: "bolt", en: "Electricity or water grievances", te: "విద్యుత్/నీటి ఫిర్యాదులు", hi: "बिजली/पानी शिकायतें", descEn: "Connections, billing, outages and supply problems." },
  { id: "family", icon: "home", en: "Emergency family assistance", te: "అత్యవసర కుటుంబ సహాయం", hi: "आपातकालीन पारिवारिक सहायता", descEn: "Urgent help for families in crisis or distress." },
  { id: "senior", icon: "elder", en: "Senior citizen support", te: "వృద్ధుల సహాయం", hi: "वरिष्ठ नागरिक सहायता", descEn: "Help for elders living alone — documents, care, mobility." },
];

export function categoryLabel(id: string, lang: "en" | "te" | "hi"): string {
  const c = helpCategories.find((x) => x.id === id);
  if (!c) return id; // civic categories pass through as their English label
  return c[lang];
}

export const campaigns = [
  { id: "health-camp", title: "Free health & eye camp", date: "Jul 2026", area: "Road No. 12 community hall" },
  { id: "scheme-drive", title: "Government scheme awareness drive", date: "Aug 2026", area: "N.B. Nagar" },
  { id: "clean-banjara", title: "Clean Banjara Hills weekend", date: "Monthly", area: "Rotating wards" },
];
