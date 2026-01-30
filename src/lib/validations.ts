import { z } from "zod";

// Schéma pour la création/mise à jour de posts
export const postSchema = z.object({
  title: z
    .string()
    .max(500, "Le titre ne peut pas dépasser 500 caractères")
    .optional()
    .nullable(),
  slug: z
    .string()
    .max(200, "Le slug ne peut pas dépasser 200 caractères")
    .regex(/^[a-z0-9-]*$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets")
    .optional()
    .nullable()
    .transform((val) => val === "" ? null : val),
  description: z
    .string()
    .max(50000, "La description ne peut pas dépasser 50000 caractères")
    .optional()
    .nullable(),
  source: z
    .string()
    .max(10000, "Le champ source ne peut pas dépasser 10000 caractères")
    .optional()
    .nullable(),
  script: z
    .string()
    .max(10000, "Le champ script ne peut pas dépasser 10000 caractères")
    .optional()
    .nullable(),
  date: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Format de date invalide"
    ),
  draft: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  alt_text: z
    .string()
    .max(500, "Le texte alternatif ne peut pas dépasser 500 caractères")
    .optional()
    .nullable(),
  order_number: z.number().int().positive().optional().nullable(),
});

// Schéma pour la mise à jour partielle (tous les champs optionnels)
export const postUpdateSchema = postSchema.partial();

// Schéma pour l'ID (BigInt)
export const idSchema = z
  .string()
  .regex(/^\d+$/, "ID invalide")
  .transform((val) => BigInt(val));

// Schéma pour le réordonnement
export const reorderSchema = z.object({
  orderedIds: z
    .array(z.string().regex(/^\d+$/, "ID invalide"))
    .min(1, "Au moins un ID requis")
    .max(1000, "Trop d'éléments"),
});

// Type exportés
export type PostInput = z.infer<typeof postSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
