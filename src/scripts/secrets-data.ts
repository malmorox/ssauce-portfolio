/** Definición de los easter eggs. Módulo puro: se usa en servidor y cliente. */
export const SECRETS = {
  salsa: {
    name: 'La salsa secreta',
    message: 'Modo picante activado 🌶️. Escribe «salsa» otra vez para enfriarlo.',
  },
  sello: {
    name: 'El sello mareado',
    message: 'Vale, vale, ya paro de girar. ¿Nos tomamos un café?',
  },
  anuncio: {
    name: 'El botón prohibido',
    message: 'Has pulsado el botón de no pulsar. Tienes alma creativa.',
  },
  vuelta: {
    name: 'El engagement',
    message: 'Te fuiste y volviste. En publicidad, a eso lo llamamos engagement.',
  },
} as const;

export type SecretId = keyof typeof SECRETS;
export const SECRET_IDS = Object.keys(SECRETS) as SecretId[];
