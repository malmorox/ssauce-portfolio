import data from '@data/projects.json';

export type Category = 'campaign' | 'branding' | 'social' | 'copy';

export type PaletteColor =
  | 'cerulean'
  | 'light-green'
  | 'deep-space-blue'
  | 'wild-strawberry'
  | 'lavender-blush';

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: Category;
  role: string;
  disciplines: string[];
  summary: string;
  challenge: string;
  idea: string;
  deliverables: string[];
  results: { value: string; label: string }[];
  /** Color de la portada generativa mientras no haya imagen */
  color: PaletteColor;
  /** Composición de la portada generativa (1, 2 o 3) */
  variant: 1 | 2 | 3;
  /** Ruta en /public, p. ej. "/images/projects/preview/verano.webp" */
  cover: string | null;
  images: string[];
  featured: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  campaign: 'Campañas',
  branding: 'Branding',
  social: 'Social media',
  copy: 'Copywriting',
};

export const projects: Project[] = (data as Project[]).toSorted((a, b) => b.year - a.year);

export const featuredProjects = projects.filter((p) => p.featured);

/** Categorías presentes en los datos, en el orden de CATEGORY_LABELS */
export const categories = (Object.keys(CATEGORY_LABELS) as Category[]).filter((c) =>
  projects.some((p) => p.category === c),
);

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return undefined;
  return projects[(index + 1) % projects.length];
}

/** Nombre de view-transition compartido entre tarjeta y cabecera del caso */
export const coverTransitionName = (slug: string) => `project-${slug}`;
