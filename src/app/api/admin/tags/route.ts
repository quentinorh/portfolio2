import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createErrorResponse } from "@/lib/logger";

export async function GET() {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { taggings_count: "desc" },
    });

    return Response.json(
      tags.map((t) => ({
        id: String(t.id),
        name: t.name,
        count: t.taggings_count,
      }))
    );
  } catch {
    return createErrorResponse("Erreur serveur", 500);
  }
}
