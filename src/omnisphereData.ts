const C = "https://res.cloudinary.com/dye5qpwii/image/upload";

export const profile = {
  name: "Moe Kyaw Aung",
  role: "Senior Android Developer",
  sub: "On-Device AI · Architecture Systems",
  location: "Tachileik, Myanmar ↔ Bangkok, Thailand",
  tagline: "Architecting mobile systems at the intersection of Clean Architecture, on-device ML, and real-time platforms.",
  building: "MoekyawTranslator — private edge-AI translation",
  philosophy: "Code with culture. Build with purpose.",
  email: "moekyawaung2026@gmail.com",
  phone: "+95 9 889 000 889",
  github: "https://github.com/Dev-moe-kyawaung/",
  portrait: `${C}/v1778763535/MKA_25_lbx6fb.webp`,
  portrait2: `${C}/v1778763531/MKA_12_iv8kpm.webp`,
  holoA: `${C}/v1778795856/copilot_image_1778795675037_heh9xk.png`,
  holoB: `${C}/v1778795856/copilot_image_1778794626112_ega7kk.png`,
  holoC: `${C}/v1778795859/copilot_image_1778794430377_n7xlmz.png`,
  preview: `${C}/v1778795822/preview_dzhqvv.webp`,
  fireworks: `${C}/v1779052645/2153-fireworks-composer_gm3e0h.jpg`,
  roles: [
    "Senior Android Developer",
    "On-Device AI Engineer",
    "Multi-Module Architecture Systems Designer",
    "Kotlin · Jetpack Compose Specialist",
  ],
  stats: [
    { label: "NODES", value: 82, suffix: "+", sub: "Certificates" },
    { label: "SPHERES", value: 16, suffix: "", sub: "Shipped Apps" },
    { label: "ORBITS", value: 40, suffix: "+", sub: "GitHub Worlds" },
    { label: "CYCLES", value: 3, suffix: "+", sub: "Senior Years" },
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

export type HoloNode = {
  id: string;
  name: string;
  code: string;
  sector: string;
  year: string;
  color: string;
  icon: string;
  summary: string;
  img?: string;
  flagship?: boolean;
  href: string;
  orbit: number; // 0..1 position on sphere surface
  // multi-layer case study
  layers: {
    architecture: string;
    dataFlow: string[];
    metrics: { label: string; value: string }[];
    stack: string[];
  };
};

export const holoNodes: HoloNode[] = [
  {
    id: "pulsesync", name: "PulseSync", code: "ORB-2026-01", sector: "REALTIME MOBILE", year: "2026", color: "#00e5ff", icon: "fa-solid fa-satellite-dish",
    summary: "Multi-module Android platform with real-time delta sync, offline-first Room marrow, and full CI/CD circulation.",
    img: profile.holoA, flagship: true, href: "https://github.com/Dev-moe-kyawaung/pulsesync-android", orbit: 0.1,
    layers: {
      architecture: "Twelve Gradle feature modules with strict API/Implementation fences. Domain entities live in framework-agnostic Kotlin. Presentation emits sealed MVI intents into ViewModels; Room DB StateFlows are the single source of truth while WorkManager applies Firebase delta streams in the background.",
      dataFlow: ["Compose UI Intent", "ViewModel · Sealed State", "Domain UseCase (pure Kotlin)", "Repository Contract", "Room Flow (SSOT)", "Firebase Delta Worker"],
      metrics: [{ label: "COLD START", value: "<280ms" }, { label: "FRAME RATE", value: "60 FPS" }, { label: "BUILD CUT", value: "-62%" }, { label: "CRASH FREE", value: "99.98%" }],
      stack: ["Kotlin", "Compose", "Room", "Firebase", "Hilt", "GitHub Actions"],
    },
  },
  {
    id: "translator", name: "MoekyawTranslator", code: "ORB-2026-02", sector: "ON-DEVICE AI", year: "2026", color: "#7c4dff", icon: "fa-solid fa-robot",
    summary: "Private edge-AI translation using INT8 TFLite quantized neurons firing locally on device NPU silicon.",
    img: profile.holoC, flagship: true, href: "https://github.com/Dev-moe-kyawaung/", orbit: 0.25,
    layers: {
      architecture: "Post-training INT8 quantization compresses neural weights by 75% down to 18MB. Camera/speech streams enter native tensor buffers; the TFLite interpreter fires in 32ms on-device, with Claude API providing semantic fallback only when confidence drops.",
      dataFlow: ["Camera / Audio Input", "Native Tensor Buffer", "INT8 TFLite Interpreter", "Confidence Gate", "Claude API Fallback", "Compose AR Overlay"],
      metrics: [{ label: "INFERENCE", value: "32ms" }, { label: "RAM", value: "48 MB" }, { label: "OFFLINE", value: "100%" }, { label: "DATA LEAK", value: "0 B" }],
      stack: ["TFLite", "Claude API", "NDK", "Compose", "Python", "Flow"],
    },
  },
  {
    id: "pos", name: "POS Ultimate Pro Max", code: "ORB-2025-03", sector: "ENTERPRISE MOBILE", year: "2025", color: "#ffd740", icon: "fa-solid fa-credit-card",
    summary: "Full point-of-sale system — inventory, invoicing, tax logic, thermal printer dispatch, and offline ACID transactions.",
    img: profile.holoB, flagship: true, href: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max", orbit: 0.4,
    layers: {
      architecture: "Clean Architecture with ACID SQLite transactions under peak concurrency. Ledger math executes on IO dispatchers; Bluetooth thermal printing runs behind a hardware abstraction service.",
      dataFlow: ["Barcode Input", "Ledger Domain Logic", "ACID Room Transaction", "Bluetooth Print Service", "Cloud Ledger Sync"],
      metrics: [{ label: "PRINT", value: "40ms" }, { label: "INVOICES", value: "100K+" }, { label: "UPTIME", value: "99.95%" }, { label: "OFFLINE", value: "FULL" }],
      stack: ["Kotlin", "Room", "MVVM", "Bluetooth", "Coroutines"],
    },
  },
  {
    id: "social", name: "Social Dashboard", code: "ORB-2025-04", sector: "ANALYTICS", year: "2025", color: "#18ffff", icon: "fa-solid fa-chart-line",
    summary: "Real-time cross-platform analytics with windowed websocket aggregation and canvas telemetry.",
    href: "https://github.com/moekyawaung-tech/social-dashboard", orbit: 0.55,
    layers: {
      architecture: "Web Workers window and aggregate incoming websocket events before flushing to canvas visualizers, keeping the main thread below 12ms render delay under 15K events/sec.",
      dataFlow: ["Platform Ingestion", "Node Normalizer", "WebSocket Pipe", "Worker Aggregation", "Canvas Renderer"],
      metrics: [{ label: "EVENTS/s", value: "15K" }, { label: "RENDER", value: "<12ms" }, { label: "FPS", value: "60" }],
      stack: ["React", "Node", "WebSocket", "TypeScript", "Canvas"],
    },
  },
  {
    id: "job", name: "Job Portal", code: "ORB-2025-05", sector: "FULL-STACK", year: "2025", color: "#ff4081", icon: "fa-solid fa-briefcase",
    summary: "Recruitment platform with role-based candidate pipelines, parameterized search, and recruiter analytics.",
    href: "https://github.com/moekyawaung-tech/Job-Portal-App", orbit: 0.68,
    layers: {
      architecture: "JWT sessions with token rotation separate candidate privacy data from employer search indexes behind RBAC gateways and parameterized queries.",
      dataFlow: ["Submission", "Sanitization", "PostgreSQL Index", "RBAC Gateway", "Pipeline Dashboard"],
      metrics: [{ label: "SEARCH", value: "24ms" }, { label: "RBAC", value: "STRICT" }, { label: "UPTIME", value: "99.9%" }],
      stack: ["React", "Express", "PostgreSQL", "JWT", "REST"],
    },
  },
  {
    id: "games", name: "Arcade Colony", code: "ORB-2024-06", sector: "INTERACTIVE", year: "2024", color: "#7c4dff", icon: "fa-solid fa-gamepad",
    summary: "Canvas game collection with object-pool particles, vector physics, and synthesized chiptune audio.",
    img: profile.fireworks, href: "https://github.com/moekyawaung-tech/game-collection", orbit: 0.8,
    layers: {
      architecture: "Object-pool allocation prevents GC pauses; fixed-step physics and single-pass blitting hold 60 FPS with 5,000 live particles.",
      dataFlow: ["Input Loop", "Fixed-Step Physics", "Pooled Particles", "Canvas Blit", "Oscillator Audio"],
      metrics: [{ label: "FPS", value: "60" }, { label: "PARTICLES", value: "5K" }, { label: "GC PAUSE", value: "0ms" }],
      stack: ["Canvas", "WebGL", "Web Audio", "Physics Math"],
    },
  },
  {
    id: "pwa", name: "PWA Mycelium", code: "ORB-2024-07", sector: "PROGRESSIVE WEB", year: "2024", color: "#69f0ae", icon: "fa-solid fa-compact-disc",
    summary: "Offline-first PWA with Stale-While-Revalidate service workers and IndexedDB fallback.",
    img: profile.preview, href: "https://github.com/moekyawaung-tech/pwa-app", orbit: 0.9,
    layers: {
      architecture: "Stale-While-Revalidate caching with IndexedDB persistence achieves a perfect 100 Lighthouse PWA score and 15ms offline boot.",
      dataFlow: ["Request", "Service Worker", "Cache-First <10ms", "Background Fetch", "Update Notify"],
      metrics: [{ label: "LIGHTHOUSE", value: "100" }, { label: "OFFLINE BOOT", value: "15ms" }, { label: "PAYLOAD", value: "120KB" }],
      stack: ["Service Workers", "IndexedDB", "PWA", "JavaScript"],
    },
  },
  {
    id: "video", name: "Reelplay", code: "ORB-2024-08", sector: "MEDIA", year: "2024", color: "#00e5ff", icon: "fa-solid fa-video",
    summary: "Adaptive media player on ExoPlayer/Media3 with gesture scrubbing and offline caching.",
    href: "https://github.com/moekyawaung-tech/video-player", orbit: 1.05,
    layers: {
      architecture: "Hardware surface renderer with adaptive bitrate track selection and coroutine-throttled scrubbing for stutter-free 4K.",
      dataFlow: ["HLS/MP4 Source", "Demuxer / HW Decoder", "Adaptive Track Selector", "SurfaceView Render", "Audio Focus Manager"],
      metrics: [{ label: "BUFFER", value: "120ms" }, { label: "MAX RES", value: "4K" }, { label: "CPU", value: "<4%" }],
      stack: ["ExoPlayer", "Media3", "Kotlin", "Coroutines"],
    },
  },
];

export const skillRings = [
  { id: "R1", name: "Kotlin / Android Core", pct: 98, color: "#00e5ff", spec: "Compose · M3 · Coroutines", note: "60fps frame pacing" },
  { id: "R2", name: "Clean Architecture", pct: 95, color: "#7c4dff", spec: "MVVM · MVI · 12 modules", note: "Domain isolation" },
  { id: "R3", name: "On-Device AI", pct: 88, color: "#ffd740", spec: "TFLite INT8 · Claude API", note: "32ms inference" },
  { id: "R4", name: "Backend / Firebase", pct: 90, color: "#69f0ae", spec: "Firestore · Retrofit · REST", note: "Delta sync" },
  { id: "R5", name: "Security / DevOps", pct: 91, color: "#ff4081", spec: "Keystore TEE · Actions", note: "AES-256 · CI matrix" },
  { id: "R6", name: "Web / TypeScript", pct: 84, color: "#18ffff", spec: "React · TS · PWA", note: "Lighthouse 100" },
];

export const orbitTimeline = [
  { yr: "2023", phase: "IGNITION", title: "First orbit", desc: "Web & mobile spores — JavaScript, Python, first save files. The sphere starts spinning.", color: "#ff4081" },
  { yr: "2024", phase: "EXPANSION", title: "82+ certifications", desc: "Nine domains crystallized — C to compilers, AI to cyber, Jul 4 first bloom.", color: "#7c4dff" },
  { yr: "2025", phase: "SPECIALIZATION", title: "Senior consolidation", desc: "Kotlin, Compose, Clean Architecture fuse. Google Launchpad. POS Pro Max ships.", color: "#00e5ff" },
  { yr: "2026", phase: "FRONTIER", title: "Edge-AI omnisphere", desc: "MoekyawTranslator & PulseSync — on-device INT8 intelligence, full CI/CD.", color: "#ffd740" },
];

export const certOrbits = [
  { name: "Languages", count: 13, icon: "fa-solid fa-code", color: "#00e5ff" },
  { name: "Web", count: 13, icon: "fa-solid fa-globe", color: "#7c4dff" },
  { name: "Mobile", count: 7, icon: "fa-solid fa-mobile-screen", color: "#ffd740" },
  { name: "Databases", count: 6, icon: "fa-solid fa-database", color: "#69f0ae" },
  { name: "AI", count: 11, icon: "fa-solid fa-brain", color: "#ff4081" },
  { name: "Security", count: 10, icon: "fa-solid fa-shield-halved", color: "#00e5ff" },
  { name: "Blockchain", count: 4, icon: "fa-solid fa-link", color: "#7c4dff" },
  { name: "Systems", count: 7, icon: "fa-solid fa-layer-group", color: "#ffd740" },
  { name: "Business", count: 11, icon: "fa-solid fa-chart-line", color: "#69f0ae" },
];

export const tape = [
  "KOTLIN", "COMPOSE", "CLEAN ARCHITECTURE", "MVVM", "TFLITE INT8", "FIREBASE",
  "COROUTINES", "ROOM", "MATERIAL 3", "CLAUDE API", "GITHUB ACTIONS", "EXOPLAYER", "REST", "CI/CD",
];
