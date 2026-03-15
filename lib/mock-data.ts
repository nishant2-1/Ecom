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
  }
];
