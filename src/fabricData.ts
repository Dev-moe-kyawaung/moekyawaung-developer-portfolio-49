// ============================================================
// HYPER-FABRIC DIGITAL WEAVE — DATA LAYER
// Woven Nodes, Loom Specifications, Thread Compositions
// ============================================================

export const CLOUD_IMG = "https://res.cloudinary.com/dye5qpwii/image/upload";

export const weaverProfile = {
  name: "Moe Kyaw Aung",
  nameNative: "မိုးကျော်အောင်",
  title: "Senior Android Developer",
  subTitle: "Digital Loom Architect · On-Device AI Engineer",
  location: "Tachileik, Myanmar 🇲🇲 ↔ Bangkok, Thailand 🇹🇭",
  philosophy: "Code with culture. Build with purpose.",
  philosophyNative: "ကုဒ်ဖြင့်ယဉ်ကျေးမှု · ရည်ရွယ်ချက်ဖြင့်တည်ဆောက်",
  tagline: "Weaving high-tensile Android architectures, on-device AI filaments, and seamless digital tapestries.",
  building: "MoekyawTranslator — an on-device AI translation tapestry",
  certsTotal: "82+",
  wingsTotal: "9",
  appsTotal: "16",
  yearsTotal: "3+",
  email: "moekyawaung2026@gmail.com",
  phone: "+95 9 889 000 889",
  phoneAlt: "+959 666 000 050",
  github: "https://github.com/Dev-moe-kyawaung/",
  gravatar: "https://gravatar.com/moekyawaung2026",
  
  // Media Assets from Cloudinary
  portraitPrimary: `${CLOUD_IMG}/v1778763535/MKA_25_lbx6fb.webp`,
  portraitStudio: `${CLOUD_IMG}/v1778763531/MKA_12_iv8kpm.webp`,
  portraitAlt: `${CLOUD_IMG}/v1778763531/MKA_3_zqrhhr.webp`,
  copilotA: `${CLOUD_IMG}/v1778795856/copilot_image_1778795675037_heh9xk.png`,
  copilotB: `${CLOUD_IMG}/v1778795856/copilot_image_1778794626112_ega7kk.png`,
  copilotC: `${CLOUD_IMG}/v1778795859/copilot_image_1778794430377_n7xlmz.png`,
  previewPwa: `${CLOUD_IMG}/v1778795822/preview_dzhqvv.webp`,
  fireworks: `${CLOUD_IMG}/v1779052645/2153-fireworks-composer_gm3e0h.jpg`,

  socials: [
    { name: "GitHub", icon: "fa-brands fa-github", href: "https://github.com/Dev-moe-kyawaung/" },
    { name: "LinkedIn", icon: "fa-brands fa-linkedin-in", href: "https://www.linkedin.com/in/moe-kyaw-aung-2653093a1" },
    { name: "YouTube", icon: "fa-brands fa-youtube", href: "https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG" },
    { name: "Bluesky", icon: "fa-solid fa-cloud", href: "https://bsky.app/profile/moekyawaung96.bsky.social" },
    { name: "Gravatar", icon: "fa-solid fa-circle-user", href: "https://gravatar.com/moekyawaung2026" },
    { name: "Flickr", icon: "fa-brands fa-flickr", href: "https://www.flickr.com/people/204037451@N06" },
    { name: "Vimeo", icon: "fa-brands fa-vimeo-v", href: "https://vimeo.com/user252414232" },
    { name: "Tumblr", icon: "fa-brands fa-tumblr", href: "https://www.tumblr.com/moekyawaung" },
  ],
};

/* ------------------------------------------------------------
   WOVEN NODES (PROJECTS) — Expandable into Case Studies
------------------------------------------------------------ */
export type WovenNode = {
  id: string;
  title: string;
  weavePattern: string;
  knotId: string;
  year: string;
  glowColor: string;
  accentBg: string;
  flagship?: boolean;
  category: "MOBILE" | "AI_EDGE" | "FULLSTACK" | "INTERACTIVE";
  
  // Fabric Architecture Attributes
  warpThread: string;   // Structural backbone
  weftThread: string;   // Surface & Interaction
  filament: string;     // State & Network
  threadCount: string;  // Weave density / complexity metric
  tensileRating: string; // Reliability / coverage rating
  
  summary: string;
  image?: string;
  repoUrl: string;
  liveUrl?: string;

  // Expanded Case Study Details
  caseStudy: {
    architecturalChallenge: string;
    weaveSolution: string;
    threadDataFlow: string[];
    metrics: { label: string; value: string }[];
    interlacedTech: string[];
  };
};

export const WOVEN_NODES: WovenNode[] = [
  {
    id: "pulsesync",
    title: "PulseSync Real-Time Platform",
    weavePattern: "Jacquard Multi-Module Weave",
    knotId: "KNOT-2026-PS",
    year: "2026",
    glowColor: "#00f0ff",
    accentBg: "rgba(0, 240, 255, 0.12)",
    flagship: true,
    category: "MOBILE",
    warpThread: "Kotlin 2.0 Coroutines (45%)",
    weftThread: "Jetpack Compose & M3 (35%)",
    filament: "Room DB & Firebase Delta Sync (20%)",
    threadCount: "1850 TPI · 12 Modules",
    tensileRating: "99.8 MPa (Zero Crash)",
    summary: "Senior multi-module Android platform featuring offline-first architecture, background delta streams, and an automated GitHub Actions CI/CD matrix.",
    image: weaverProfile.copilotA,
    repoUrl: "https://github.com/Dev-moe-kyawaung/pulsesync-android",
    caseStudy: {
      architecturalChallenge:
        "Ensuring sub-16ms frame pacing and zero cold-start latency when synchronizing hundreds of real-time collaborative updates across sporadic connectivity in Southeast Asia.",
      weaveSolution:
        "Wove an offline-first Single Source of Truth where the UI exclusively observes Room DB StateFlows. Background WorkManager tasks interlace remote delta streams into SQLite, isolating network volatility from the presentation shed.",
      threadDataFlow: [
        "User Action (Compose Intent)",
        "Domain Layer (Sealed UseCase)",
        "Repository Thread Arbiter",
        "Room DB Flow (Single Truth)",
        "Firebase Delta Sync Worker"
      ],
      metrics: [
        { label: "FRAME PACING", value: "60 FPS" },
        { label: "COLD START", value: "< 280ms" },
        { label: "BUILD ACCEL", value: "-62%" },
        { label: "CRASH FREE", value: "99.98%" }
      ],
      interlacedTech: ["Kotlin", "Compose", "Room", "Firebase", "Coroutines", "GitHub Actions", "Hilt"]
    }
  },
  {
    id: "moekyaw-translator",
    title: "MoekyawTranslator AI Loom",
    weavePattern: "TFLite INT8 Neural Tapestry",
    knotId: "KNOT-2026-MT",
    year: "2026",
    glowColor: "#b388ff",
    accentBg: "rgba(179, 136, 255, 0.12)",
    flagship: true,
    category: "AI_EDGE",
    warpThread: "TFLite INT8 Quantized Core (50%)",
    weftThread: "Claude API Semantic Reasoning (30%)",
    filament: "On-Device Neural Shaders (20%)",
    threadCount: "1620 TPI · Edge AI",
    tensileRating: "32ms Latency (Zero Cloud Leak)",
    summary: "Currently building: Private, on-device multilingual translation app compressing language models onto device NPU hardware with zero latency.",
    image: weaverProfile.copilotC,
    repoUrl: "https://github.com/Dev-moe-kyawaung/",
    caseStudy: {
      architecturalChallenge:
        "Running deep neural translation models on resource-constrained mobile hardware without exceeding 150MB of RAM or relying on expensive cloud roundtrips.",
      weaveSolution:
        "Post-training 8-bit quantization shrank the neural parameter weights by 75% down to 18MB. Custom C++ native tensor buffers interweave camera vision streams directly into Compose layout canvases.",
      threadDataFlow: [
        "Camera / Audio Sensor Input",
        "Native Tensor Memory Buffer",
        "INT8 TFLite Edge Interpreter",
        "Semantic Parsing (Claude API Fallback)",
        "Compose Augmented Overlay"
      ],
      metrics: [
        { label: "INFERENCE TICK", value: "32ms" },
        { label: "RAM FOOTPRINT", value: "48 MB" },
        { label: "OFFLINE READY", value: "100%" },
        { label: "PRIVACY LEAK", value: "0 bytes" }
      ],
      interlacedTech: ["TFLite", "Claude API", "Python", "Android NDK", "Compose", "Kotlin Flow"]
    }
  },
  {
    id: "pos-pro-max",
    title: "POS Ultimate Pro Max Reef",
    weavePattern: "Twill Enterprise Pattern",
    knotId: "KNOT-2025-POS",
    year: "2025",
    glowColor: "#ffd740",
    accentBg: "rgba(255, 215, 64, 0.12)",
    flagship: true,
    category: "MOBILE",
    warpThread: "Clean Architecture Domain (40%)",
    weftThread: "Room Relational DB (35%)",
    filament: "Bluetooth Thermal Escapement (25%)",
    threadCount: "1450 TPI · Enterprise",
    tensileRating: "100K+ Invoices Indexed",
    summary: "Full-featured point-of-sale retail suite — inventory tracking, live receipt dispatch, tax orchestration, and offline POS transactions.",
    image: weaverProfile.copilotB,
    repoUrl: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max",
    caseStudy: {
      architecturalChallenge:
        "Managing heavy concurrent inventory ledger calculations during peak retail rushes with instant local hardware thermal printer dispatch.",
      weaveSolution:
        "Employed Clean Architecture with strict domain layer boundaries. Complex transaction math executes inside background coroutine dispatchers with ACID SQLite transactions.",
      threadDataFlow: [
        "Barcode / Touch Input",
        "Ledger Calculation Domain",
        "ACID SQLite Transaction",
        "Bluetooth Esc/Pos Dispatch",
        "Cloud Ledger Synchronization"
      ],
      metrics: [
        { label: "DISPATCH TIME", value: "40ms" },
        { label: "TRANSACTIONS", value: "100K+" },
        { label: "STABILITY", value: "99.95%" },
        { label: "OFFLINE OPS", value: "Full" }
      ],
      interlacedTech: ["Kotlin", "Room DB", "MVVM", "Clean Architecture", "Bluetooth API", "Coroutines"]
    }
  },
  {
    id: "social-dashboard",
    title: "Social Dashboard Bloom",
    weavePattern: "Mesh Data Stream Fabric",
    knotId: "KNOT-2025-SD",
    year: "2025",
    glowColor: "#00e676",
    accentBg: "rgba(0, 230, 118, 0.12)",
    category: "FULLSTACK",
    warpThread: "React 19 & TypeScript (45%)",
    weftThread: "WebSocket Real-Time Plankton (35%)",
    filament: "Node.js Stream Aggregator (20%)",
    threadCount: "1280 TPI · Live Mesh",
    tensileRating: "15K Events/sec",
    summary: "Real-time social analytics dashboard aggregating cross-platform audience growth, engagement radar, and live telemetry streams.",
    image: weaverProfile.copilotA,
    repoUrl: "https://github.com/moekyawaung-tech/social-dashboard",
    caseStudy: {
      architecturalChallenge:
        "Rendering live chart telemetry from multiple social platform APIs simultaneously without lagging client browser threads.",
      weaveSolution:
        "Implemented windowed data streams with Web Workers aggregating incoming websocket events before flushing them to canvas visualizers.",
      threadDataFlow: [
        "Multi-Platform Social Ingestion",
        "Node Stream Normalizer",
        "WebSocket Client Pipe",
        "Worker Thread Aggregation",
        "Canvas High-FPS Visualizer"
      ],
      metrics: [
        { label: "STREAM SPEED", value: "60 FPS" },
        { label: "EVENT BURST", value: "15K/s" },
        { label: "RENDER DELAY", value: "< 12ms" }
      ],
      interlacedTech: ["React", "Node.js", "WebSocket", "TypeScript", "Tailwind CSS", "Charts"]
    }
  },
  {
    id: "job-portal",
    title: "Job Portal Ecosystem",
    weavePattern: "Intertwined Role Fabric",
    knotId: "KNOT-2025-JP",
    year: "2025",
    glowColor: "#ff4081",
    accentBg: "rgba(255, 64, 129, 0.12)",
    category: "FULLSTACK",
    warpThread: "Full-Stack Auth & RBAC (40%)",
    weftThread: "Search Query Elastic Loom (35%)",
    filament: "PostgreSQL & REST Pipes (25%)",
    threadCount: "1150 TPI · Full Stack",
    tensileRating: "Zero-Vulnerability Audited",
    summary: "Recruitment portal with role-based candidate pipelines, recruiter analytics, and automated resume filtering.",
    image: weaverProfile.portraitStudio,
    repoUrl: "https://github.com/moekyawaung-tech/Job-Portal-App",
    caseStudy: {
      architecturalChallenge:
        "Building a bulletproof role-based permission system separating candidate privacy data from employer search indexes.",
      weaveSolution:
        "Hardened JWT session management with token rotation, parameterized SQL query filters, and clean RESTful endpoint orchestration.",
      threadDataFlow: [
        "Applicant Submission",
        "Sanitization & Parsing",
        "PostgreSQL Relational Storage",
        "RBAC Verification Gateway",
        "Recruiter Pipeline Dashboard"
      ],
      metrics: [
        { label: "SEARCH SPEED", value: "24ms" },
        { label: "AUTH LEVEL", value: "Strict" },
        { label: "UPTIME", value: "99.9%" }
      ],
      interlacedTech: ["React", "Express", "PostgreSQL", "REST APIs", "JWT", "Tailwind"]
    }
  },
  {
    id: "pwa-mycelium",
    title: "PWA Offline Mycelium",
    weavePattern: "Service Worker Root Weave",
    knotId: "KNOT-2024-PWA",
    year: "2024",
    glowColor: "#00f0ff",
    accentBg: "rgba(0, 240, 255, 0.12)",
    category: "FULLSTACK",
    warpThread: "Service Worker Cache Hierarchy (50%)",
    weftThread: "IndexedDB Client Storage (30%)",
    filament: "Installable Web App Manifest (20%)",
    threadCount: "1050 TPI · Progressive",
    tensileRating: "100% Offline Lighthouse",
    summary: "Progressive Web App engineered for instant native-like installation, aggressive background caching, and seamless offline capability.",
    image: weaverProfile.previewPwa,
    repoUrl: "https://github.com/moekyawaung-tech/pwa-app",
    caseStudy: {
      architecturalChallenge:
        "Delivering a native app feel on low-bandwidth mobile browsers with automatic background asset refresh when online.",
      weaveSolution:
        "Wove a Stale-While-Revalidate service worker caching strategy with IndexedDB fallback, achieving a perfect 100 Lighthouse PWA score.",
      threadDataFlow: [
        "Network Request Trigger",
        "Service Worker Interceptor",
        "Cache-First Response (<10ms)",
        "Background Network Fetch",
        "Cache Update Notification"
      ],
      metrics: [
        { label: "LIGHTHOUSE", value: "100/100" },
        { label: "OFFLINE BOOT", value: "15ms" },
        { label: "PAYLOAD", value: "120 KB" }
      ],
      interlacedTech: ["Service Workers", "PWA", "IndexedDB", "Vanilla JS", "HTML5"]
    }
  },
  {
    id: "arcade-colony",
    title: "Arcade Physics & Canvas Spores",
    weavePattern: "High-Frequency Kinetic Grid",
    knotId: "KNOT-2024-AC",
    year: "2024",
    glowColor: "#b388ff",
    accentBg: "rgba(179, 136, 255, 0.12)",
    category: "INTERACTIVE",
    warpThread: "HTML5 60FPS Canvas Loop (55%)",
    weftThread: "Custom Collision Physics (30%)",
    filament: "Web Audio Chiptune Synth (15%)",
    threadCount: "980 TPI · Game Engine",
    tensileRating: "Zero GC Frame Stutter",
    summary: "Interactive game collection featuring retro arcade physics, particle explosions, and custom procedural audio.",
    image: weaverProfile.fireworks,
    repoUrl: "https://github.com/moekyawaung-tech/game-collection",
    caseStudy: {
      architecturalChallenge:
        "Maintaining a rock-solid 60 FPS animation loop with thousands of interactive particle collisions without garbage collection pauses.",
      weaveSolution:
        "Constructed an object-pool memory allocation system preventing frame drops, coupled with direct mathematical vector physics.",
      threadDataFlow: [
        "Game Input Loop (Keyboard/Touch)",
        "Fixed-Step Physics Calculation",
        "Particle Matrix Vector Update",
        "Single-Pass Canvas Blit",
        "Synthesized Oscillator Audio"
      ],
      metrics: [
        { label: "FRAME RATE", value: "60 FPS" },
        { label: "PARTICLES", value: "5,000+" },
        { label: "GC PAUSES", value: "0ms" }
      ],
      interlacedTech: ["Canvas API", "WebGL", "JavaScript", "Web Audio API", "Physics Math"]
    }
  },
  {
    id: "video-exoplayer",
    title: "Video Player Media Strand",
    weavePattern: "Adaptive Buffer Warp",
    knotId: "KNOT-2024-VP",
    year: "2024",
    glowColor: "#ffd740",
    accentBg: "rgba(255, 215, 64, 0.12)",
    category: "MOBILE",
    warpThread: "ExoPlayer Media Source (50%)",
    weftThread: "Adaptive Bitrate Pipeline (30%)",
    filament: "Custom Gesture Surface UI (20%)",
    threadCount: "1120 TPI · Media",
    tensileRating: "Zero Buffer Stutters",
    summary: "High-performance Android media player with adaptive playback, subtitle parsers, and custom hardware playback controls.",
    repoUrl: "https://github.com/moekyawaung-tech/video-player",
    caseStudy: {
      architecturalChallenge:
        "Ensuring smooth 4K video rendering with gesture-driven scrubbing and background audio playback across diverse Android chipsets.",
      weaveSolution:
        "Interlaced ExoPlayer's hardware surface renderer with custom Coroutine-driven scrub throttling and battery-optimized audio focus controllers.",
      threadDataFlow: [
        "HLS / MP4 Stream Source",
        "Demuxer & Codec Hardware Decoder",
        "Adaptive Bitrate Track Selector",
        "SurfaceView Direct Hardware Render",
        "Audio Track Focus Manager"
      ],
      metrics: [
        { label: "BUFFER LATENCY", value: "120ms" },
        { label: "RESOLUTION", value: "Up to 4K" },
        { label: "CPU DRAIN", value: "< 4%" }
      ],
      interlacedTech: ["Kotlin", "ExoPlayer", "Android Jetpack", "Media3", "Coroutines"]
    }
  }
];

/* ------------------------------------------------------------
   SKILL LOOM STRANDS (WEFT PATTERNS)
------------------------------------------------------------ */
export type SkillStrand = {
  tag: string;
  name: string;
  strandType: string;
  gaugePercentage: number;
  threadSpec: string;
  filamentColor: string;
  spoolCapacity: string;
  description: string;
};

export const SKILL_STRANDS: SkillStrand[] = [
  {
    tag: "WARP.01",
    name: "Kotlin & Android Architecture",
    strandType: "Core Structural Warp",
    gaugePercentage: 98,
    threadSpec: "Kotlin 2.0 · Jetpack Compose · M3",
    filamentColor: "#00f0ff",
    spoolCapacity: "98% Cohesion",
    description: "Production mobile systems crafted with modern declarative Compose and rock-solid state management."
  },
  {
    tag: "WARP.02",
    name: "Clean Architecture & Design Patterns",
    strandType: "Architectural Scaffold",
    gaugePercentage: 95,
    threadSpec: "Clean Arch · MVVM · MVI · Multi-Module",
    filamentColor: "#b388ff",
    spoolCapacity: "95% Isolation",
    description: "Decoupled domain layers, sealed UI intents, and 12-module boundaries guaranteeing testable code."
  },
  {
    tag: "WARP.03",
    name: "On-Device AI & Machine Learning",
    strandType: "Neural Silk Filament",
    gaugePercentage: 88,
    threadSpec: "TFLite INT8 · Claude API · Python",
    filamentColor: "#ffd740",
    spoolCapacity: "32ms Inference",
    description: "Edge-quantized machine learning models enabling instantaneous, private translation directly on device."
  },
  {
    tag: "WARP.04",
    name: "Backend & Cloud Microservices",
    strandType: "Conductive Plasma Thread",
    gaugePercentage: 90,
    threadSpec: "Firebase Firestore · REST APIs · Retrofit",
    filamentColor: "#00e676",
    spoolCapacity: "Zero Latency",
    description: "Cloud endpoints and realtime database streams maintaining constant sync with local SQLite caches."
  },
  {
    tag: "WARP.05",
    name: "Security, DevOps & CI/CD",
    strandType: "Hardened Carbon Strand",
    gaugePercentage: 91,
    threadSpec: "GitHub Actions · Keystore TEE · Linux",
    filamentColor: "#ff4081",
    spoolCapacity: "Automated Matrix",
    description: "Continuous integration pipelines testing multi-device UI matrices with zero regression deployments."
  },
  {
    tag: "WARP.06",
    name: "Frontend, TypeScript & PWA",
    strandType: "Interlaced Web Weft",
    gaugePercentage: 86,
    threadSpec: "React 19 · TypeScript · Tailwind · PWA",
    filamentColor: "#00f0ff",
    spoolCapacity: "Lighthouse 100",
    description: "High-performance responsive web interfaces built with progressive caching and reactive hooks."
  }
];

/* ------------------------------------------------------------
   TAPESTRY TIMELINE (CONTINUOUS WARP STRAND)
------------------------------------------------------------ */
export const TAPESTRY_TIMELINE = [
  {
    year: "2023",
    eraTag: "INITIAL SPOOL",
    title: "The First Thread Cast",
    knotDetails: "Inception of the programming craft across web and mobile. Wove initial project capsules with vanilla JavaScript, Python algorithms, and mobile UI basics.",
    color: "#ff4081",
    filamentType: "Raw Spool Cotton"
  },
  {
    year: "2024",
    eraTag: "JACQUARD CASCADE",
    title: "82+ Certificate Spools Crystallized",
    knotDetails: "A relentless, structured curriculum across 9 engineering wings. First certified milestone logged on July 4, 2024, expanding into databases, cyber-security, and ML algorithms.",
    color: "#00f0ff",
    filamentType: "Tensile Polymer Fiber"
  },
  {
    year: "2025",
    eraTag: "MASTER WEFT",
    title: "Senior Android Specialization",
    knotDetails: "Deep mastery of Kotlin, Compose, and Clean Architecture. Selected for Google Developers Launchpad, authoring production platforms like POS Ultimate Pro Max.",
    color: "#00e676",
    filamentType: "Titanium Fiber Core"
  },
  {
    year: "2026",
    eraTag: "NEURAL FRONTIER",
    title: "On-Device AI & Flagship Tapestries",
    knotDetails: "Architecting MoekyawTranslator with INT8 TFLite edge models and PulseSync multi-module platform. Weaving culture and purposeful software on the global stage.",
    color: "#ffd740",
    filamentType: "Optic Silk Nanoweave"
  }
];

/* ------------------------------------------------------------
   CERTIFICATE SPOOLS — 9 WINGS / 82+ VERIFIED CREDENTIALS
------------------------------------------------------------ */
export const CERTIFICATE_WINGS = [
  { id: "prog", name: "Programming Languages", count: 13, icon: "fa-solid fa-code", color: "#00f0ff" },
  { id: "web", name: "Web & Full-Stack Dev", count: 13, icon: "fa-solid fa-globe", color: "#b388ff" },
  { id: "mobile", name: "Mobile & Android", count: 7, icon: "fa-solid fa-mobile-screen", color: "#ffd740" },
  { id: "data", name: "Databases & Storage", count: 6, icon: "fa-solid fa-database", color: "#00e676" },
  { id: "ai", name: "AI & Data Science", count: 11, icon: "fa-solid fa-brain", color: "#ff4081" },
  { id: "sec", name: "Security & DevOps", count: 10, icon: "fa-solid fa-shield-halved", color: "#00f0ff" },
  { id: "chain", name: "Blockchain & Web3", count: 4, icon: "fa-solid fa-link", color: "#b388ff" },
  { id: "soft", name: "Software Engineering", count: 7, icon: "fa-solid fa-layer-group", color: "#ffd740" },
  { id: "biz", name: "Business & Strategy", count: 11, icon: "fa-solid fa-chart-line", color: "#00e676" }
];

export const TAPE_MARQUEE = [
  "KOTLIN 2.0", "JETPACK COMPOSE", "CLEAN ARCHITECTURE", "MVVM / MVI",
  "TFLITE INT8", "FIREBASE FIRESTORE", "MULTI-MODULE GRADLE", "CLAUDE API",
  "ROOM SQLITE", "COROUTINES FLOW", "CI/CD ACTIONS", "ETHICAL HACKING",
  "REACT 19", "TYPESCRIPT", "TAILWIND CSS", "MATERIAL 3", "REST APIS"
];
