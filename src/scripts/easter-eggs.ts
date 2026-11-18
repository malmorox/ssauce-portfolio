import { unlock } from './secrets';
import { isPicante, togglePicante } from './theme';
import { toast } from './toast';

/* ── 1. Escribir «salsa» → modo picante ─────────────────────────────── */
const CODE = 'salsa';
let buffer = '';

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
  const target = e.target as HTMLElement | null;
  if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;

  buffer = (buffer + e.key.toLowerCase()).slice(-CODE.length);
  if (buffer !== CODE) return;
  buffer = '';

  togglePicante();
  // La primera vez cuenta como secreto; después solo avisamos del cambio
  if (!unlock('salsa')) {
    toast({ title: isPicante() ? 'Modo picante activado 🌶️' : 'Modo picante desactivado' });
  }
});

/* ── 2. La pestaña te echa de menos ─────────────────────────────────── */
const originalTitle = document.title;
let awaySince = 0;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    awaySince = Date.now();
    document.title = '👀 ¡Vuelve! Aún no has visto lo mejor';
    return;
  }
  document.title = originalTitle;
  if (awaySince && Date.now() - awaySince > 1500) unlock('vuelta');
  awaySince = 0;
});

/* ── 3. Para curiosos del código ────────────────────────────────────── */
console.log(
  '%c¿Curioseando el código? %cMe gusta tu actitud.',
  'font: 700 1.4rem system-ui; color: #f75590;',
  'font: 400 1rem system-ui;',
);
console.log(
  '%cPista: hay 4 secretos escondidos. Como premio por mirar aquí: escribe «salsa» en la página. 🌶️',
  'font: italic 0.95rem Georgia, serif; color: #007ea7;',
);
