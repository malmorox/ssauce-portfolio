type DocumentWithNotify = Document & { ariaNotify?: (message: string) => void };

/**
 * Anuncia un mensaje a lectores de pantalla.
 * Usa ariaNotify() cuando existe; si no, la región viva #sr-announcer
 * que BaseLayout deja preparada desde la carga.
 */
export function announce(message: string) {
  const doc = document as DocumentWithNotify;
  if (typeof doc.ariaNotify === 'function') {
    doc.ariaNotify(message);
    return;
  }
  const live = document.getElementById('sr-announcer');
  if (!live) return;
  live.textContent = '';
  // Pequeño retardo para que el lector detecte el cambio aunque el texto se repita
  setTimeout(() => {
    live.textContent = message;
  }, 50);
}

export const prefersReducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;
