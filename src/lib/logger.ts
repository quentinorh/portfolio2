// Logger sécurisé pour la production
// Ne log pas les détails sensibles et masque les erreurs en production

const isDev = process.env.NODE_ENV === "development";

interface LogContext {
  action?: string;
  userId?: string;
  ip?: string;
  [key: string]: unknown;
}

function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // En production, ne pas exposer les stack traces
    return isDev ? error.stack || error.message : error.message;
  }
  return String(error);
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(JSON.stringify({
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      ...context,
    }));
  },

  warn(message: string, context?: LogContext) {
    console.warn(JSON.stringify({
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      ...context,
    }));
  },

  error(message: string, error?: unknown, context?: LogContext) {
    console.error(JSON.stringify({
      level: "error",
      message,
      error: error ? sanitizeError(error) : undefined,
      timestamp: new Date().toISOString(),
      ...context,
    }));
  },

  // Log des tentatives de connexion (pour détecter les attaques)
  authAttempt(email: string, success: boolean, ip?: string) {
    // Ne pas logger l'email complet pour la confidentialité
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
    this.info(success ? "Auth success" : "Auth failed", {
      action: "auth_attempt",
      email: maskedEmail,
      success: String(success),
      ip: ip || "unknown",
    });
  },
};

// Réponse d'erreur générique pour la production
export function createErrorResponse(
  message: string,
  status: number,
  details?: string
) {
  return Response.json(
    {
      error: message,
      // Ne pas exposer les détails en production
      ...(isDev && details ? { details } : {}),
    },
    { status }
  );
}
