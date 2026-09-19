import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
export const collections = { docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: z.object({
  kind: z.enum(['home', 'guide', 'api', 'recipe', 'demo', 'index']),
  sourceRevision: z.string().regex(/^[a-f0-9]{40}$/),
  sourcePaths: z.array(z.string()).min(1),
  tags: z.array(z.string()).default([]),
  demo: z.object({ number: z.number().int().min(1).max(10), scene: z.string(), keys: z.array(z.string()).min(1), screenshots: z.array(z.string()).min(2) }).optional(),
}) }) }) };
