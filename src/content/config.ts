import { defineCollection, z } from 'astro:content';

const checklistsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    items: z.array(z.object({
      id: z.string(),
      label: z.string(),
      category: z.enum(['water', 'food', 'meds', 'docs', 'tools', 'spiritual']),
      priority: z.enum(['low', 'med', 'high']),
      estimatedCost: z.number().nonnegative(),
      recommendation: z.string(),
      purchaseUrl: z.string().url(),
      notes: z.string().optional(),
      defaultChecked: z.boolean().optional().default(false),
    })),
  }),
});

export const collections = {
  checklists: checklistsCollection,
};
