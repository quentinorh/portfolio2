import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validations";
import { logger, createErrorResponse } from "@/lib/logger";
import { rateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit";
import { ZodError } from "zod";
import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_FOLDER =
  process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "production";

function checkAuthAndRateLimit() {
  return (async () => {
    const session = await auth();
    if (!session) {
      return { error: createErrorResponse("Non autorisé", 401) };
    }
    const rateLimitResult = rateLimit(
      `admin:${session.user?.id}`,
      RATE_LIMITS.adminApi
    );
    if (!rateLimitResult.success) {
      return { error: createRateLimitResponse(rateLimitResult.resetIn) };
    }
    return { session };
  })();
}

// POST - Upload une nouvelle photo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await checkAuthAndRateLimit();
  if (error) return error;

  // CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
  if (!process.env.CLOUDINARY_URL) {
    return createErrorResponse(
      "Cloudinary non configuré (CLOUDINARY_URL requis pour l'upload)",
      500
    );
  }
  // Le SDK Cloudinary détecte automatiquement CLOUDINARY_URL

  try {
    const { id: rawId } = await params;
    const id = idSchema.parse(rawId);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return createErrorResponse("Post non trouvé", 404);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof Blob)) {
      return createErrorResponse("Fichier requis", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type || "image/jpeg"};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_FOLDER,
      resource_type: "image",
    });

    const blob = await prisma.activeStorageBlob.create({
      data: {
        key: uploadResult.public_id,
        filename: file.name || "image",
        content_type: file.type || "image/jpeg",
        metadata: null,
        service_name: "cloudinary",
        byte_size: BigInt(uploadResult.bytes ?? buffer.length),
        checksum: null,
      },
    });

    await prisma.activeStorageAttachment.create({
      data: {
        name: "photos",
        record_type: "Post",
        record_id: id,
        blob_id: blob.id,
      },
    });

    logger.info("Photo ajoutée au post", {
      action: "upload_photo",
      postId: String(id),
      userId: session.user?.id,
    });

    return Response.json({
      success: true,
      key: blob.key,
      blobId: String(blob.id),
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return createErrorResponse("ID invalide", 400);
    }
    logger.error("Erreur upload photo", err, { action: "upload_photo" });
    return createErrorResponse("Erreur lors de l'upload", 500);
  }
}
