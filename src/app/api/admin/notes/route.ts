import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createErrorResponse } from "@/lib/logger";

const NOTES_KEY = "admin_personal_notes";

// Crée la table settings si elle n'existe pas
async function ensureSettingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS settings (
      id BIGSERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// GET - Récupérer les notes personnelles
export async function GET() {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    await ensureSettingsTable();
    
    const result = await prisma.$queryRawUnsafe<{ value: string | null }[]>(
      `SELECT value FROM settings WHERE key = $1 LIMIT 1`,
      NOTES_KEY
    );

    return Response.json({ notes: result[0]?.value ?? "" });
  } catch (err) {
    console.error("Erreur GET notes", err);
    return createErrorResponse("Erreur serveur", 500);
  }
}

// PUT - Sauvegarder les notes personnelles
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return createErrorResponse("Non autorisé", 401);
  }

  try {
    await ensureSettingsTable();
    
    const body = await request.json();
    const notes = typeof body.notes === "string" ? body.notes : "";

    await prisma.$executeRawUnsafe(
      `INSERT INTO settings (key, value, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      NOTES_KEY,
      notes
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Erreur PUT notes", err);
    return createErrorResponse("Erreur serveur", 500);
  }
}
