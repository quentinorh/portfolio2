/**
 * Utilitaires Cloudinary pour l'optimisation des images
 * 
 * Transformations appliquées :
 * - f_auto : Format automatique (WebP/AVIF selon le navigateur)
 * - q_auto : Qualité automatique optimisée
 * - c_fill : Recadrage intelligent
 * - w_XXX : Largeur spécifiée
 * - dpr_auto : Densité de pixels automatique pour Retina
 */

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "production";

export type ImageSize = "thumbnail" | "card" | "hero" | "gallery" | "full";

// Configurations de tailles prédéfinies (largeur en pixels)
const IMAGE_SIZES: Record<ImageSize, { width: number; height?: number }> = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 600, height: 450 },      // Ratio 4:3 pour les cartes
  hero: { width: 1200, height: 600 },     // Image hero large
  gallery: { width: 800 },                 // Galerie (hauteur auto)
  full: { width: 1600 },                   // Grande taille
};

/**
 * Génère une URL Cloudinary optimisée
 */
export function getCloudinaryUrl(
  key: string | null | undefined,
  size: ImageSize = "card"
): string | null {
  if (!key || !CLOUDINARY_CLOUD) return null;

  const publicId = key.startsWith(CLOUDINARY_FOLDER + "/") 
    ? key 
    : `${CLOUDINARY_FOLDER}/${key}`;

  const config = IMAGE_SIZES[size];
  
  // Construire les transformations
  const transforms = [
    "f_auto",           // Format auto (WebP/AVIF)
    "q_auto:eco",       // Qualité auto mode éco (plus léger)
    `w_${config.width}`,
    config.height ? `h_${config.height}` : null,
    config.height ? "c_fill" : "c_limit", // fill si hauteur, limit sinon
    "g_auto",           // Gravité auto (centre d'intérêt)
  ].filter(Boolean).join(",");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transforms}/${publicId}`;
}

/**
 * Génère une URL Cloudinary simple (sans transformations fixes de dimension)
 * Utile quand Next/Image gère l'optimisation
 */
export function getCloudinaryUrlRaw(
  key: string | null | undefined
): string | null {
  if (!key || !CLOUDINARY_CLOUD) return null;

  const publicId = key.startsWith(CLOUDINARY_FOLDER + "/") 
    ? key 
    : `${CLOUDINARY_FOLDER}/${key}`;

  // Seulement format et qualité auto, pas de redimensionnement
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto:eco/${publicId}`;
}

/**
 * Génère un srcset pour images responsives
 */
export function getCloudinarySrcSet(
  key: string | null | undefined,
  baseWidth: number = 600
): string | null {
  if (!key || !CLOUDINARY_CLOUD) return null;

  const publicId = key.startsWith(CLOUDINARY_FOLDER + "/") 
    ? key 
    : `${CLOUDINARY_FOLDER}/${key}`;

  // Générer des tailles pour différentes densités d'écran
  const widths = [
    Math.round(baseWidth * 0.5),  // 50%
    baseWidth,                      // 100%
    Math.round(baseWidth * 1.5),  // 150%
    baseWidth * 2,                  // 200% (Retina)
  ];

  return widths.map(w => {
    const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto:eco,w_${w},c_limit/${publicId}`;
    return `${url} ${w}w`;
  }).join(", ");
}

/**
 * Retourne l'URL de base Cloudinary pour le preconnect
 */
export function getCloudinaryBaseUrl(): string {
  return `https://res.cloudinary.com`;
}

/**
 * Génère le placeholder blur pour Next/Image (tiny image base64)
 */
export function getBlurPlaceholder(key: string | null | undefined): string | null {
  if (!key || !CLOUDINARY_CLOUD) return null;

  const publicId = key.startsWith(CLOUDINARY_FOLDER + "/") 
    ? key 
    : `${CLOUDINARY_FOLDER}/${key}`;

  // Image minuscule pour le placeholder
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_10,w_20,e_blur:1000/${publicId}`;
}
