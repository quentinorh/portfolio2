// Rate limiter simple en mémoire
// Pour une application en production à grande échelle, utiliser Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Stockage en mémoire (sera réinitialisé au redémarrage du serveur)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Nettoyer les entrées expirées périodiquement
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Nettoyer toutes les minutes

interface RateLimitOptions {
  // Nombre maximum de requêtes
  limit: number;
  // Fenêtre de temps en secondes
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // secondes avant reset
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const key = identifier;

  const entry = rateLimitStore.get(key);

  // Nouvelle entrée ou entrée expirée
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: options.limit - 1,
      resetIn: options.windowSeconds,
    };
  }

  // Entrée existante
  if (entry.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Incrémenter le compteur
  entry.count++;
  return {
    success: true,
    remaining: options.limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

// Configurations prédéfinies
export const RATE_LIMITS = {
  // Connexion : 5 tentatives par minute par IP
  login: { limit: 5, windowSeconds: 60 },
  // API admin : 100 requêtes par minute par utilisateur
  adminApi: { limit: 100, windowSeconds: 60 },
  // API publique : 200 requêtes par minute par IP
  publicApi: { limit: 200, windowSeconds: 60 },
};

// Helper pour obtenir l'IP du client
export function getClientIp(request: Request): string {
  // Headers standards pour les proxies
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback
  return "unknown";
}

// Helper pour créer une réponse de rate limit
export function createRateLimitResponse(resetIn: number) {
  return new Response(
    JSON.stringify({
      error: "Trop de requêtes. Réessayez plus tard.",
      retryAfter: resetIn,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(resetIn),
      },
    }
  );
}
