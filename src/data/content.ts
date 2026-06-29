// ============================================================================
//  RATHOD FOUNDATION — single source of truth for all site content.
//  Edit values here; the UI updates automatically. Items marked  // TODO
//  are realistic placeholders — replace with verified figures / photos.
// ============================================================================

export const leader = {
  name: "R. Dhanraj Rathod",
  shortName: "Dhanraj Rathod",
  org: "Rathod Foundation",
  tagline: "Connecting needs with solutions across Banjara Hills.",
  role: "Founder — Rathod Foundation | Community Leader & Social Worker, Banjara Hills",
  dob: "14 September 1976",
  community: "S.T. (Lambadi)",
  languages: ["English", "Hindi", "Telugu"],
  location: "N.B. Nagar, Road No. 12, Banjara Hills, Hyderabad",
  phones: ["+91 94901 26246", "+91 93924 46246"],
  whatsapp: "919490126246", // digits only, for wa.me link
  email: "office@rathodfoundation.in", // TODO: confirm real address
  siteUrl: "https://rathodfoundation.in",
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  photos: {
    heroPrimary: "/img/namaste-red.jpeg",
    heroSecondary: "/img/namaste-tricolor.jpeg",
    candid: "/img/candid.jpeg",
    withCM: "/img/with-cm.jpeg",
    biodata: "/img/biodata.jpeg",
  },
};

export const bio = {
  intro:
    "For more than two decades, Dhanraj Rathod has worked the streets of Banjara Hills — not from a desk, but lane by lane, household by household. Through years of grassroots service and community organising, his record is built on one habit: when a resident reports a problem, it gets fixed, and they get told when.",
  journey: [
    {
      year: "2000–2003",
      title: "City-wide community organiser, Hyderabad",
      detail:
        "Coordinated ward-level grievance drives across the old city and Banjara Hills.",
    },
    {
      year: "2006",
      title: "Citywide civic coordinator",
      detail:
        "Scaled up rapid-response campaigns on water, roads and sanitation.",
    },
    {
      year: "Present",
      title: "Convenor — Community & Tribal Welfare, Banjara Hills",
      detail:
        "Champions tribal & Lambadi welfare while running a 24-hour civic help desk for the ward.",
    },
    {
      year: "Ongoing",
      title: "President, Youth Welfare Association",
      detail: "Mobilises young volunteers for on-ground civic work.",
    },
  ],
  values: [
    { icon: "shield", title: "Accountable", text: "Every report gets a tracking number and a named owner." },
    { icon: "clock", title: "Fast", text: "First response within 24 hours — no exceptions." },
    { icon: "users", title: "For everyone", text: "Caste, creed or street — the queue is the same for all." },
  ],
};

export const chairman = {
  name: "Jeevan Raj Rathod",
  role: "Chairman — Rathod Foundation",
  title: "Social Activist & Student Leader",
  affiliation: "President, NSUI — Khairatabad District",
  location: "Banjara Hills & Khairatabad, Hyderabad, Telangana",
  bio: "Jeevan Raj Rathod is a student activist, social activist, and politician from Hyderabad, Telangana. Serving as President of the NSUI Khairatabad District unit, he champions student rights, youth engagement in democratic processes, and grassroots community welfare. Through the Rathod Foundation, he supports economically disadvantaged families, facilitates access to government welfare schemes, and promotes digitally enabled social service programs across the Banjara Hills and Khairatabad regions.",
  highlights: [
    "President, NSUI — Khairatabad District",
    "Student & youth advocate across Banjara Hills and Khairatabad",
    "Community relief drives, awareness campaigns & civic outreach",
    "Champion of increased youth participation in democratic processes",
  ],
  photo: "/img/chairman.jpeg", // TODO: add Jeevan Raj's photo to /public/img/
};

// 24-hour promise — scrolling strip
export const promises = [
  "First response within 24 hours",
  "A tracking number for every complaint",
  "A named person responsible for your issue",
  "Updates by call or WhatsApp",
  "No problem too small",
  "Open 7 days a week",
];

// ----------------------------------------------------------------------------
// SIX before / after cases. Replace `before`/`after` with real photo paths
// once available (drop them in /public/img and update the strings).
// ----------------------------------------------------------------------------
export type WorkCase = {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  days: number; // days to resolve
  before: string;
  after: string;
  summary: string;
};

export const cases: WorkCase[] = [
  {
    id: "rd12-drain",
    title: "Choked stormwater drain cleared",
    date: "Mar 2026",
    location: "Road No. 12, Banjara Hills",
    category: "Sanitation",
    days: 4,
    before: "before-after/drain-before.jpg", // TODO: add real photo
    after: "before-after/drain-after.jpg",
    summary:
      "A drain that flooded the lane every monsoon was de-silted and re-graded after 11 households reported it.",
  },
  {
    id: "nbnagar-light",
    title: "Dark stretch lit with new street lights",
    date: "Feb 2026",
    location: "N.B. Nagar, Banjara Hills",
    category: "Safety",
    days: 6,
    before: "before-after/light-before.jpg",
    after: "before-after/light-after.jpg",
    summary:
      "A 300-metre unlit stretch — a repeated safety complaint from women commuters — now has 14 working LED lights.",
  },
  {
    id: "rd10-road",
    title: "Crater-filled road re-laid",
    date: "Jan 2026",
    location: "Road No. 10, Banjara Hills",
    category: "Roads",
    days: 9,
    before: "before-after/road-before.jpg",
    after: "before-after/road-after.jpg",
    summary:
      "Potholes that damaged two-wheelers daily were patched and the carriageway resurfaced end to end.",
  },
  {
    id: "mla-water",
    title: "Drinking-water line restored",
    date: "Dec 2025",
    location: "MLA Colony, Banjara Hills",
    category: "Water",
    days: 3,
    before: "before-after/water-before.jpg",
    after: "before-after/water-after.jpg",
    summary:
      "A 5-day supply outage to 40 homes was traced to a burst feeder and repaired with the Water Board.",
  },
  {
    id: "park-revamp",
    title: "Neglected park brought back to life",
    date: "Nov 2025",
    location: "Journalist Colony, Banjara Hills",
    category: "Public space",
    days: 21,
    before: "before-after/park-before.jpg",
    after: "before-after/park-after.jpg",
    summary:
      "Overgrown and unsafe, the colony park was cleared, fenced and fitted with lights and benches for families.",
  },
  {
    id: "garbage-point",
    title: "Open garbage point shut & greened",
    date: "Oct 2025",
    location: "Road No. 14, Banjara Hills",
    category: "Sanitation",
    days: 7,
    before: "before-after/garbage-before.jpg",
    after: "before-after/garbage-after.jpg",
    summary:
      "A roadside dumping spot was cleared, a daily collection schedule set, and the corner planted with saplings.",
  },
];

// Ward / locality impact — bars fill on scroll. `count` = issues resolved.
export const wards = [
  { name: "Road No. 12", count: 86 },
  { name: "N.B. Nagar", count: 74 },
  { name: "Road No. 10", count: 61 },
  { name: "MLA Colony", count: 52 },
  { name: "Journalist Colony", count: 44 },
  { name: "Road No. 14", count: 38 },
  { name: "Shri Nagar Colony", count: 29 },
];

export const stats = [
  { value: 380, suffix: "+", label: "Issues resolved" },
  { value: 24, suffix: "h", label: "Response promise" },
  { value: 7, suffix: "", label: "Localities served" },
  { value: 20, suffix: "+ yrs", label: "On the ground" },
];

export const steps = [
  {
    n: "01",
    title: "Report it",
    text: "Use the form below, call, or send a WhatsApp message with a photo and the location.",
  },
  {
    n: "02",
    title: "Get a tracking number",
    text: "You instantly receive a reference ID and a named volunteer assigned to your case.",
  },
  {
    n: "03",
    title: "We act",
    text: "We verify on-site, coordinate with GHMC / Water Board / authorities, and push for a fix.",
  },
  {
    n: "04",
    title: "You're updated",
    text: "We confirm resolution by call or WhatsApp — and add it to the public work log.",
  },
];

export const categories = [
  "Roads & potholes",
  "Water supply",
  "Drainage & sewage",
  "Street lighting",
  "Garbage & sanitation",
  "Parks & public spaces",
  "Electricity",
  "Other",
];
