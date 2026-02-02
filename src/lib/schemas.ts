import { z } from 'zod';

export const ThemeSchema = z.object({
  bg: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  fg: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  muted: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
});

const urlPattern = /^https?:\/\/.+/;

export const LinksSchema = z.object({
  play: z.string().regex(urlPattern).optional(),
  demo: z.string().regex(urlPattern).optional(),
  github: z.string().regex(urlPattern).optional(),
  zenn: z.string().regex(urlPattern).optional(),
});

export const OgMetaSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().regex(urlPattern).optional(),
});

export const AuthorSchema = z.object({
  name: z.string().optional(),
});

export const FeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const MetaSchema = z.object({
  name: z.string().min(1),
  catch: z.string().optional(),
  description: z.string().optional(),
  theme: ThemeSchema.optional(),
  links: LinksSchema.optional(),
  og: OgMetaSchema.optional(),
  gallery: z.array(z.string()).optional(),
  features: z.array(FeatureSchema).optional(),
  author: AuthorSchema.optional(),
});

export const VoiceSchema = z.object({
  text: z.string().min(1),
  by: z.string().optional(),
});

export const VoicesSchema = z.array(VoiceSchema);

export type Meta = z.infer<typeof MetaSchema>;
export type Voice = z.infer<typeof VoiceSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type Feature = z.infer<typeof FeatureSchema>;

export function validateMeta(data: unknown, path: string): Meta {
  const result = MetaSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid meta.json at ${path}:\n${errors}`);
  }
  return result.data;
}

export function validateVoices(data: unknown): Voice[] {
  const result = VoicesSchema.safeParse(data);
  if (!result.success) {
    return [];
  }
  return result.data;
}
