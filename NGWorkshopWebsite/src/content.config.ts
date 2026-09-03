import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { getYouTubeVideoId } from './lib/youtube';

const optionalUrl = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.url().optional(),
);
const optionalText = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().optional(),
);

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    urlSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    excerpt: z.string(),
    locale: z.enum(['he', 'en']),
    translationKey: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('NG Workshop'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    youtubeUrl: optionalUrl,
    youtubeTitle: optionalText,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }).superRefine((data, context) => {
    if (data.coverImage && !data.coverAlt?.trim()) {
      context.addIssue({ code: 'custom', path: ['coverAlt'], message: 'Cover image alt text is required when a cover image is set.' });
    }
    if (data.youtubeUrl && !getYouTubeVideoId(data.youtubeUrl)) {
      context.addIssue({ code: 'custom', path: ['youtubeUrl'], message: 'Enter a valid YouTube video, Short, live, or youtu.be URL.' });
    }
  }),
});

export const collections = { blog };
