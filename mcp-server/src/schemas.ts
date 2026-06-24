import { z } from 'zod';

export const GenerateLayoutSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      parentId: z.string().nullable(),
      title: z.string(),
      type: z.enum(['goal', 'knowledge', 'resource', 'task'])
    })
  ),
  spacingX: z.number().default(220),
  spacingY: z.number().default(90)
});

export const AnalyzeKnowledgeSchema = z.object({
  nodeId: z.string(),
  content: z.string()
});

export const BuildRoadmapSchema = z.object({
  topic: z.string().min(1),
  depth: z.number().min(1).max(3).default(2)
});

export const SearchWebSchema = z.object({
  query: z.string().min(1)
});

export const SyncWorkspaceSchema = z.object({
  workspaceId: z.string(),
  treeData: z.any()
});
