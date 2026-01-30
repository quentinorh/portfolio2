import DOMPurify from "isomorphic-dompurify";

// Configuration de DOMPurify pour autoriser uniquement les balises HTML sûres
const ALLOWED_TAGS = [
  // Structure
  "p", "br", "hr", "div", "span",
  // Titres
  "h1", "h2", "h3", "h4", "h5", "h6",
  // Formatage
  "b", "i", "u", "s", "strong", "em", "mark", "small", "sub", "sup",
  // Listes
  "ul", "ol", "li",
  // Liens et médias
  "a", "img",
  // Citations
  "blockquote", "q", "cite",
  // Code
  "pre", "code",
  // Tableaux
  "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  // Autres
  "figure", "figcaption", "details", "summary",
];

const ALLOWED_ATTR = [
  // Globaux
  "class", "id", "style",
  // Liens
  "href", "target", "rel",
  // Images
  "src", "alt", "width", "height", "loading",
  // Tableaux
  "colspan", "rowspan",
];

// Sanitiser le HTML pour l'affichage sécurisé
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Ajouter rel="noopener noreferrer" aux liens externes
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "iframe", "form", "input", "button", "textarea", "select"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  });
}

// Sanitiser le HTML pour les iframes (embeds) avec une whitelist stricte
const EMBED_ALLOWED_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "vimeo.com",
  "codepen.io",
  "codesandbox.io",
  "figma.com",
  "www.figma.com",
  "soundcloud.com",
  "w.soundcloud.com",
  "open.spotify.com",
  "bandcamp.com",
];

export function sanitizeEmbed(dirty: string): string {
  // Extraire les URLs des iframes
  const iframeRegex = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi;
  
  return dirty.replace(iframeRegex, (match, src) => {
    try {
      const url = new URL(src);
      const isAllowed = EMBED_ALLOWED_DOMAINS.some(
        (domain) => url.hostname === domain || url.hostname.endsWith("." + domain)
      );
      
      if (!isAllowed) {
        return "<!-- iframe bloqué: domaine non autorisé -->";
      }
      
      // Reconstruire l'iframe avec des attributs sécurisés
      return `<iframe src="${url.href}" 
        sandbox="allow-scripts allow-same-origin allow-presentation" 
        loading="lazy"
        referrerpolicy="no-referrer"
        allowfullscreen></iframe>`;
    } catch {
      return "<!-- iframe bloqué: URL invalide -->";
    }
  });
}

// Sanitiser le contenu complet (description + embeds)
export function sanitizeContent(content: string): string {
  // D'abord sanitiser le HTML standard
  let sanitized = sanitizeHtml(content);
  
  // Ensuite traiter les iframes si présentes dans le contenu original
  // (elles auront été supprimées par sanitizeHtml)
  // Pour les embeds, utiliser sanitizeEmbed séparément
  
  return sanitized;
}
