import { PrismaClient } from "../node_modules/.prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: { email: "admin@shopnova.dev" },
    update: { role: "ADMIN", name: "ShopNova Admin" },
    create: {
      name: "ShopNova Admin",
      email: "admin@shopnova.dev",
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "user@shopnova.dev" },
    update: { role: "USER", name: "ShopNova User" },
    create: {
      name: "ShopNova User",
      email: "user@shopnova.dev",
      role: "USER"
    }
  });

  const categories = [
    {
      id: "c_1",
      name: "Timepieces",
      slug: "timepieces",
      image: "https://images.unsplash.com/photo-1509048191080-d2cfb7b9cd34"
    },
    {
      id: "c_2",
      name: "Audio",
      slug: "audio",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944"
    },
    {
      id: "c_3",
      name: "Leather",
      slug: "leather",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7"
    },
    {
      id: "c_4",
      name: "Interiors",
      slug: "interiors",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15"
    },
    {
      id: "c_5",
      name: "Eyewear",
      slug: "eyewear",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
    },
    {
      id: "c_6",
      name: "Travel",
      slug: "travel",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd"
    },
    {
      id: "c_7",
      name: "Workspace",
      slug: "workspace",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    },
    {
      id: "c_8",
      name: "Wellness",
      slug: "wellness",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a"
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        slug: category.slug,
        image: category.image
      },
      create: category
    });
  }

  const products = [
    {
      id: "p_1",
      name: "Aether Chronograph",
      slug: "aether-chronograph",
      description: "Swiss movement wrapped in sculpted steel with sapphire crystal.",
      price: 24999,
      comparePrice: 28999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3"]),
      categoryId: "c_1",
      stock: 12,
      featured: true
    },
    {
      id: "p_2",
      name: "Noir Leather Weekender",
      slug: "noir-weekender",
      description: "Full-grain leather weekender with handcrafted seams and brass fixtures.",
      price: 18999,
      comparePrice: 21999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]),
      categoryId: "c_3",
      stock: 18,
      featured: true
    },
    {
      id: "p_3",
      name: "Velvet Audio Studio",
      slug: "velvet-audio-studio",
      description: "Studio-tuned wireless system with precision ANC and spatial rendering.",
      price: 21990,
      comparePrice: 25990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"]),
      categoryId: "c_2",
      stock: 20,
      featured: true
    },
    {
      id: "p_4",
      name: "Obsidian Smart Lamp",
      slug: "obsidian-smart-lamp",
      description: "Matte-black lighting sculpture with adaptive scenes and warm diffusion.",
      price: 7999,
      comparePrice: 9999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15"]),
      categoryId: "c_4",
      stock: 35,
      featured: true
    },
    {
      id: "p_9",
      name: "Lumen Aviator",
      slug: "lumen-aviator-sunglasses",
      description: "Titanium aviator frame with polarized Zeiss lens coating.",
      price: 10999,
      comparePrice: 12999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1511499767150-a48a237f0083"]),
      categoryId: "c_5",
      stock: 34,
      featured: true
    },
    {
      id: "p_10",
      name: "Atlas Cabin Trolley",
      slug: "atlas-cabin-trolley",
      description: "Hard-shell cabin trolley with whisper wheels and TSA lock.",
      price: 15999,
      comparePrice: 18999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1502920917128-1aa500764cbd"]),
      categoryId: "c_6",
      stock: 24,
      featured: true
    },
    {
      id: "p_11",
      name: "Arc Wireless Keyboard",
      slug: "arc-wireless-keyboard",
      description: "Low-profile aluminum mechanical keyboard tuned for long sessions.",
      price: 8990,
      comparePrice: 10990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"]),
      categoryId: "c_7",
      stock: 42,
      featured: true
    },
    {
      id: "p_12",
      name: "Aura Recovery Massager",
      slug: "aura-recovery-massager",
      description: "Deep tissue recovery massager with adaptive pulse control.",
      price: 12990,
      comparePrice: 14990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1599058917212-d750089bc07e"]),
      categoryId: "c_8",
      stock: 28,
      featured: true
    },
    {
      id: "p_13",
      name: "Zen ANC Earbuds",
      slug: "zen-noise-cancel-earbuds",
      description: "Pocket ANC earbuds with 32-hour battery and spatial EQ.",
      price: 9990,
      comparePrice: 11990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1590658268037-6bf12165a8df"]),
      categoryId: "c_2",
      stock: 58,
      featured: true
    },
    {
      id: "p_5",
      name: "Atlas Travel Wallet",
      slug: "atlas-travel-wallet",
      description: "RFID-safe travel wallet in vegetable-tanned leather.",
      price: 4999,
      comparePrice: 6499,
      images: JSON.stringify(["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"]),
      categoryId: "c_3",
      stock: 60,
      featured: false
    },
    {
      id: "p_6",
      name: "Halo Desk Speakers",
      slug: "halo-desk-speakers",
      description: "Dual-driver desktop speakers tuned for cinematic clarity.",
      price: 12999,
      comparePrice: 14999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1545454675-3531b543be5d"]),
      categoryId: "c_2",
      stock: 26,
      featured: false
    },
    {
      id: "p_7",
      name: "Aurelia Ring Light",
      slug: "aurelia-ring-light",
      description: "Modern ring light with ambient and focus modes for workspaces.",
      price: 8999,
      comparePrice: 10999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1540932239986-30128078f3c5"]),
      categoryId: "c_4",
      stock: 40,
      featured: false
    },
    {
      id: "p_8",
      name: "Strata Automatic Watch",
      slug: "strata-automatic-watch",
      description: "Self-winding automatic watch with exhibition caseback.",
      price: 31999,
      comparePrice: 35999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"]),
      categoryId: "c_1",
      stock: 8,
      featured: true
    },
    {
      id: "p_14",
      name: "Solstice Wall Clock",
      slug: "solstice-wall-clock",
      description: "Silent sweep statement wall clock in brushed brass.",
      price: 6499,
      comparePrice: 7999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1509048191080-d2cfb7b9cd34"]),
      categoryId: "c_4",
      stock: 36,
      featured: false
    },
    {
      id: "p_15",
      name: "Noir Passport Folio",
      slug: "noir-passport-folio",
      description: "Passport and document folio in full-grain nappa leather.",
      price: 5499,
      comparePrice: 6999,
      images: JSON.stringify(["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"]),
      categoryId: "c_6",
      stock: 44,
      featured: false
    },
    {
      id: "p_16",
      name: "Echelon Monitor Light",
      slug: "echelon-monitor-light",
      description: "Asymmetric monitor light bar with flicker-free illumination.",
      price: 4990,
      comparePrice: 6290,
      images: JSON.stringify(["https://images.unsplash.com/photo-1545239351-1141bd82e8a6"]),
      categoryId: "c_7",
      stock: 50,
      featured: false
    },
    {
      id: "p_17",
      name: "Pulse Smart Bottle",
      slug: "pulse-smart-bottle",
      description: "Insulated smart bottle with hydration reminders.",
      price: 3990,
      comparePrice: 4990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1523362628745-0c100150b504"]),
      categoryId: "c_8",
      stock: 68,
      featured: false
    },
    {
      id: "p_18",
      name: "Aurora Blue-Light Glasses",
      slug: "aurora-blue-light-glasses",
      description: "Blue light filter glasses for coding and work sessions.",
      price: 5990,
      comparePrice: 7590,
      images: JSON.stringify(["https://images.unsplash.com/photo-1577803645773-f96470509666"]),
      categoryId: "c_5",
      stock: 46,
      featured: false
    },
    {
      id: "p_19",
      name: "Halo Precision Mouse",
      slug: "halo-precision-mouse",
      description: "Ergonomic wireless mouse with ultra-precise optical sensor.",
      price: 6990,
      comparePrice: 8490,
      images: JSON.stringify(["https://images.unsplash.com/photo-1587829741301-dc798b83add3"]),
      categoryId: "c_7",
      stock: 54,
      featured: false
    },
    {
      id: "p_20",
      name: "Vantage Desk Stand",
      slug: "vantage-desk-stand",
      description: "Dual-angle aluminum stand for tablets and ultrabooks.",
      price: 4590,
      comparePrice: 5590,
      images: JSON.stringify(["https://images.unsplash.com/photo-1593642632823-8f785ba67e45"]),
      categoryId: "c_7",
      stock: 63,
      featured: false
    },
    {
      id: "p_21",
      name: "Orion Weekend Duffel",
      slug: "orion-weekend-duffel",
      description: "Water-resistant duffel with modular interior straps.",
      price: 13990,
      comparePrice: 16990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1511556820780-d912e42b4980"]),
      categoryId: "c_6",
      stock: 26,
      featured: false
    },
    {
      id: "p_22",
      name: "Serif Reading Lamp",
      slug: "serif-reading-lamp",
      description: "Architectural reading lamp with warm dimmable glow.",
      price: 8490,
      comparePrice: 9990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"]),
      categoryId: "c_4",
      stock: 31,
      featured: false
    },
    {
      id: "p_23",
      name: "Voyage Sleep Mask Pro",
      slug: "voyage-sleep-mask-pro",
      description: "Contoured sleep mask with cooling gel layer.",
      price: 2990,
      comparePrice: 3990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1571781926291-c477ebfd024b"]),
      categoryId: "c_8",
      stock: 77,
      featured: false
    },
    {
      id: "p_24",
      name: "Drift Audio Soundbar",
      slug: "drift-audio-soundbar",
      description: "Compact Dolby-ready soundbar tuned for living spaces.",
      price: 18990,
      comparePrice: 22990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1558089687-f282ffcbc0d4"]),
      categoryId: "c_2",
      stock: 23,
      featured: false
    },
    {
      id: "p_25",
      name: "Ion Fitness Tracker",
      slug: "ion-fitness-tracker",
      description: "Minimal fitness tracker with sleep and recovery analytics.",
      price: 7990,
      comparePrice: 9590,
      images: JSON.stringify(["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1"]),
      categoryId: "c_8",
      stock: 35,
      featured: false
    },
    {
      id: "p_26",
      name: "Helix Round Frame",
      slug: "helix-round-frame-glasses",
      description: "Hand-finished round optical frame in matte steel.",
      price: 7490,
      comparePrice: 8990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1511499767150-a48a237f0083"]),
      categoryId: "c_5",
      stock: 38,
      featured: false
    },
    {
      id: "p_27",
      name: "Summit Carry-On Backpack",
      slug: "summit-carry-on-backpack",
      description: "Carry-on compliant travel backpack with smart compartments.",
      price: 11990,
      comparePrice: 13990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"]),
      categoryId: "c_6",
      stock: 41,
      featured: false
    },
    {
      id: "p_28",
      name: "Flux Desk Speaker Pair",
      slug: "flux-desk-speaker-pair",
      description: "Balanced near-field desk speakers with USB-C input.",
      price: 14990,
      comparePrice: 17990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1545454675-3531b543be5d"]),
      categoryId: "c_2",
      stock: 27,
      featured: false
    },
    {
      id: "p_29",
      name: "Ember Aroma Diffuser",
      slug: "ember-aroma-diffuser",
      description: "Ceramic aroma diffuser with app-controlled schedules.",
      price: 5690,
      comparePrice: 6990,
      images: JSON.stringify(["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15"]),
      categoryId: "c_4",
      stock: 47,
      featured: false
    },
    {
      id: "p_30",
      name: "Arc Commuter Wallet",
      slug: "arc-commuter-wallet",
      description: "Slim commuter wallet with RFID lining and coin sleeve.",
      price: 4290,
      comparePrice: 5290,
      images: JSON.stringify(["https://images.unsplash.com/photo-1627123424574-724758594e93"]),
      categoryId: "c_3",
      stock: 56,
      featured: false
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images as string,
        categoryId: product.categoryId,
        stock: product.stock,
        featured: product.featured
      },
      create: product
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
