import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        taggings: {
          where: { taggable_type: "Post" },
          select: { taggable_id: true },
        },
      },
    });

    const publishedPostIds = new Set(
      (await prisma.post.findMany({
        where: { draft: false },
        select: { id: true },
      })).map((p) => p.id)
    );

    return Response.json(
      tags.map((t) => ({
        id: String(t.id),
        name: t.name,
        count: t.taggings.filter(
          (tg) => tg.taggable_id !== null && publishedPostIds.has(tg.taggable_id)
        ).length,
      }))
    );
  } catch {
    return createErrorResponse("Erreur serveur", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  const rateLimitResult = rateLimit(
    `admin:${session.user?.id}`,
    RATE_LIMITS.adminApi
  );
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.resetIn);
  }

  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return createErrorResponse("Nom du tag requis", 400);
    }

    const trimmed = name.trim();

    if (trimmed.length > 100) {
      return createErrorResponse("Le nom ne peut pas dépasser 100 caractères", 400);
    }

    const existing = await prisma.tag.findMany();
    const duplicate = existing.find(
      (t) => t.name?.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      return createErrorResponse("Ce tag existe déjà", 409);
    }

    const tag = await prisma.tag.create({
      data: { name: trimmed, taggings_count: 0 },
    });

    logger.info("Tag créé", {
      action: "create_tag",
      tagId: String(tag.id),
      userId: session.user?.id,
    });

    return Response.json({
      id: String(tag.id),
      name: tag.name,
      count: tag.taggings_count,
    });
  } catch {
    return createErrorResponse("Erreur serveur", 500);
  }
}
