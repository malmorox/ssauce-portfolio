import { toast } from './toast';
import { confetti } from './confetti';
import { SECRETS, SECRET_IDS, type SecretId } from './secrets-data';

export { SECRETS, SECRET_IDS, type SecretId };

const STORAGE_KEY = 'ss:secrets';

// Fuente de verdad en memoria; localStorage es solo persistencia "best effort"
const found = new Set<SecretId>(load());

function load(): SecretId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((id): id is SecretId => id in SECRETS) : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
  } catch {
    /* sin almacenamiento: los secretos duran la visita */
  }
}

export const foundSecrets = () => new Set(found);

/** Desbloquea un secreto. Devuelve true solo la primera vez. */
export function unlock(id: SecretId): boolean {
  if (found.has(id)) return false;
  found.add(id);
  save();
  document.dispatchEvent(new CustomEvent('secrets:change'));

  const total = SECRET_IDS.length;
  toast({
    title: `Secreto ${found.size}/${total}: ${SECRETS[id].name}`,
    body: SECRETS[id].message,
  });

  if (found.size === total) {
    setTimeout(() => {
      toast({
        title: '¡Los has encontrado todos!',
        body: 'Ya conoces mi salsa secreta: la curiosidad. ¿Hablamos?',
      });
      confetti();
    }, 900);
  }
  return true;
}
