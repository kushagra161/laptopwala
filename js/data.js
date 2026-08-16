/**
 * Laptop Dataset & Affiliate Configuration Repository
 * All affiliate links default to placeholder 'YOUR_AFFILIATE_LINK_HERE' as specified.
 */

const AFFILIATE_CONFIG = {
  defaultLink: "YOUR_AFFILIATE_LINK_HERE",
  // Easily replace or append custom affiliate tracking IDs globally
  globalTag: ""
};

const LAPTOPS_DATA = [
  // --- GAMING CATEGORY ---
  {
    id: "laptop-g1",
    name: "ASUS ROG Strix G16 (2026)",
    brand: "ASUS",
    categories: ["gaming"],
    subcategories: ["aaa", "fps", "gpu-focused"],
    budgetTier: "premium",
    price: "$1,699",
    numericPrice: 1699,
    rating: 4.9,
    recommendationScore: "98%",
    bestForBadge: "Best Overall AAA Gaming",
    description: "Uncompromised gaming performance powered by RTX 4070, high refresh 240Hz Nebula display, and ROG Intelligent Cooling.",
    specs: {
      cpu: "Intel Core i9-13980HX",
      gpu: "NVIDIA GeForce RTX 4070 (8GB)",
      ram: "16GB DDR5 (Upgradable)",
      storage: "1TB PCIe Gen4 NVMe SSD",
      display: "16\" QHD+ (2560x1600) 240Hz 3ms",
      battery: "90Wh (Up to 6 hrs casual)",
      weight: "5.51 lbs (2.5 kg)"
    },
    pros: ["Blazing 240Hz QHD Display", "Top-tier Thermal Performance", "RGB Per-Key Mechanical Feel"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-g2",
    name: "Lenovo Legion Pro 5i",
    brand: "Lenovo",
    categories: ["gaming", "editing"],
    subcategories: ["fps", "aaa", "premiere", "gpu-focused"],
    budgetTier: "midrange",
    price: "$1,299",
    numericPrice: 1299,
    rating: 4.8,
    recommendationScore: "96%",
    bestForBadge: "Best Value Competitive FPS",
    description: "Exceptional keyboard feedback, AI-tuned Legion Coldfront 5.0 cooling, and RTX 4060 for esports high FPS dominance.",
    specs: {
      cpu: "Intel Core i7-13700HX",
      gpu: "NVIDIA GeForce RTX 4060 (8GB)",
      ram: "16GB DDR5 4800MHz",
      storage: "512TB NVMe M.2 SSD",
      display: "16\" WQXGA (2560x1600) 165Hz IPS",
      battery: "80Wh (5 hrs non-gaming)",
      weight: "5.6 lbs (2.55 kg)"
    },
    pros: ["Industry-Leading Keyboard", "100% sRGB Color Accuracy", "Dual M.2 SSD Expansion Slots"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-g3",
    name: "Acer Nitro V 15",
    brand: "Acer",
    categories: ["gaming", "college"],
    subcategories: ["casual-gaming", "assignments", "browsing"],
    budgetTier: "budget",
    price: "$679",
    numericPrice: 679,
    rating: 4.6,
    recommendationScore: "91%",
    bestForBadge: "Best Budget Casual Gaming",
    description: "Entry-level gaming powerhouse delivering smooth 1080p performance on modern titles without breaking the bank.",
    specs: {
      cpu: "Intel Core i5-13420H",
      gpu: "NVIDIA GeForce RTX 3050 (6GB)",
      ram: "8GB DDR5 (Recommend 16GB upgrade)",
      storage: "512GB PCIe Gen4 SSD",
      display: "15.6\" FHD (1920x1080) 144Hz IPS",
      battery: "57Wh (4.5 hrs office work)",
      weight: "4.66 lbs (2.1 kg)"
    },
    pros: ["Unbeatable Entry Price", "144Hz Smooth Display", "Easy Ram & Storage Expansion"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },

  // --- CODING / DEVELOPMENT CATEGORY ---
  {
    id: "laptop-c1",
    name: "Apple MacBook Pro 14\" (M3 Pro)",
    brand: "Apple",
    categories: ["coding", "editing", "work"],
    subcategories: ["web-dev", "python", "software-dev", "cloud", "davinci", "premiere"],
    budgetTier: "premium",
    price: "$1,999",
    numericPrice: 1999,
    rating: 4.95,
    recommendationScore: "99%",
    bestForBadge: "Best Overall for Developers",
    description: "Unmatched battery life, liquid retina XDR screen, and silent Unix workstation power for Docker, Xcode, & compilation.",
    specs: {
      cpu: "Apple M3 Pro (12-Core CPU)",
      gpu: "18-Core Integrated GPU",
      ram: "18GB Unified Memory",
      storage: "512GB High-Speed SSD",
      display: "14.2\" Liquid Retina XDR (3024x1964) 120Hz ProMotion",
      battery: "up to 18 Hours Active Battery",
      weight: "3.5 lbs (1.61 kg)"
    },
    pros: ["18+ Hour Battery Life", "Zero Thermal Throttling / Silent", "Best-in-Class Trackpad & Audio"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-c2",
    name: "Dell XPS 15 (9530)",
    brand: "Dell",
    categories: ["coding", "work", "editing"],
    subcategories: ["web-dev", "python", "cloud", "photoshop"],
    budgetTier: "premium",
    price: "$1,549",
    numericPrice: 1549,
    rating: 4.75,
    recommendationScore: "95%",
    bestForBadge: "Best Windows Machine for Devs",
    description: "Sleek CNC aluminum chassis with stunning 3.5K OLED touch option and quad-speaker sound for heavy full-stack development.",
    specs: {
      cpu: "Intel Core i7-13700H",
      gpu: "NVIDIA GeForce RTX 4050 (6GB)",
      ram: "16GB DDR5 4800MHz",
      storage: "1TB PCIe NVMe SSD",
      display: "15.6\" FHD+ (1920x1200) InfinityEdge 500 nits",
      battery: "86Wh (Up to 9 hrs browsing)",
      weight: "4.21 lbs (1.92 kg)"
    },
    pros: ["InfinityEdge Minimal Bezel Display", "Tactile Ergonomic Keyboard", "Dual Thunderbolt 4 Ports"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-c3",
    name: "ThinkPad E16 Gen 1 AMD",
    brand: "Lenovo",
    categories: ["coding", "study", "work"],
    subcategories: ["python", "web-dev", "assignments", "office"],
    budgetTier: "midrange",
    price: "$849",
    numericPrice: 849,
    rating: 4.7,
    recommendationScore: "94%",
    bestForBadge: "Best Value Coding & Linux",
    description: "Legendary ThinkPad tactile keyboard durability with high multi-core Ryzen 7 efficiency for CS students and backend devs.",
    specs: {
      cpu: "AMD Ryzen 7 7730U (8-Cores / 16-Threads)",
      gpu: "AMD Radeon Integrated Graphics",
      ram: "16GB DDR4 3200MHz",
      storage: "512GB NVMe SSD",
      display: "16\" WUXGA (1920x1200) Anti-glare IPS",
      battery: "57Wh (Up to 10 hrs battery)",
      weight: "3.9 lbs (1.77 kg)"
    },
    pros: ["Best Laptop Keyboard in Industry", "Mil-Spec Rugged Build Quality", "Flawless Linux Compatibility"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },

  // --- STUDY / COLLEGE CATEGORY ---
  {
    id: "laptop-s1",
    name: "Apple MacBook Air 13\" (M2)",
    brand: "Apple",
    categories: ["study", "work"],
    subcategories: ["assignments", "office", "online-classes", "browsing", "programming"],
    budgetTier: "midrange",
    price: "$999",
    numericPrice: 999,
    rating: 4.9,
    recommendationScore: "98%",
    bestForBadge: "Best Overall for College",
    description: "Ultralight 2.7 lb fanless design with all-day battery life, MagSafe charging, and effortless multitasking across campus.",
    specs: {
      cpu: "Apple M2 (8-Core CPU)",
      gpu: "8-Core Integrated GPU",
      ram: "8GB Unified Memory",
      storage: "256GB SSD",
      display: "13.6\" Liquid Retina (2560x1664) 500 nits",
      battery: "up to 18 Hours Battery",
      weight: "2.7 lbs (1.24 kg)"
    },
    pros: ["Featherlight 2.7 lbs", "Silent Fanless Operation", "Full-Day All-Campus Battery"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-s2",
    name: "ASUS Zenbook 14 OLED",
    brand: "ASUS",
    categories: ["study", "work", "editing"],
    subcategories: ["assignments", "browsing", "photoshop", "office"],
    budgetTier: "midrange",
    price: "$799",
    numericPrice: 799,
    rating: 4.8,
    recommendationScore: "96%",
    bestForBadge: "Best Value OLED Display",
    description: "Vibrant 2.8K 90Hz OLED screen delivering cinema-grade colors for media consumption, lectures, and photo edits.",
    specs: {
      cpu: "Intel Core i5-1340P",
      gpu: "Intel Iris Xe Graphics",
      ram: "16GB LPDDR5",
      storage: "512GB PCIe 4.0 SSD",
      display: "14\" 2.8K (2880x1800) 90Hz OLED 600 nits",
      battery: "75Wh (Up to 11 hrs work)",
      weight: "3.06 lbs (1.39 kg)"
    },
    pros: ["Gorgeous 2.8K OLED Color Panel", "Premium Slim Metal Chassis", "Harman Kardon Audio"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-s3",
    name: "HP Pavilion 15 (2026)",
    brand: "HP",
    categories: ["study"],
    subcategories: ["assignments", "office", "online-classes", "browsing"],
    budgetTier: "budget",
    price: "$549",
    numericPrice: 549,
    rating: 4.5,
    recommendationScore: "90%",
    bestForBadge: "Best Student Budget Pick",
    description: "Dependable daily driver for college note-taking, video calls, Microsoft Office 365, and web browsing.",
    specs: {
      cpu: "AMD Ryzen 5 7530U",
      gpu: "AMD Radeon Graphics",
      ram: "16GB RAM",
      storage: "512GB PCIe NVMe SSD",
      display: "15.6\" FHD (1920x1080) IPS Micro-edge",
      battery: "41Wh (Up to 7 hrs work)",
      weight: "3.86 lbs (1.75 kg)"
    },
    pros: ["16GB RAM at Budget Price", "HP Fast Charge (50% in 45 mins)", "Flicker-Free FHD Screen"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },

  // --- VIDEO & PHOTO EDITING CATEGORY ---
  {
    id: "laptop-e1",
    name: "ASUS ROG Zephyrus G16 (OLED)",
    brand: "ASUS",
    categories: ["editing", "gaming", "coding"],
    subcategories: ["premiere", "davinci", "after-effects", "photoshop", "aaa", "content-creation"],
    budgetTier: "premium",
    price: "$1,999",
    numericPrice: 1999,
    rating: 4.92,
    recommendationScore: "98%",
    bestForBadge: "Best Overall Creator Laptop",
    description: "CNC aluminum body with a color-calibrated 240Hz ROG Nebula OLED display for 4K video editing, color grading, & VFX.",
    specs: {
      cpu: "Intel Core Ultra 9 185H (AI NPU)",
      gpu: "NVIDIA GeForce RTX 4070 (8GB)",
      ram: "32GB LPDDR5X",
      storage: "1TB PCIe Gen4 NVMe SSD",
      display: "16\" 2.5K (2560x1600) 240Hz OLED 0.2ms (100% DCI-P3)",
      battery: "90Wh (Up to 8 hrs regular)",
      weight: "4.08 lbs (1.85 kg)"
    },
    pros: ["100% DCI-P3 Color Accuracy OLED", "32GB RAM for 4K Timeline scrubbing", "Lightweight CNC Aluminum Body"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-e2",
    name: "Gigabyte AERO 14 OLED",
    brand: "Gigabyte",
    categories: ["editing"],
    subcategories: ["photoshop", "premiere", "content-creation"],
    budgetTier: "midrange",
    price: "$1,299",
    numericPrice: 1299,
    rating: 4.75,
    recommendationScore: "95%",
    bestForBadge: "Best Portable Photo & 4K Video Editor",
    description: "Factory color-calibrated Delta E < 1 display with Studio Drivers optimized for Adobe Creative Cloud applications.",
    specs: {
      cpu: "Intel Core i7-13700H",
      gpu: "NVIDIA GeForce RTX 4050 (6GB Studio Drivers)",
      ram: "16GB LPDDR5",
      storage: "1TB Gen4 SSD",
      display: "14\" 2.8K (2880x1800) 90Hz OLED X-Rite Certified",
      battery: "63Wh (Up to 7.5 hrs)",
      weight: "3.28 lbs (1.49 kg)"
    },
    pros: ["Factory X-Rite Color Calibration", "NVIDIA Studio Certified", "Micro-SD Card Reader Slot"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },

  // --- WORK / BUSINESS CATEGORY ---
  {
    id: "laptop-w1",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    categories: ["work"],
    subcategories: ["office", "meetings", "browsing", "productivity", "battery-life"],
    budgetTier: "premium",
    price: "$1,749",
    numericPrice: 1749,
    rating: 4.9,
    recommendationScore: "97%",
    bestForBadge: "Best Executive Business Laptop",
    description: "Ultralight carbon-fiber build, 1080p FHD webcam with hardware privacy shutter, and robust enterprise security features.",
    specs: {
      cpu: "Intel Core i7-1365U vPro",
      gpu: "Intel Iris Xe Graphics",
      ram: "32GB LPDDR5",
      storage: "1TB PCIe Gen4 SSD",
      display: "14\" WUXGA (1920x1200) IPS Low Power 400 nits",
      battery: "57Wh (Up to 14 hrs battery life)",
      weight: "2.48 lbs (1.12 kg)"
    },
    pros: ["Featherlight Carbon Fiber 2.48 lbs", "Full-Day 14+ Hour Battery", "vPro Enterprise Security & Camera Shutter"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-w2",
    name: "LG Gram 16 (2026)",
    brand: "LG",
    categories: ["work", "study"],
    subcategories: ["office", "meetings", "productivity", "battery-life"],
    budgetTier: "midrange",
    price: "$1,199",
    numericPrice: 1199,
    rating: 4.8,
    recommendationScore: "96%",
    bestForBadge: "Best Large Screen Ultralight",
    description: "Huge 16-inch display weighing under 2.6 lbs with a massive 80Wh battery designed for endless airport layovers & meetings.",
    specs: {
      cpu: "Intel Core i7-1360P",
      gpu: "Intel Iris Xe Graphics",
      ram: "16GB LPDDR5",
      storage: "1TB NVMe SSD",
      display: "16\" WQXGA (2560x1600) Anti-glare IPS",
      battery: "80Wh (Up to 15 hrs battery)",
      weight: "2.64 lbs (1.19 kg)"
    },
    pros: ["Massive 16\" Screen at under 2.7 lbs", "Up to 15 Hours Battery", "Dual Thunderbolt 4 Ports"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  },
  {
    id: "laptop-w3",
    name: "Acer Swift Go 14",
    brand: "Acer",
    categories: ["work", "study"],
    subcategories: ["office", "browsing", "productivity"],
    budgetTier: "budget",
    price: "$649",
    numericPrice: 649,
    rating: 4.6,
    recommendationScore: "92%",
    bestForBadge: "Best Budget Office Workhorse",
    description: "Sleek aluminum body, 1440p QHD webcam for crisp Zoom calls, and fast 13th Gen Intel multi-tasking performance.",
    specs: {
      cpu: "Intel Core i5-1335U",
      gpu: "Intel Iris Xe Graphics",
      ram: "16GB LPDDR5",
      storage: "512GB PCIe Gen4 SSD",
      display: "14\" FHD+ (1920x1200) IPS 100% sRGB",
      battery: "65Wh (Up to 9.5 hrs battery)",
      weight: "2.76 lbs (1.25 kg)"
    },
    pros: ["Sharp 1440p Webcam for Meetings", "100% sRGB Color Coverage", "Dual Fan TwinAir Cooling"],
    affiliateUrl: "YOUR_AFFILIATE_LINK_HERE"
  }
];

// Priority Hierarchy Guidelines for specific use cases
const SPEC_GUIDES = {
  gaming: {
    title: "Gaming Laptop Priorities",
    priorityList: ["Dedicated GPU (RTX 40-Series)", "Cooling System & Thermals", "Display Refresh Rate (144Hz+)", "High-Clock CPU", "RAM (16GB Minimum)"],
    explanation: "For gaming, your graphics card (GPU) dictates 80% of your frame rates. Prioritize GPU power over CPU, and ensure the screen supports at least 144Hz refresh rates for smooth gameplay."
  },
  coding: {
    title: "Coding & Dev Priorities",
    priorityList: ["Fast Multi-Core CPU", "RAM (16GB - 32GB)", "Tactile Keyboard Comfort", "Long Battery Life", "Fast NVMe SSD"],
    explanation: "Developers need strong multi-core processing for compilation/Docker containers and high RAM to avoid swap memory slowdowns. A great keyboard prevents typing fatigue."
  },
  editing: {
    title: "Editing & Creator Priorities",
    priorityList: ["CPU & GPU Acceleration", "RAM (16GB - 32GB)", "Color Accurate Screen (sRGB/DCI-P3)", "High-Speed SSD Storage"],
    explanation: "4K timeline scrubbing and color grading require high RAM (32GB recommended for Premiere/Resolve) alongside high color accuracy displays (100% sRGB or DCI-P3 OLED)."
  },
  college: {
    title: "College & Student Priorities",
    priorityList: ["Battery Life (10+ Hours)", "Low Weight / Portability (<3.5 lbs)", "Reliable CPU Performance", "Budget Value"],
    explanation: "Students need a machine that survives all-day lectures without carrying a charger brick. Focus on lightweight ultrabooks with 10+ hour real-world battery life."
  }
};
