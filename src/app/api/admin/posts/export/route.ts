import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createErrorResponse } from "@/lib/logger";

// GET - Exporter tous les posts en format Markdown
export async function GET() {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        draft: false, // Seulement les posts publiés
      },
      orderBy: [
        { order_number: { sort: "asc", nulls: "last" } },
        { id: "asc" },
      ],
      select: {
        title: true,
        description: true,
      },
    });

    // Générer le markdown
    const markdown = posts
      .map((post) => {
        const title = post.title || "Sans titre";
        const content = post.description || "";
        return `# ${title}\n${content}`;
      })
      .join("\n\n");

    return Response.json({ markdown });
  } catch (err) {
    console.error("Erreur export posts", err);
    return createErrorResponse("Erreur serveur", 500);
  }
}
