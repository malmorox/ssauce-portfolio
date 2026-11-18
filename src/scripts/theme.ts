import { prefersReducedMotion } from './announce';

const STORAGE_KEY = 'ss:picante';

export const isPicante = () => document.documentElement.dataset.theme === 'picante';

/**
 * Activa/desactiva el modo picante con un revelado circular
 * (View Transition de mismo documento). Sin soporte o con reduced
 * motion, el cambio es instantáneo.
 */
export function setPicante(on: boolean) {
  const root = document.documentElement;

  const apply = () => {
    if (on) root.dataset.theme = 'picante';
    else delete root.dataset.theme;
    try {
      if (on) localStorage.setItem(STORAGE_KEY, '1');
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento bloqueado: el modo dura lo que dure la visita */
    }
    document.dispatchEvent(new CustomEvent('theme:change', { detail: { picante: on } }));
  };

  if (!document.startViewTransition || prefersReducedMotion()) {
    apply();
    return;
  }

  root.classList.add('is-theme-switching');
  const transition = document.startViewTransition(apply);
  transition.ready.then(() => {
    root.animate(
      { clipPath: ['circle(0% at 50% 40%)', 'circle(150% at 50% 40%)'] },
      {
        duration: 800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
  transition.finished.finally(() => root.classList.remove('is-theme-switching'));
}

export const togglePicante = () => setPicante(!isPicante());
