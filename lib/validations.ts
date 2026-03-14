import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email")
});

export const addressSchema = z.object({
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(4),
  country: z.string().min(2)
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().positive()
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: addressSchema,
  promoCode: z.string().optional()
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string().url()).min(1),
  categoryId: z.string().min(1),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false)
});
