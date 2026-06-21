import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./store";

type Dict = Record<string, { en: string; te: string; hi: string }>;

const D: Dict = {
  // nav + global
  "nav.home": { en: "Home", te: "హోమ్", hi: "होम" },
  "nav.seekHelp": { en: "Seek help", te: "సహాయం కోరండి", hi: "मदद माँगें" },
  "nav.track": { en: "Track status", te: "స్థితి తెలుసుకోండి", hi: "स्थिति देखें" },
  "nav.dashboard": { en: "Dashboard", te: "డాష్‌బోర్డ్", hi: "डैशबोर्ड" },
  "nav.involved": { en: "Get involved", te: "భాగస్వామ్యం", hi: "जुड़ें" },
  "nav.gallery": { en: "Gallery", te: "గ్యాలరీ", hi: "गैलरी" },
  "nav.work": { en: "Our work", te: "మా పని", hi: "हमारा काम" },
  "nav.about": { en: "About", te: "గురించి", hi: "परिचय" },
  "nav.report": { en: "Report an issue", te: "సమస్యను నివేదించండి", hi: "समस्या दर्ज करें" },

  // common form
  "f.name": { en: "Your name", te: "మీ పేరు", hi: "आपका नाम" },
  "f.phone": { en: "Phone / WhatsApp", te: "ఫోన్ / వాట్సాప్", hi: "फोन / व्हाट्सएप" },
  "f.location": { en: "Location in Banjara Hills", te: "బంజారా హిల్స్‌లో ప్రాంతం", hi: "बंजारा हिल्स में स्थान" },
  "f.details": { en: "Describe your situation", te: "మీ పరిస్థితిని వివరించండి", hi: "अपनी स्थिति बताएँ" },
  "f.submit": { en: "Submit", te: "సమర్పించండి", hi: "जमा करें" },
  "f.required": { en: "Please fill this in", te: "దయచేసి దీన్ని పూరించండి", hi: "कृपया इसे भरें" },
  "f.validPhone": { en: "Enter a valid number", te: "సరైన నంబర్ నమోదు చేయండి", hi: "मान्य नंबर दर्ज करें" },

  // seek help
  "sh.choose": { en: "What do you need help with?", te: "మీకు దేనిలో సహాయం కావాలి?", hi: "आपको किसमें मदद चाहिए?" },
  "sh.chooseSub": { en: "Pick a category — it takes two minutes and you'll get a tracking number.", te: "ఒక విభాగాన్ని ఎంచుకోండి — రెండు నిమిషాలు, ట్రాకింగ్ నంబర్ వస్తుంది.", hi: "एक श्रेणी चुनें — दो मिनट, और ट्रैकिंग नंबर मिलेगा।" },
  "sh.formTitle": { en: "Tell us about your need", te: "మీ అవసరాన్ని చెప్పండి", hi: "अपनी ज़रूरत बताएँ" },
  "sh.getNumber": { en: "Submit & get tracking number", te: "సమర్పించి ట్రాకింగ్ నంబర్ పొందండి", hi: "जमा करें और ट्रैकिंग नंबर पाएँ" },
  "sh.received": { en: "Request received", te: "అభ్యర్థన అందింది", hi: "अनुरोध प्राप्त हुआ" },
  "sh.receivedMsg": { en: "A volunteer will be assigned within 24 hours and will contact you.", te: "24 గంటల్లో వాలంటీర్ కేటాయించబడి మిమ్మల్ని సంప్రదిస్తారు.", hi: "24 घंटे में एक वॉलंटियर नियुक्त होकर आपसे संपर्क करेगा।" },
  "sh.yourNumber": { en: "Your tracking number", te: "మీ ట్రాకింగ్ నంబర్", hi: "आपका ट्रैकिंग नंबर" },
  "sh.copy": { en: "Copy number", te: "నంబర్ కాపీ చేయండి", hi: "नंबर कॉपी करें" },
  "sh.copied": { en: "Copied", te: "కాపీ అయింది", hi: "कॉपी हुआ" },
  "sh.trackNow": { en: "Track this request", te: "ఈ అభ్యర్థనను ట్రాక్ చేయండి", hi: "इस अनुरोध को ट्रैक करें" },
  "sh.another": { en: "Submit another", te: "మరొకటి సమర్పించండి", hi: "एक और जमा करें" },
  "sh.whatsapp": { en: "Send on WhatsApp too", te: "వాట్సాప్‌లో కూడా పంపండి", hi: "व्हाट्सएप पर भी भेजें" },

  // track
  "tr.title": { en: "Track your application", te: "మీ దరఖాస్తును ట్రాక్ చేయండి", hi: "अपना आवेदन ट्रैक करें" },
  "tr.enter": { en: "Enter your tracking number", te: "మీ ట్రాకింగ్ నంబర్ నమోదు చేయండి", hi: "अपना ट्रैकिंग नंबर दर्ज करें" },
  "tr.button": { en: "Track", te: "ట్రాక్", hi: "ट्रैक" },
  "tr.notFound": { en: "No application found for that number.", te: "ఆ నంబర్‌కు దరఖాస్తు కనబడలేదు.", hi: "उस नंबर के लिए कोई आवेदन नहीं मिला।" },
  "tr.stageNow": { en: "Current stage", te: "ప్రస్తుత దశ", hi: "वर्तमान चरण" },

  // dashboard
  "db.received": { en: "Cases received", te: "అందిన కేసులు", hi: "प्राप्त मामले" },
  "db.verified": { en: "Cases verified", te: "ధృవీకరించిన కేసులు", hi: "सत्यापित मामले" },
  "db.resolved": { en: "Cases resolved", te: "పరిష్కరించిన కేసులు", hi: "हल किए मामले" },
  "db.volunteers": { en: "Volunteers active", te: "క్రియాశీల వాలంటీర్లు", hi: "सक्रिय वॉलंटियर" },
  "db.wards": { en: "Wards covered", te: "కవర్ చేసిన వార్డులు", hi: "कवर किए वार्ड" },
  "db.byCategory": { en: "Requests by category", te: "విభాగాల వారీగా అభ్యర్థనలు", hi: "श्रेणी अनुसार अनुरोध" },

  // emergency
  "em.title": { en: "Need urgent help?", te: "అత్యవసర సహాయం కావాలా?", hi: "तत्काल मदद चाहिए?" },
  "em.sub": { en: "Call now or send a WhatsApp — we respond fastest here.", te: "ఇప్పుడే కాల్ చేయండి లేదా వాట్సాప్ పంపండి — ఇక్కడ వేగంగా స్పందిస్తాం.", hi: "अभी कॉल करें या व्हाट्सएप भेजें — यहाँ सबसे तेज़ जवाब।" },
  "em.call": { en: "Call now", te: "ఇప్పుడే కాల్ చేయండి", hi: "अभी कॉल करें" },
  "em.whatsapp": { en: "WhatsApp", te: "వాట్సాప్", hi: "व्हाट्सएप" },
  "em.button": { en: "Emergency", te: "అత్యవసరం", hi: "आपातकाल" },

  // gallery
  "gallery.pageTitle": { en: "Gallery & Timeline", te: "గ్యాలరీ & కాలక్రమం", hi: "गैलरी और समयरेखा" },
  "gallery.pageSub": { en: "A visual record of community work, events and milestones across Banjara Hills.", te: "బంజారా హిల్స్‌లో సామాజిక కార్యక్రమాలు, ఈవెంట్లు మరియు మైలురాళ్ళ దృశ్య రికార్డు.", hi: "बंजारा हिल्स में सामुदायिक कार्य, कार्यक्रमों और पड़ावों का दृश्य रिकॉर्ड।" },
  "gallery.allPhotos": { en: "All photos", te: "అన్ని ఫోటోలు", hi: "सभी फ़ोटो" },
  "gallery.leader": { en: "Leader portraits", te: "నేత చిత్రాలు", hi: "नेता चित्र" },
  "gallery.events": { en: "Events & community", te: "కార్యక్రమాలు & సమాజం", hi: "कार्यक्रम और समाज" },
  "gallery.work": { en: "Before & after", te: "ముందు & తరువాత", hi: "पहले और बाद में" },
  "gallery.comingSoon": { en: "Photo coming soon", te: "ఫోటో త్వరలో వస్తుంది", hi: "फ़ोटो जल्द आएगी" },
  "gallery.close": { en: "✕ Close", te: "✕ మూసివేయి", hi: "✕ बंद करें" },
  "gallery.journey": { en: "Journey", te: "ప్రయాణం", hi: "यात्रा" },
  "gallery.timelineTitle": { en: "Two decades of service — milestone by milestone", te: "రెండు దశాబ్దాల సేవ — మైలురాయి మైలురాయిగా", hi: "दो दशकों की सेवा — पड़ाव दर पड़ाव" },
  "gallery.timelineSub": { en: "From grassroots organising to a digital civic platform — every step taken for Banjara Hills.", te: "సామాజిక వ్యవస్థీకరణ నుండి డిజిటల్ పౌర వేదిక వరకు — బంజారా హిల్స్ కోసం అడుగు వేసిన ప్రతి అడుగు.", hi: "जमीनी संगठन से डिजिटल सिविक प्लेटफॉर्म तक — बंजारा हिल्स के लिए उठाया हर कदम।" },
  "gallery.continues": { en: "The journey continues — one doorstep at a time.", te: "ప్రయాణం కొనసాగుతుంది — ఒక్కో గడప చేరుతూ.", hi: "यात्रा जारी है — एक-एक दरवाज़े तक।" },
  "gallery.bePartTitle": { en: "Be part of the next chapter", te: "తదుపరి అధ్యాయంలో భాగమవ్వండి", hi: "अगले अध्याय का हिस्सा बनें" },
  "gallery.bePartSub": { en: "Volunteer, report an issue, or just share what needs attention in your lane.", te: "వాలంటీర్ అవ్వండి, సమస్య నివేదించండి లేదా మీ వీధిలో అవసరమైన విషయం చెప్పండి.", hi: "वॉलंटियर करें, कोई समस्या दर्ज करें, या बस बताएं कि आपकी गली में क्या ध्यान चाहिए।" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("rf_lang") as Lang) || "en");
  useEffect(() => {
    localStorage.setItem("rf_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key: string) => D[key]?.[lang] ?? D[key]?.en ?? key;
  return <LangContext.Provider value={{ lang, setLang: setLangState, t }}>{children}</LangContext.Provider>;
}

export function useT() {
  return useContext(LangContext);
}

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
];
