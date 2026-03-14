import { PrismaClient } from "@prisma/client";

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
