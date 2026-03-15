export type HomeProduct = {
  id: string;
  slug: string;
  category: string;
  description: string;
  name: string;
  image: string;
  price: number;
};

export type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

export const featuredProducts: HomeProduct[] = [
  {
    id: "p_1",
    slug: "aether-chronograph",
    category: "timepieces",
    description: "Swiss movement wrapped in sculpted steel with sapphire crystal.",
    name: "Aether Chronograph",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=900&auto=format&fit=crop",
    price: 24999
  },
  {
    id: "p_2",
    slug: "noir-weekender",
    category: "leather",
    description: "Full-grain leather weekender with handcrafted seams and brass fixtures.",
    name: "Noir Leather Weekender",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop",
    price: 18999
  },
  {
    id: "p_3",
    slug: "velvet-audio-studio",
    category: "audio",
    description: "Studio-tuned wireless system with precision ANC and spatial rendering.",
    name: "Velvet Audio Studio",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=900&auto=format&fit=crop",
    price: 21990
  },
  {
    id: "p_4",
    slug: "obsidian-smart-lamp",
    category: "interiors",
    description: "Matte-black lighting sculpture with adaptive scenes and warm diffusion.",
    name: "Obsidian Smart Lamp",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop",
    price: 7999
  },
  {
    id: "p_9",
    slug: "lumen-aviator-sunglasses",
    category: "eyewear",
    description: "Titanium aviator frame with polarized Zeiss lens coating.",
    name: "Lumen Aviator",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop",
    price: 10999
  },
  {
    id: "p_10",
    slug: "atlas-cabin-trolley",
    category: "travel",
    description: "Hard-shell cabin trolley with whisper wheels and TSA lock.",
    name: "Atlas Cabin Trolley",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&auto=format&fit=crop",
    price: 15999
  },
  {
    id: "p_11",
    slug: "arc-wireless-keyboard",
    category: "workspace",
    description: "Low-profile aluminum mechanical keyboard tuned for long sessions.",
    name: "Arc Wireless Keyboard",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop",
    price: 8990
  },
  {
    id: "p_12",
    slug: "aura-recovery-massager",
    category: "wellness",
    description: "Deep tissue recovery massager with adaptive pulse control.",
    name: "Aura Recovery Massager",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=900&auto=format&fit=crop",
    price: 12990
  },
  {
    id: "p_13",
    slug: "zen-noise-cancel-earbuds",
    category: "audio",
    description: "Pocket ANC earbuds with 32-hour battery and spatial EQ.",
    name: "Zen ANC Earbuds",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop",
    price: 9990
  }
];

export const catalogProducts: HomeProduct[] = [
  ...featuredProducts,
  {
    id: "p_5",
    slug: "atlas-travel-wallet",
    category: "leather",
    description: "RFID-safe travel wallet in vegetable-tanned leather.",
    name: "Atlas Travel Wallet",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop",
    price: 4999
  },
  {
    id: "p_6",
    slug: "halo-desk-speakers",
    category: "audio",
    description: "Dual-driver desktop speakers tuned for cinematic clarity.",
    name: "Halo Desk Speakers",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop",
    price: 12999
  },
  {
    id: "p_7",
    slug: "aurelia-ring-light",
    category: "interiors",
    description: "Modern ring light with ambient and focus modes for workspaces.",
    name: "Aurelia Ring Light",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&auto=format&fit=crop",
    price: 8999
  },
  {
    id: "p_8",
    slug: "strata-automatic-watch",
    category: "timepieces",
    description: "Self-winding automatic watch with exhibition caseback.",
    name: "Strata Automatic Watch",
    image:
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900&auto=format&fit=crop",
    price: 31999
  },
  {
    id: "p_14",
    slug: "solstice-wall-clock",
    category: "interiors",
    description: "Silent sweep statement wall clock in brushed brass.",
    name: "Solstice Wall Clock",
    image:
      "https://images.unsplash.com/photo-1509048191080-d2cfb7b9cd34?w=900&auto=format&fit=crop",
    price: 6499
  },
  {
    id: "p_15",
    slug: "noir-passport-folio",
    category: "travel",
    description: "Passport and document folio in full-grain nappa leather.",
    name: "Noir Passport Folio",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop",
    price: 5499
  },
  {
    id: "p_16",
    slug: "echelon-monitor-light",
    category: "workspace",
    description: "Asymmetric monitor light bar with flicker-free illumination.",
    name: "Echelon Monitor Light",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&auto=format&fit=crop",
    price: 4990
  },
  {
    id: "p_17",
    slug: "pulse-smart-bottle",
    category: "wellness",
    description: "Insulated smart bottle with hydration reminders.",
    name: "Pulse Smart Bottle",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=900&auto=format&fit=crop",
    price: 3990
  },
  {
    id: "p_18",
    slug: "aurora-blue-light-glasses",
    category: "eyewear",
    description: "Blue light filter glasses for coding and work sessions.",
    name: "Aurora Blue-Light Glasses",
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=900&auto=format&fit=crop",
    price: 5990
  },
  {
    id: "p_19",
    slug: "halo-precision-mouse",
    category: "workspace",
    description: "Ergonomic wireless mouse with ultra-precise optical sensor.",
    name: "Halo Precision Mouse",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop",
    price: 6990
  },
  {
    id: "p_20",
    slug: "vantage-desk-stand",
    category: "workspace",
    description: "Dual-angle aluminum stand for tablets and ultrabooks.",
    name: "Vantage Desk Stand",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&auto=format&fit=crop",
    price: 4590
  },
  {
    id: "p_21",
    slug: "orion-weekend-duffel",
    category: "travel",
    description: "Water-resistant duffel with modular interior straps.",
    name: "Orion Weekend Duffel",
    image:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=900&auto=format&fit=crop",
    price: 13990
  },
  {
    id: "p_22",
    slug: "serif-reading-lamp",
    category: "interiors",
    description: "Architectural reading lamp with warm dimmable glow.",
    name: "Serif Reading Lamp",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop",
    price: 8490
  },
  {
    id: "p_23",
    slug: "voyage-sleep-mask-pro",
    category: "wellness",
    description: "Contoured sleep mask with cooling gel layer.",
    name: "Voyage Sleep Mask Pro",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&auto=format&fit=crop",
    price: 2990
  },
  {
    id: "p_24",
    slug: "drift-audio-soundbar",
    category: "audio",
    description: "Compact Dolby-ready soundbar tuned for living spaces.",
    name: "Drift Audio Soundbar",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?w=900&auto=format&fit=crop",
    price: 18990
  },
  {
    id: "p_25",
    slug: "ion-fitness-tracker",
    category: "wellness",
    description: "Minimal fitness tracker with sleep and recovery analytics.",
    name: "Ion Fitness Tracker",
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop",
    price: 7990
  },
  {
    id: "p_26",
    slug: "helix-round-frame-glasses",
    category: "eyewear",
    description: "Hand-finished round optical frame in matte steel.",
    name: "Helix Round Frame",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop",
    price: 7490
  },
  {
    id: "p_27",
    slug: "summit-carry-on-backpack",
    category: "travel",
    description: "Carry-on compliant travel backpack with smart compartments.",
    name: "Summit Carry-On Backpack",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
    price: 11990
  },
  {
    id: "p_28",
    slug: "flux-desk-speaker-pair",
    category: "audio",
    description: "Balanced near-field desk speakers with USB-C input.",
    name: "Flux Desk Speaker Pair",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop",
    price: 14990
  },
  {
    id: "p_29",
    slug: "ember-aroma-diffuser",
    category: "interiors",
    description: "Ceramic aroma diffuser with app-controlled schedules.",
    name: "Ember Aroma Diffuser",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop",
    price: 5690
  },
  {
    id: "p_30",
    slug: "arc-commuter-wallet",
    category: "leather",
    description: "Slim commuter wallet with RFID lining and coin sleeve.",
    name: "Arc Commuter Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop",
    price: 4290
  }
];

export const luxuryCategories: HomeCategory[] = [
  {
    id: "c_1",
    name: "Timepieces",
    slug: "timepieces",
    image:
      "https://images.unsplash.com/photo-1509048191080-d2cfb7b9cd34?w=900&auto=format&fit=crop",
    description: "Precision-engineered watches and signatures."
  },
  {
    id: "c_2",
    name: "Audio",
    slug: "audio",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop",
    description: "Immersive sound systems with refined design."
  },
  {
    id: "c_3",
    name: "Leather",
    slug: "leather",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&auto=format&fit=crop",
    description: "Bags and accessories crafted for permanence."
  },
  {
    id: "c_4",
    name: "Interiors",
    slug: "interiors",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop",
    description: "Lighting and objects that anchor modern living spaces."
  },
  {
    id: "c_5",
    name: "Eyewear",
    slug: "eyewear",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop",
    description: "Optical and sun frames with precision materials."
  },
  {
    id: "c_6",
    name: "Travel",
    slug: "travel",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&auto=format&fit=crop",
    description: "Durable travel systems built for movement and structure."
  },
  {
    id: "c_7",
    name: "Workspace",
    slug: "workspace",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
    description: "Tools and desk essentials for deep focus performance."
  },
  {
    id: "c_8",
    name: "Wellness",
    slug: "wellness",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop",
    description: "Recovery and wellbeing products with premium design language."
  }
];
