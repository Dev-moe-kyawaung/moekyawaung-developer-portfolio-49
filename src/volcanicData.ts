// ============================================================
// VOLCANIC CORE TECH — Geological Data Layer
// ============================================================

const C = "https://res.cloudinary.com/dye5qpwii/image/upload";

export const profile = {
  name: "Moe Kyaw Aung",
  nameMM: "မိုးကျော်အောင်",
  role: "Senior Android Developer",
  location: "Tachileik, Myanmar ↔ Bangkok, Thailand",
  philosophy: "Code with culture. Build with purpose.",
  tagline: "Forging high-performance Android tectonics — Kotlin bedrock, Compose magma, Clean Architecture strata, and on-device AI magma chambers.",
  building: "MoekyawTranslator — a private on-device AI translation eruption",
  roles: [
    "Senior Android Developer",
    "Volcanic Systems Architect",
    "On-Device AI Engineer",
    "Kotlin · Compose Tectonician",
  ],
  email: "moekyawaung2026@gmail.com",
  phone: "+95 9 889 000 889",
  phone2: "+959 666 000 050",
  github: "https://github.com/Dev-moe-kyawaung/",
  gravatar: "https://gravatar.com/moekyawaung2026",
  portrait: `${C}/v1778763535/MKA_25_lbx6fb.webp`,
  portrait2: `${C}/v1778763531/MKA_12_iv8kpm.webp`,
  portrait3: `${C}/v1778763531/MKA_3_zqrhhr.webp`,
  holoA: `${C}/v1778795856/copilot_image_1778795675037_heh9xk.png`,
  holoB: `${C}/v1778795856/copilot_image_1778794626112_ega7kk.png`,
  holoC: `${C}/v1778795859/copilot_image_1778794430377_n7xlmz.png`,
  preview: `${C}/v1778795822/preview_dzhqvv.webp`,
  fireworks: `${C}/v1779052645/2153-fireworks-composer_gm3e0h.jpg`,
  shot20: `${C}/v1778795799/2024119_20_b94fen.jpg`,
  stats: [
    { label: "THERMAL TAPS", value: 82, suffix: "+", sub: "Certifications" },
    { label: "MAGMA CORES", value: 16, suffix: "", sub: "Shipped Apps" },
    { label: "TECTONIC PLATES", value: 40, suffix: "+", sub: "GitHub Worlds" },
    { label: "ERUPTION CYCLES", value: 3, suffix: "+", sub: "Senior Years" },
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

// VOLCANIC CORES — PROJECTS
export type VolcanicCore = {
  id: string;
  name: string;
  coreId: string;
  tempC: number;     // Internal temperature
  pressurePsi: number;
  year: string;
  category: "TECTONIC" | "MAGMA" | "GEOTHERMAL" | "VOLCANIC";
  glowColor: string;
  tags: string[];
  desc: string;
  img?: string;
  flagship?: boolean;
  href: string;
  ejectionType: string;
};

export const volcanicCores: VolcanicCore[] = [
  { id: "pulse", name: "PulseSync Platform", coreId: "VC-2026-001", tempC: 4280, pressurePsi: 340, year: "2026", category: "TECTONIC", glowColor: "#ff6b1a", tags: ["Kotlin","Firebase","CI/CD","Multi-module"], desc: "Multi-module Android platform — real-time delta sync, offline-first Room bedrock, full CI/CD magma circulation.", img: profile.holoA, flagship: true, href: "https://github.com/Dev-moe-kyawaung/pulsesync-android", ejectionType: "PYROCLASTIC" },
  { id: "translator", name: "MoekyawTranslator", coreId: "VC-2026-002", tempC: 3860, pressurePsi: 290, year: "2026", category: "MAGMA", glowColor: "#ffd166", tags: ["TFLite","Claude API","Compose"], desc: "Private on-device translation eruption — INT8 TFLite compressed magma running on local NPU strata.", img: profile.holoC, flagship: true, href: "https://github.com/Dev-moe-kyawaung/", ejectionType: "EFFUSIVE" },
  { id: "pos", name: "POS Ultimate Pro Max", coreId: "VC-2025-003", tempC: 3620, pressurePsi: 260, year: "2025", category: "TECTONIC", glowColor: "#ff6b1a", tags: ["Kotlin","Room","MVVM","Bluetooth"], desc: "Full point-of-sale magma chamber — inventory pumice, invoicing pyroclasts, thermal receipt dispatch.", img: profile.holoB, flagship: true, href: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max", ejectionType: "PLINIAN" },
  { id: "social", name: "Social Dashboard Bloom", coreId: "VC-2025-004", tempC: 2980, pressurePsi: 180, year: "2025", category: "GEOTHERMAL", glowColor: "#ef4444", tags: ["React","Node","WebSocket"], desc: "Real-time analytics volcanic bloom — live social telemetry, audience seismograph, engagement fumaroles.", href: "https://github.com/moekyawaung-tech/social-dashboard", ejectionType: "STROMBOLIAN" },
  { id: "job", name: "Job Portal Eruption", coreId: "VC-2025-005", tempC: 2750, pressurePsi: 165, year: "2025", category: "TECTONIC", glowColor: "#ff6b1a", tags: ["Full-stack","Auth","PostgreSQL"], desc: "Hiring magma flow — candidate search geysers, recruiter thermal streams, role-based fault lines.", href: "https://github.com/moekyawaung-tech/Job-Portal-App", ejectionType: "HAWAIIAN" },
  { id: "games", name: "Arcade Pyroclastic Flow", coreId: "VC-2024-006", tempC: 2340, pressurePsi: 140, year: "2024", category: "VOLCANIC", glowColor: "#ffd166", tags: ["Canvas","Physics","Particles"], desc: "Game volcanic island — snake lava trails, physics cinder fields, particle eruptions.", img: profile.fireworks, href: "https://github.com/moekyawaung-tech/game-collection", ejectionType: "VULCANIAN" },
  { id: "pwa", name: "PWA Obsidian Shell", coreId: "VC-2024-007", tempC: 2120, pressurePsi: 125, year: "2024", category: "GEOTHERMAL", glowColor: "#ef4444", tags: ["PWA","Service Workers","Offline"], desc: "Offline-first obsidian web shell — installable magma casing, background geothermal sync.", img: profile.preview, href: "https://github.com/moekyawaung-tech/pwa-app", ejectionType: "EFFUSIVE" },
  { id: "music", name: "Seismic Plankton FM", coreId: "VC-2024-008", tempC: 1980, pressurePsi: 110, year: "2024", category: "VOLCANIC", glowColor: "#ff6b1a", tags: ["Audio","Visualizer","WebGL"], desc: "Media deck with tectonic waveform visualization — gapless seismic playback.", href: "https://github.com/moekyawaung-tech/video-player", ejectionType: "STROMBOLIAN" },
  { id: "weather", name: "Tectonic Weather Atlas", coreId: "VC-2024-009", tempC: 1840, pressurePsi: 98, year: "2024", category: "GEOTHERMAL", glowColor: "#ffd166", tags: ["Geo","Radar","Forecast"], desc: "Weather magma atlas — pressure gradient mapping, thermal front tracking, eruption forecasts.", href: "https://github.com/moekyawaung-tech/Weather-app", ejectionType: "HAWAIIAN" },
  { id: "chat", name: "Proto-Chat Vent", coreId: "VC-2024-010", tempC: 2080, pressurePsi: 120, year: "2024", category: "VOLCANIC", glowColor: "#ef4444", tags: ["Firebase","Realtime","E2E"], desc: "Realtime messaging volcanic vent — presence fumaroles, typing steam, encrypted magma.", href: "https://github.com/moekyawaung-tech/", ejectionType: "VULCANIAN" },
  { id: "video", name: "Reelplay Cinder Core", coreId: "VC-2024-011", tempC: 1920, pressurePsi: 105, year: "2024", category: "TECTONIC", glowColor: "#ff6b1a", tags: ["ExoPlayer","Media3","Cache"], desc: "Adaptive video cinder core — ExoPlayer magma substrate, subtitle fumaroles, offline obsidian.", href: "https://github.com/moekyawaung-tech/video-player", ejectionType: "EFFUSIVE" },
  { id: "todo", name: "DO_THIS Ignition Point", coreId: "VC-2023-012", tempC: 1240, pressurePsi: 68, year: "2023", category: "GEOTHERMAL", glowColor: "#ffd166", tags: ["Vanilla JS","Tests"], desc: "The first ignition — a clean, tested todo magma where the eruption timeline begins.", href: "https://github.com/moekyawaung-tech/javascript-todo", ejectionType: "HAWAIIAN" },
];

// HEAT ZONES — SKILLS
export type HeatZone = {
  zoneId: string;
  name: string;
  coreTemp: number;
  pressurePsi: number;
  mantleDepth: string;
  magmaComposition: string;
  thermalSignature: string;
  color: string;
  skills: string[];
};

export const heatZones: HeatZone[] = [
  {
    zoneId: "MANTLE.01", name: "Kotlin & Android Core", coreTemp: 4820, pressurePsi: 450,
    mantleDepth: "99% Viscosity Control", magmaComposition: "Kotlin 2.0 · Jetpack Compose · Material 3",
    thermalSignature: "60fps Glass Transition", color: "#ff6b1a",
    skills: ["Kotlin 2.0","Jetpack Compose","Material 3","Room DB","Paging","Coroutines"]
  },
  {
    zoneId: "MANTLE.02", name: "Clean Architecture Strata", coreTemp: 4560, pressurePsi: 420,
    mantleDepth: "95% Decoupling Factor", magmaComposition: "Clean Arch · MVVM · MVI · Multi-module",
    thermalSignature: "12 Isolated Tectonic Plates", color: "#ffd166",
    skills: ["Clean Architecture","MVVM","MVI","Multi-module","Domain Layer","Sealed States"]
  },
  {
    zoneId: "MANTLE.03", name: "On-Device AI Magma", coreTemp: 3860, pressurePsi: 340,
    mantleDepth: "32ms Inference Eruption", magmaComposition: "TFLite INT8 · Claude API · Python",
    thermalSignature: "Private Edge Computation", color: "#ef4444",
    skills: ["TFLite INT8","Claude API","TensorFlow","On-Device ML","Python","Edge AI"]
  },
  {
    zoneId: "MANTLE.04", name: "Backend & Cloud Thermal", coreTemp: 3420, pressurePsi: 310,
    mantleDepth: "90% Uptime Guarantee", magmaComposition: "Firebase · Retrofit · REST APIs",
    thermalSignature: "Zero Latency Sync", color: "#38bdf8",
    skills: ["Firebase","Retrofit","REST APIs","Room Sync","WorkManager","OkHttp"]
  },
  {
    zoneId: "MANTLE.05", name: "Security Obsidian Shield", coreTemp: 3240, pressurePsi: 295,
    mantleDepth: "AES-256 TEE Enclave", magmaComposition: "Ethical Hacking · CI/CD · Linux",
    thermalSignature: "Hardware Keystore Fortress", color: "#ff6b1a",
    skills: ["Ethical Hacking","Android Keystore","CI/CD","GitHub Actions","Linux","Kali"]
  },
  {
    zoneId: "MANTLE.06", name: "Frontend Basalt Layer", coreTemp: 2980, pressurePsi: 260,
    mantleDepth: "84% Cross-Platform Flux", magmaComposition: "React · TypeScript · Tailwind · PWA",
    thermalSignature: "Lighthouse 100 + Progressive", color: "#ffd166",
    skills: ["React","TypeScript","Tailwind","PWA","Node.js","Service Workers"]
  },
];

// ERUPTION TIMELINE
export const eruptions = [
  { yr: "2023", phase: "THERMAL IGNITION", title: "First eruption", desc: "First magma touches the surface — JavaScript spores, Python ignitions, mobile UI protolith. The caldera awakens.", color: "#ef4444", icon: "fa-solid fa-volcano" },
  { yr: "2024", phase: "PYROCLASTIC CASCADE", title: "82+ thermal taps crystallize", desc: "A relentless 9-domain cascade of 82+ certified credentials — C to compilers, AI to cybersecurity. First bloom on Jul 4, 2024.", color: "#ff6b1a", icon: "fa-solid fa-certificate" },
  { yr: "2025", phase: "TECTONIC CONSOLIDATION", title: "Senior magma specialization", desc: "Deep Kotlin/Compose specialization, Clean Architecture crystallization, Google Launchpad acceleration. POS Pro Max reef shipped.", color: "#ffd166", icon: "fa-solid fa-mountain" },
  { yr: "2026", phase: "CALDERA FRONTIER", title: "On-device AI eruption", desc: "MoekyawTranslator INT8 magma and PulseSync multi-module platform. Full CI/CD geothermal pipelines. The caldera erupts.", color: "#38bdf8", icon: "fa-solid fa-rocket" },
];

// CERTIFICATE GEOTHERMAL WINGS
export const certWings = [
  { name: "Programming", count: 13, icon: "fa-solid fa-code", color: "#ff6b1a" },
  { name: "Web Dev", count: 13, icon: "fa-solid fa-globe", color: "#ffd166" },
  { name: "Mobile", count: 7, icon: "fa-solid fa-mobile-screen", color: "#ef4444" },
  { name: "Databases", count: 6, icon: "fa-solid fa-database", color: "#38bdf8" },
  { name: "AI & Data", count: 11, icon: "fa-solid fa-brain", color: "#ff6b1a" },
  { name: "Security", count: 10, icon: "fa-solid fa-shield-halved", color: "#ffd166" },
  { name: "Blockchain", count: 4, icon: "fa-solid fa-link", color: "#ef4444" },
  { name: "Systems", count: 7, icon: "fa-solid fa-layer-group", color: "#38bdf8" },
  { name: "Business", count: 11, icon: "fa-solid fa-chart-line", color: "#ff6b1a" },
];

export const tapeItems = [
  "KOTLIN 2.0","JETPACK COMPOSE","CLEAN ARCHITECTURE","MVVM","MVI","FIREBASE",
  "COROUTINES","TFLITE INT8","ROOM DB","MATERIAL 3","CLAUDE API","ETHICAL HACKING",
  "GITHUB ACTIONS","REST APIS","PYTHON","CI/CD","REACT 19","EXOPLAYER",
];