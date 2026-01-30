import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reorderSchema } from "@/lib/validations";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";
import { ZodError } from "zod";

// POST - Réordonner les posts
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
    const { orderedIds } = reorderSchema.parse(body);

    // Vérifier que tous les IDs existent
    const existingPosts = await prisma.post.findMany({
      where: {
        id: { in: orderedIds.map((id) => BigInt(id)) },
      },
      select: { id: true },
    });

    if (existingPosts.length !== orderedIds.length) {
      return createErrorResponse(
        "Certains posts n'existent pas",
        400
      );
    }

    // Mettre à jour l'ordre de chaque post
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.post.update({
          where: { id: BigInt(id) },
          data: { order_number: index + 1 },
        })
      )
    );

    logger.info("Posts réordonnés", { 
      action: "reorder_posts", 
      count: orderedIds.length,
      userId: session.user?.id,
    });

    return Response.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse(
        "Données invalides",
        400,
        err.issues.map((e) => e.message).join(", ")
      );
    }
    logger.error("Erreur reorder posts", err, { action: "reorder_posts" });
    return createErrorResponse("Erreur serveur", 500);
  }
}
