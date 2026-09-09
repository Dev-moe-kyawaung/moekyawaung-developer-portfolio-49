// ============================================================
// INTERSTELLAR WARP-DRIVE — Mission Log Data Layer
// ============================================================
const C = "https://res.cloudinary.com/dye5qpwii/image/upload";

export const captain = {
  name: "Moe Kyaw Aung",
  nameMM: "မိုးကျော်အောင်",
  designation: "CHIEF ENGINEER",
  callsign: "CMDR-MKA",
  ship: "USS KOTLIN",
  registry: "NCC-2026-A",
  role: "Senior Android Developer",
  sub: "Warp-Drive Engineer · Edge-AI Specialist",
  sector: "Sector 7-G · Myanmar-Thai Corridor",
  baseA: "Tachileik Base · 20.4517°N 99.8841°E",
  baseB: "Bangkok Station · 13.7563°N 100.5018°E",
  location: "Tachileik, Myanmar ↔ Bangkok, Thailand",
  tagline: "Engineering warp-core systems between Kotlin nebulae, Compose starfields and on-device AI singularities.",
  building: "MoekyawTranslator — an edge-AI translation vessel",
  philosophy: "Code with culture. Build with purpose.",
  directive: "Explore. Optimize. Ship at light speed.",
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
    "Warp-Drive Engineer",
    "Edge-AI Specialist",
    "Kotlin · Compose Pathfinder",
  ],
  stats: [
    { label: "STARDATE", value: 2026, suffix: "", sub: "Current Cycle" },
    { label: "MISSIONS", value: 16, suffix: "", sub: "Logged Operations" },
    { label: "CERTIFICATIONS", value: 82, suffix: "+", sub: "Starfleet Academy" },
    { label: "WORLDS", value: 40, suffix: "+", sub: "Charted Sectors" },
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
   MISSION LOGS — projects with orbital paths & metrics
------------------------------------------------------------ */
export type MissionLog = {
  id: string;
  title: string;
  logId: string;
  stardate: string;
  classification: "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "OMEGA";
  sector: string;
  year: string;
  color: string;
  icon: string;
  brief: string;
  img?: string;
  flagship?: boolean;
  href: string;
  metrics: { label: string; value: string }[];
  crew: string[];
  orbitalPath: string[];
  status: string;
};

export const missionLogs: MissionLog[] = [
  {
    id: "pulsesync", title: "PulseSync Platform", logId: "MSN-2026-001", stardate: "78234.5",
    classification: "OMEGA", sector: "SECTOR-P", year: "2026", color: "#4ef0ff",
    icon: "fa-solid fa-satellite-dish", flagship: true, img: captain.holoA,
    href: "https://github.com/Dev-moe-kyawaung/pulsesync-android",
    brief: "Flagship mission — multi-module Android vessel with real-time delta sync, offline-first matter containment and full CI/CD warp corridor.",
    metrics: [
      { label: "COLD BOOT", value: "<280ms" }, { label: "FRAME RATE", value: "60 FPS" },
      { label: "BUILD TIME", value: "-62%" }, { label: "CRASH-FREE", value: "99.98%" },
    ],
    crew: ["Kotlin", "Compose", "Room", "Firebase", "Hilt", "GitHub Actions"],
    orbitalPath: ["Compose Intent", "Sealed ViewState", "Domain UseCase", "Room SSOT", "Delta Sync Worker"],
    status: "MISSION ACCOMPLISHED",
  },
  {
    id: "translator", title: "MoekyawTranslator", logId: "MSN-2026-002", stardate: "78412.8",
    classification: "ALPHA", sector: "SECTOR-T", year: "2026", color: "#b77bff",
    icon: "fa-solid fa-language", flagship: true, img: captain.holoC,
    href: "https://github.com/Dev-moe-kyawaung/",
    brief: "Edge-AI translation vessel — INT8 TFLite neurons firing locally on ship NPU. No subspace signal required; zero data leaves the hull.",
    metrics: [
      { label: "INFERENCE", value: "32ms" }, { label: "MEMORY", value: "48 MB" },
      { label: "OFFLINE", value: "100%" }, { label: "DATA LEAK", value: "0 B" },
    ],
    crew: ["TFLite INT8", "Claude API", "NDK", "Compose", "Python"],
    orbitalPath: ["Audio/Camera In", "Tensor Buffer", "INT8 Interpreter", "Confidence Gate", "AR Overlay"],
    status: "IN ORBIT",
  },
  {
    id: "pos", title: "POS Ultimate Pro Max", logId: "MSN-2025-003", stardate: "77854.2",
    classification: "BETA", sector: "SECTOR-R", year: "2025", color: "#ffb84a",
    icon: "fa-solid fa-cash-register", flagship: true, img: captain.holoB,
    href: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max",
    brief: "Commercial depot — full point-of-sale with inventory ledgers, ACID transactional shields and thermal receipt dispatch.",
    metrics: [
      { label: "DISPATCH", value: "40ms" }, { label: "INVOICES", value: "100K+" },
      { label: "UPTIME", value: "99.95%" }, { label: "OFFLINE OPS", value: "FULL" },
    ],
    crew: ["Kotlin", "Room", "MVVM", "Bluetooth", "Coroutines"],
    orbitalPath: ["Barcode Input", "Ledger Domain", "ACID Transaction", "BT Print", "Cloud Sync"],
    status: "DEPOT OPERATIONAL",
  },
  {
    id: "social", title: "Social Dashboard", logId: "MSN-2025-004", stardate: "77612.9",
    classification: "GAMMA", sector: "SECTOR-S", year: "2025", color: "#5cff9d",
    icon: "fa-solid fa-chart-line",
    href: "https://github.com/moekyawaung-tech/social-dashboard",
    brief: "Navigating plasma streams — websocket data aggregated by worker drones before flushing to canvas rendering arrays.",
    metrics: [
      { label: "EVENTS/s", value: "15K" }, { label: "RENDER", value: "<12ms" }, { label: "FPS", value: "60" },
    ],
    crew: ["React", "Node", "WebSocket", "TypeScript"],
    orbitalPath: ["Ingestion", "Normalizer", "WS Pipe", "Worker Crew", "Canvas Array"],
    status: "STREAM STABILIZED",
  },
  {
    id: "job", title: "Job Portal", logId: "MSN-2025-005", stardate: "77488.3",
    classification: "GAMMA", sector: "SECTOR-J", year: "2025", color: "#ff4d6a",
    icon: "fa-solid fa-briefcase",
    href: "https://github.com/moekyawaung-tech/Job-Portal-App",
    brief: "Charting recruitment nebulae — RBAC shields, JWT rotation, parameterized search trajectories.",
    metrics: [
      { label: "SEARCH", value: "24ms" }, { label: "RBAC", value: "STRICT" }, { label: "UPTIME", value: "99.9%" },
    ],
    crew: ["React", "Express", "PostgreSQL", "JWT"],
    orbitalPath: ["Submission", "Sanitize", "PG Index", "RBAC Gate", "Dashboard"],
    status: "NEBULA CHARTED",
  },
  {
    id: "games", title: "Arcade Colony", logId: "MSN-2024-006", stardate: "76954.6",
    classification: "DELTA", sector: "SECTOR-G", year: "2024", color: "#b77bff",
    icon: "fa-solid fa-gamepad", img: captain.fireworks,
    href: "https://github.com/moekyawaung-tech/game-collection",
    brief: "Recreation asteroid — canvas games with object-pool particles, vector physics and chiptune around the warp-core.",
    metrics: [
      { label: "FPS", value: "60" }, { label: "PARTICLES", value: "5K" }, { label: "GC PAUSE", value: "0ms" },
    ],
    crew: ["Canvas", "WebGL", "Web Audio"],
    orbitalPath: ["Input Loop", "Fixed Physics", "Pooled Particles", "Canvas Blit"],
    status: "ASTEROID SECURED",
  },
  {
    id: "pwa", title: "PWA Mycelium", logId: "MSN-2024-007", stardate: "76821.4",
    classification: "DELTA", sector: "SECTOR-M", year: "2024", color: "#4ef0ff",
    icon: "fa-solid fa-compact-disc", img: captain.preview,
    href: "https://github.com/moekyawaung-tech/pwa-app",
    brief: "Survival shelter — Stale-While-Revalidate service workers with IndexedDB rations. Perfect 100 Lighthouse conditions.",
    metrics: [
      { label: "LIGHTHOUSE", value: "100" }, { label: "OFFLINE BOOT", value: "15ms" }, { label: "PAYLOAD", value: "120KB" },
    ],
    crew: ["Service Workers", "IndexedDB", "PWA"],
    orbitalPath: ["Request", "SW Intercept", "Cache-First", "BG Fetch", "Notify"],
    status: "SHELTER SECURED",
  },
  {
    id: "video", title: "Reelplay", logId: "MSN-2024-008", stardate: "76698.1",
    classification: "DELTA", sector: "SECTOR-V", year: "2024", color: "#ffb84a",
    icon: "fa-solid fa-video",
    href: "https://github.com/moekyawaung-tech/video-player",
    brief: "Media supply run — ExoPlayer hardware rendering with adaptive bitrate portage and gesture-driven scrub navigation.",
    metrics: [
      { label: "BUFFER", value: "120ms" }, { label: "MAX RES", value: "4K" }, { label: "CPU", value: "<4%" },
    ],
    crew: ["ExoPlayer", "Media3", "Kotlin"],
    orbitalPath: ["HLS Source", "HW Decoder", "Track Select", "Surface Render"],
    status: "CARGO DELIVERED",
  },
];

/* ------------------------------------------------------------
   SKILL MODULES — ship systems proficiency
------------------------------------------------------------ */
export const skillModules = [
  { id: "M1", name: "Kotlin / Android Core", pct: 98, color: "#4ef0ff", spec: "Compose · M3 · Coroutines", note: "PRIMARY WEAPONS" },
  { id: "M2", name: "Clean Architecture", pct: 95, color: "#b77bff", spec: "MVVM · MVI · 12 modules", note: "STRUCTURAL INTEGRITY" },
  { id: "M3", name: "On-Device AI", pct: 88, color: "#ffb84a", spec: "TFLite INT8 · Claude API", note: "SENSOR ARRAY" },
  { id: "M4", name: "Backend / Firebase", pct: 90, color: "#5cff9d", spec: "Firestore · Retrofit · REST", note: "SUBSPACE LINKS" },
  { id: "M5", name: "Security / DevOps", pct: 91, color: "#ff4d6a", spec: "Keystore TEE · CI Actions", note: "DEFLECTOR SHIELDS" },
  { id: "M6", name: "Web / TypeScript", pct: 84, color: "#4ef0ff", spec: "React · TS · PWA", note: "AUXILIARY SYSTEMS" },
];

/* ------------------------------------------------------------
   STARDATE LOG — career timeline
------------------------------------------------------------ */
export const stardateLog = [
  { yr: "2023", sd: "SD-01", phase: "COMMISSIONING", title: "USS Kotlin launched", desc: "First hull plates laid down. JavaScript and Python subsystems brought online.", color: "#ff4d6a", coords: "20.45°N 99.88°E" },
  { yr: "2024", sd: "SD-02", phase: "STARFLEET ACADEMY", title: "82+ certifications earned", desc: "Nine specialized modules completed — languages, web, mobile, data, AI, security, chains, systems, business.", color: "#4ef0ff", coords: "21.16°N 99.58°E" },
  { yr: "2025", sd: "SD-03", phase: "WARP-DRIVE INSTALLED", title: "Senior altitude achieved", desc: "Kotlin, Compose and Clean Architecture mastered at warp speed. Google Launchpad upgrade. POS depot operational.", color: "#b77bff", coords: "16.84°N 96.17°E" },
  { yr: "2026", sd: "SD-04", phase: "DEEP SPACE MISSION", title: "Edge-AI frontier expedition", desc: "MoekyawTranslator and PulseSync — private edge intelligence beyond known subspace. Mission ongoing.", color: "#ffb84a", coords: "13.75°N 100.50°E" },
];

export const certifications = [
  { name: "Languages", count: 13, icon: "fa-solid fa-code", color: "#4ef0ff" },
  { name: "Web", count: 13, icon: "fa-solid fa-globe", color: "#b77bff" },
  { name: "Mobile", count: 7, icon: "fa-solid fa-mobile-screen", color: "#ffb84a" },
  { name: "Databases", count: 6, icon: "fa-solid fa-database", color: "#5cff9d" },
  { name: "AI & Data", count: 11, icon: "fa-solid fa-brain", color: "#ff4d6a" },
  { name: "Security", count: 10, icon: "fa-solid fa-shield-halved", color: "#4ef0ff" },
  { name: "Blockchain", count: 4, icon: "fa-solid fa-link", color: "#b77bff" },
  { name: "Systems", count: 7, icon: "fa-solid fa-layer-group", color: "#ffb84a" },
  { name: "Business", count: 11, icon: "fa-solid fa-chart-line", color: "#5cff9d" },
];

export const tapeItems = [
  "KOTLIN", "JETPACK COMPOSE", "CLEAN ARCHITECTURE", "MVVM", "TFLITE INT8",
  "FIREBASE", "COROUTINES", "ROOM", "MATERIAL 3", "CLAUDE API",
  "GITHUB ACTIONS", "REST APIS", "PYTHON", "CI/CD", "EXOPLAYER", "REACT",
];
