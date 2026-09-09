// ============================================================
// CYBER-NOMAD EXPLORER — Expedition Data Layer
// ============================================================
const C = "https://res.cloudinary.com/dye5qpwii/image/upload";

export const nomad = {
  name: "Moe Kyaw Aung",
  nameMM: "မိုးကျော်အောင်",
  callsign: "NOMAD-MKA",
  role: "Senior Android Developer",
  sub: "Digital Explorer · On-Device AI Engineer",
  baseA: "Tachileik, Myanmar · 20.4517°N 99.8841°E",
  baseB: "Bangkok, Thailand · 13.7563°N 100.5018°E",
  location: "Tachileik, Myanmar ↔ Bangkok, Thailand",
  tagline: "Charting unmapped territory between Kotlin bedrock, Compose canopy, and on-device AI summits.",
  building: "MoekyawTranslator — an off-grid AI translation expedition",
  philosophy: "Code with culture. Build with purpose.",
  email: "moekyawaung2026@gmail.com",
  phone: "+95 9 889 000 889",
  github: "https://github.com/Dev-moe-kyawaung/",
  portrait: `${C}/v1778527878/IMG_20260430_053105_uef0yr.png`,
  portrait2: `${C}/v1778763531/MKA_12_iv8kpm.webp`,
  holoA: `${C}/v1778795856/copilot_image_1778795675037_heh9xk.png`,
  holoB: `${C}/v1778795856/copilot_image_1778794626112_ega7kk.png`,
  holoC: `${C}/v1778795859/copilot_image_1778794430377_n7xlmz.png`,
  preview: `${C}/v1778795822/preview_dzhqvv.webp`,
  fireworks: `${C}/v1779052645/2153-fireworks-composer_gm3e0h.jpg`,
  roles: [
    "Senior Android Developer",
    "Cyber-Nomad Explorer",
    "On-Device AI Cartographer",
    "Kotlin · Compose Pathfinder",
  ],
  stats: [
    { label: "WAYPOINTS", value: 82, suffix: "+", sub: "Certificates" },
    { label: "EXPEDITIONS", value: 16, suffix: "", sub: "Shipped Apps" },
    { label: "TERRITORIES", value: 40, suffix: "+", sub: "GitHub Worlds" },
    { label: "SEASONS", value: 3, suffix: "+", sub: "Years Trekking" },
  ],
  socials: [
    { name: "GitHub", icon: "fa-brands fa-github", href: "https://github.com/Dev-moe-kyawaung/" },
    { name: "LinkedIn", icon: "fa-brands fa-linkedin-in", href: "https://www.linkedin.com/in/moe-kyaw-aung-2653093a1" },
    { name: "YouTube", icon: "fa-brands fa-youtube", href: "https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG" },
    { name: "Bluesky", icon: "fa-solid fa-cloud", href: "https://bsky.app/profile/moekyawaung96.bsky.social" },
    { name: "Flickr", icon: "fa-brands fa-flickr", href: "https://www.flickr.com/people/204037451@N06" },
    { name: "Vimeo", icon: "fa-brands fa-vimeo-v", href: "https://vimeo.com/user252414232" },
    { name: "Tumblr", icon: "fa-brands fa-tumblr", href: "https://www.tumblr.com/moekyawaung" },
    { name: "Gravatar", icon: "fa-solid fa-circle-user", href: "https://gravatar.com/moekyawaung2026" },
  ],
};

/* ------------------------------------------------------------
   EXPEDITION LOGS — projects with coordinates & field metrics
------------------------------------------------------------ */
export type Expedition = {
  id: string;
  name: string;
  logId: string;
  coords: string;
  terrain: "SUMMIT" | "RIDGE" | "CANOPY" | "RIVER" | "BASECAMP";
  year: string;
  color: string;
  icon: string;
  brief: string;
  img?: string;
  flagship?: boolean;
  href: string;
  metrics: { label: string; value: string }[];
  gear: string[];
  route: string[];
  status: string;
};

export const expeditions: Expedition[] = [
  {
    id: "pulsesync", name: "PulseSync Platform", logId: "EXP-2026-001",
    coords: "21.1619°N 99.5804°E", terrain: "SUMMIT", year: "2026", color: "#ffb347",
    icon: "fa-solid fa-satellite-dish", flagship: true, img: nomad.holoA,
    href: "https://github.com/Dev-moe-kyawaung/pulsesync-android",
    brief: "Highest-altitude climb yet — a multi-module Android platform with realtime delta sync, offline-first Room bedrock and full CI/CD supply lines.",
    metrics: [
      { label: "COLD START", value: "<280ms" }, { label: "FRAME RATE", value: "60 FPS" },
      { label: "BUILD CUT", value: "-62%" }, { label: "CRASH FREE", value: "99.98%" },
    ],
    gear: ["Kotlin", "Compose", "Room", "Firebase", "Hilt", "GitHub Actions"],
    route: ["Compose Intent", "Sealed ViewState", "Domain UseCase", "Room SSOT", "Delta Sync Worker"],
    status: "SUMMIT REACHED",
  },
  {
    id: "translator", name: "MoekyawTranslator", logId: "EXP-2026-002",
    coords: "20.4517°N 99.8841°E", terrain: "RIDGE", year: "2026", color: "#8fd460",
    icon: "fa-solid fa-language", flagship: true, img: nomad.holoC,
    href: "https://github.com/Dev-moe-kyawaung/",
    brief: "Off-grid AI expedition — INT8 TFLite neurons firing entirely on-device. No signal required, no data leaves the pack.",
    metrics: [
      { label: "INFERENCE", value: "32ms" }, { label: "RAM PACK", value: "48 MB" },
      { label: "OFFLINE", value: "100%" }, { label: "DATA LEAK", value: "0 B" },
    ],
    gear: ["TFLite INT8", "Claude API", "NDK", "Compose", "Python"],
    route: ["Camera/Audio In", "Tensor Buffer", "INT8 Interpreter", "Confidence Gate", "AR Overlay"],
    status: "ACTIVE TRAVERSE",
  },
  {
    id: "pos", name: "POS Ultimate Pro Max", logId: "EXP-2025-003",
    coords: "13.7563°N 100.5018°E", terrain: "BASECAMP", year: "2025", color: "#ffd58a",
    icon: "fa-solid fa-cash-register", flagship: true, img: nomad.holoB,
    href: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max",
    brief: "Supply-depot engineering — full point-of-sale with inventory ledgers, ACID transactions and thermal printer dispatch under retail rush.",
    metrics: [
      { label: "DISPATCH", value: "40ms" }, { label: "INVOICES", value: "100K+" },
      { label: "UPTIME", value: "99.95%" }, { label: "OFFLINE OPS", value: "FULL" },
    ],
    gear: ["Kotlin", "Room", "MVVM", "Bluetooth", "Coroutines"],
    route: ["Barcode Input", "Ledger Domain", "ACID Transaction", "BT Print", "Cloud Sync"],
    status: "DEPOT OPERATIONAL",
  },
  {
    id: "social", name: "Social Dashboard", logId: "EXP-2025-004",
    coords: "13.7469°N 100.5350°E", terrain: "RIVER", year: "2025", color: "#5fd4d0",
    icon: "fa-solid fa-chart-line",
    href: "https://github.com/moekyawaung-tech/social-dashboard",
    brief: "Navigating live data rapids — websocket streams aggregated by worker crews before flushing to canvas rendering rafts.",
    metrics: [
      { label: "EVENTS/s", value: "15K" }, { label: "RENDER", value: "<12ms" }, { label: "FPS", value: "60" },
    ],
    gear: ["React", "Node", "WebSocket", "TypeScript"],
    route: ["Ingestion", "Normalizer", "WS Pipe", "Worker Crew", "Canvas Raft"],
    status: "RAPIDS CLEARED",
  },
  {
    id: "job", name: "Job Portal", logId: "EXP-2025-005",
    coords: "16.8409°N 96.1735°E", terrain: "CANOPY", year: "2025", color: "#ff6b4a",
    icon: "fa-solid fa-briefcase",
    href: "https://github.com/moekyawaung-tech/Job-Portal-App",
    brief: "Cutting trails through recruitment jungle — RBAC gateways, JWT rotation and parameterized search paths.",
    metrics: [
      { label: "SEARCH", value: "24ms" }, { label: "RBAC", value: "STRICT" }, { label: "UPTIME", value: "99.9%" },
    ],
    gear: ["React", "Express", "PostgreSQL", "JWT"],
    route: ["Submission", "Sanitize", "PG Index", "RBAC Gate", "Dashboard"],
    status: "TRAIL MARKED",
  },
  {
    id: "games", name: "Arcade Colony", logId: "EXP-2024-006",
    coords: "19.7633°N 96.0785°E", terrain: "CANOPY", year: "2024", color: "#8fd460",
    icon: "fa-solid fa-gamepad", img: nomad.fireworks,
    href: "https://github.com/moekyawaung-tech/game-collection",
    brief: "Recreation outpost — canvas games with object-pool particles, vector physics and synthesized chiptune around the campfire.",
    metrics: [
      { label: "FPS", value: "60" }, { label: "PARTICLES", value: "5K" }, { label: "GC PAUSE", value: "0ms" },
    ],
    gear: ["Canvas", "WebGL", "Web Audio"],
    route: ["Input Loop", "Fixed Physics", "Pooled Particles", "Canvas Blit"],
    status: "OUTPOST BUILT",
  },
  {
    id: "pwa", name: "PWA Mycelium", logId: "EXP-2024-007",
    coords: "21.9588°N 96.0891°E", terrain: "RIDGE", year: "2024", color: "#5fd4d0",
    icon: "fa-solid fa-compact-disc", img: nomad.preview,
    href: "https://github.com/moekyawaung-tech/pwa-app",
    brief: "Cache-first survival shelter — Stale-While-Revalidate service workers with IndexedDB rations. Perfect 100 Lighthouse conditions.",
    metrics: [
      { label: "LIGHTHOUSE", value: "100" }, { label: "OFFLINE BOOT", value: "15ms" }, { label: "PAYLOAD", value: "120KB" },
    ],
    gear: ["Service Workers", "IndexedDB", "PWA"],
    route: ["Request", "SW Intercept", "Cache-First", "BG Fetch", "Notify"],
    status: "SHELTER SECURED",
  },
  {
    id: "video", name: "Reelplay", logId: "EXP-2024-008",
    coords: "18.7883°N 98.9853°E", terrain: "RIVER", year: "2024", color: "#ffb347",
    icon: "fa-solid fa-video",
    href: "https://github.com/moekyawaung-tech/video-player",
    brief: "Media supply run — ExoPlayer hardware rendering with adaptive bitrate portage and gesture-driven scrub navigation.",
    metrics: [
      { label: "BUFFER", value: "120ms" }, { label: "MAX RES", value: "4K" }, { label: "CPU", value: "<4%" },
    ],
    gear: ["ExoPlayer", "Media3", "Kotlin"],
    route: ["HLS Source", "HW Decoder", "Track Select", "Surface Render"],
    status: "CARGO DELIVERED",
  },
];

/* ------------------------------------------------------------
   FIELD SKILLS — gear proficiency
------------------------------------------------------------ */
export const gearSkills = [
  { id: "G1", name: "Kotlin / Android Core", pct: 98, color: "#ffb347", spec: "Compose · M3 · Coroutines", note: "primary machete" },
  { id: "G2", name: "Clean Architecture", pct: 95, color: "#8fd460", spec: "MVVM · MVI · 12 modules", note: "structural rigging" },
  { id: "G3", name: "On-Device AI", pct: 88, color: "#5fd4d0", spec: "TFLite INT8 · Claude API", note: "off-grid intelligence" },
  { id: "G4", name: "Backend / Firebase", pct: 90, color: "#ffd58a", spec: "Firestore · Retrofit · REST", note: "supply lines" },
  { id: "G5", name: "Security / DevOps", pct: 91, color: "#ff6b4a", spec: "Keystore TEE · CI Actions", note: "perimeter defense" },
  { id: "G6", name: "Web / TypeScript", pct: 84, color: "#8fd460", spec: "React · TS · PWA", note: "river crossing" },
];

/* ------------------------------------------------------------
   JOURNEY WAYPOINTS — the trek 2023 → 2026
------------------------------------------------------------ */
export const waypoints = [
  { yr: "2023", wp: "WP-01", phase: "FIRST FOOTPRINTS", title: "Departure from basecamp", desc: "First trails cut through JavaScript underbrush and Python foothills. The map begins.", color: "#ff6b4a", coords: "20.45°N 99.88°E" },
  { yr: "2024", wp: "WP-02", phase: "SUPPLY CACHE", title: "82+ waypoints certified", desc: "Nine territories charted — languages, web, mobile, data, AI, security, chains, systems, business. First cache logged Jul 4.", color: "#5fd4d0", coords: "21.16°N 99.58°E" },
  { yr: "2025", wp: "WP-03", phase: "HIGH CAMP", title: "Senior altitude gained", desc: "Kotlin, Compose and Clean Architecture mastered at altitude. Google Launchpad resupply. POS Pro Max depot built.", color: "#8fd460", coords: "16.84°N 96.17°E" },
  { yr: "2026", wp: "WP-04", phase: "UNMAPPED TERRITORY", title: "The AI frontier trek", desc: "MoekyawTranslator and PulseSync — private edge intelligence beyond the mapped grid. Expedition ongoing.", color: "#ffb347", coords: "13.75°N 100.50°E" },
];

export const certTerritories = [
  { name: "Languages", count: 13, icon: "fa-solid fa-code", color: "#ffb347" },
  { name: "Web", count: 13, icon: "fa-solid fa-globe", color: "#8fd460" },
  { name: "Mobile", count: 7, icon: "fa-solid fa-mobile-screen", color: "#5fd4d0" },
  { name: "Databases", count: 6, icon: "fa-solid fa-database", color: "#ffd58a" },
  { name: "AI & Data", count: 11, icon: "fa-solid fa-brain", color: "#ff6b4a" },
  { name: "Security", count: 10, icon: "fa-solid fa-shield-halved", color: "#ffb347" },
  { name: "Blockchain", count: 4, icon: "fa-solid fa-link", color: "#8fd460" },
  { name: "Systems", count: 7, icon: "fa-solid fa-layer-group", color: "#5fd4d0" },
  { name: "Business", count: 11, icon: "fa-solid fa-chart-line", color: "#ffd58a" },
];

export const tapeItems = [
  "KOTLIN", "JETPACK COMPOSE", "CLEAN ARCHITECTURE", "MVVM", "TFLITE INT8",
  "FIREBASE", "COROUTINES", "ROOM", "MATERIAL 3", "CLAUDE API",
  "GITHUB ACTIONS", "REST APIS", "PYTHON", "CI/CD", "EXOPLAYER", "REACT",
];
