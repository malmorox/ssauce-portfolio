import { announce } from './announce';
import { closeTopLayer, isPopoverOpen } from './top-layer';

const AUTO_DISMISS_MS = 7000;
const GAP = 12;

let counter = 0;
let lastOutsideFocus: HTMLElement | null = null;
let regionReady = false;

function getRegion() {
  const region = document.getElementById('toast-region');
  if (region && !regionReady) {
    regionReady = true;
    // Recordamos desde dónde entró el foco, para devolverlo al cerrar
    region.addEventListener('focusin', (e) => {
      const from = e.relatedTarget as HTMLElement | null;
      if (from && !region.contains(from)) lastOutsideFocus = from;
    });
  }
  return region;
}

const openToasts = (region: HTMLElement) =>
  [...region.querySelectorAll<HTMLElement>('.toast')].filter(isPopoverOpen);

/** Apila los toasts abiertos: el más reciente abajo */
function restack(region: HTMLElement) {
  const toasts = openToasts(region).reverse();
  const heights = toasts.map((t) => t.offsetHeight); // lecturas primero…
  let offset = 0;
  toasts.forEach((t, i) => {
    t.style.setProperty('--toast-offset', `${offset}px`); // …escrituras después
    offset += heights[i] + GAP;
  });
}

interface ToastOptions {
  title: string;
  body?: string;
}

export function toast(options: ToastOptions) {
  const { title, body } = options;
  const region = getRegion();
  if (!region) return;

  // Con un modal abierto el toast quedaría inerte y pasaría desapercibido:
  // lo aplazamos hasta que el modal se cierre.
  const modal = document.querySelector<HTMLDialogElement>('dialog:modal');
  if (modal) {
    modal.addEventListener('close', () => toast(options), { once: true });
    return;
  }

  const el = document.createElement('div');
  el.id = `toast-${++counter}`;
  el.className = 'toast';
  el.setAttribute('popover', 'manual');

  const titleEl = document.createElement('p');
  titleEl.className = 'toast__title';
  titleEl.textContent = title;
  el.append(titleEl);

  if (body) {
    const bodyEl = document.createElement('p');
    bodyEl.className = 'toast__body';
    bodyEl.textContent = body;
    el.append(bodyEl);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast__close';
  close.setAttribute('popovertarget', el.id);
  close.setAttribute('popovertargetaction', 'hide');
  close.setAttribute('aria-label', 'Cerrar aviso');
  close.innerHTML = '<span aria-hidden="true">×</span>';
  el.append(close);

  let hadFocus = false;
  el.addEventListener('beforetoggle', (e) => {
    if ((e as ToggleEvent).newState === 'closed') hadFocus = el.contains(document.activeElement);
  });
  el.addEventListener('toggle', (e) => {
    if ((e as ToggleEvent).newState !== 'closed') return;
    if (hadFocus) {
      const next = openToasts(region).at(-1)?.querySelector<HTMLElement>('.toast__close');
      (next ?? lastOutsideFocus ?? document.body).focus?.();
    }
    // Espera a la transición de salida (si la hay) antes de quitarlo del DOM
    Promise.allSettled(el.getAnimations().map((a) => a.finished)).then(() => {
      el.remove();
      restack(region);
    });
  });

  region.append(el);
  el.showPopover();
  restack(region);
  announce(body ? `${title}. ${body}` : title);

  // Autocierre, salvo que el foco esté dentro del toast
  const dismiss = () => {
    if (!el.isConnected || !isPopoverOpen(el)) return;
    if (el.matches(':focus-within')) {
      el.addEventListener('focusout', () => setTimeout(dismiss, 1500), { once: true });
      return;
    }
    closeTopLayer(el);
  };
  setTimeout(dismiss, AUTO_DISMISS_MS);
}
