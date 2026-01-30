import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";
import { ZodError } from "zod";

// GET - Liste tous les posts (y compris brouillons)
export async function GET() {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: [
        { order_number: { sort: "asc", nulls: "last" } },
        { id: "asc" },
      ],
      take: 500, // Limite de sécurité
    });

    // Récupérer les tags pour tous les posts
    const postIds = posts.map((p) => p.id);
    const taggings = await prisma.tagging.findMany({
      where: {
        taggable_type: "Post",
        taggable_id: { in: postIds },
      },
      include: {
        tag: true,
      },
    });

    // Grouper les tags par post
    const tagsByPostId = new Map<string, string[]>();
    for (const tagging of taggings) {
      if (tagging.taggable_id && tagging.tag?.name) {
        const postId = String(tagging.taggable_id);
        if (!tagsByPostId.has(postId)) {
          tagsByPostId.set(postId, []);
        }
        tagsByPostId.get(postId)!.push(tagging.tag.name);
      }
    }

    // Convertir BigInt en string pour JSON et ajouter les tags
    const serializedPosts = posts.map((post) => ({
      ...post,
      id: String(post.id),
      tags: tagsByPostId.get(String(post.id)) || [],
    }));

    return Response.json(serializedPosts);
  } catch (err) {
    logger.error("Erreur GET posts", err, { action: "get_posts" });
    return createErrorResponse("Erreur serveur", 500);
  }
}

// POST - Créer un nouveau post
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  // Rate limiting par utilisateur
  const rateLimitResult = rateLimit(
    `admin:${session.user?.id}`,
    RATE_LIMITS.adminApi
  );
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetIn);
  }

  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = postSchema.parse(body);

    // Calculer le prochain order_number
    const maxOrder = await prisma.post.aggregate({
      _max: { order_number: true },
    });
    const nextOrder = (maxOrder._max.order_number ?? 0) + 1;

    const post = await prisma.post.create({
      data: {
        title: validatedData.title || null,
        description: validatedData.description || null,
        source: validatedData.source || null,
        script: validatedData.script || null,
        date: validatedData.date ? new Date(validatedData.date) : null,
        draft: validatedData.draft ?? true,
        featured: validatedData.featured ?? false,
        slug: validatedData.slug || null,
        alt_text: validatedData.alt_text || null,
        order_number: nextOrder,
      },
    });

    logger.info("Post créé", { 
      action: "create_post", 
      postId: String(post.id),
      userId: session.user?.id,
    });

    return Response.json({
      ...post,
      id: String(post.id),
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse(
        "Données invalides",
        400,
        err.issues.map((e) => e.message).join(", ")
      );
    }
    logger.error("Erreur POST post", err, { action: "create_post" });
    return createErrorResponse("Erreur serveur", 500);
  }
}
