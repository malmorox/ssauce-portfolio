import { prefersReducedMotion } from './announce';

const COLORS = [
  '--color-wild-strawberry',
  '--color-light-green',
  '--color-cerulean',
  '--color-lavender-blush',
  '--color-deep-space-blue',
];

/** Lluvia de confeti con los colores de la marca. No se lanza con reduced motion. */
export function confetti(pieces = 90) {
  if (prefersReducedMotion()) return;

  const styles = getComputedStyle(document.documentElement);
  const palette = COLORS.map((v) => styles.getPropertyValue(v).trim()).filter(Boolean);

  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  const finished: Promise<Animation>[] = [];
  const height = window.innerHeight;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('i');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = palette[i % palette.length];
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    layer.append(piece);

    const drift = (Math.random() - 0.5) * 240;
    const spin = (Math.random() - 0.5) * 1080;
    const animation = piece.animate(
      [
        { transform: 'translate3d(0, -2rem, 0) rotate(0deg)' },
        { transform: `translate3d(${drift}px, ${height + 40}px, 0) rotate(${spin}deg)` },
      ],
      {
        duration: 2200 + Math.random() * 1800,
        delay: Math.random() * 500,
        easing: 'cubic-bezier(.2,.6,.4,1)',
        fill: 'both',
      },
    );
    finished.push(animation.finished);
  }

  Promise.allSettled(finished).then(() => layer.remove());
}
