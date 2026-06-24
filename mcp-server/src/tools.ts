import { GenerateLayoutSchema, AnalyzeKnowledgeSchema, BuildRoadmapSchema, SearchWebSchema, SyncWorkspaceSchema } from './schemas.js';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

export const toolsRegistry: ToolDefinition[] = [
  {
    name: 'generate_tree_layout',
    description: 'Computes visual 2D coordinates (x, y) for a hierarchical tree of nodes.',
    inputSchema: {
      type: 'object',
      properties: {
        nodes: { type: 'array', items: { type: 'object' } },
        spacingX: { type: 'number' },
        spacingY: { type: 'number' }
      },
      required: ['nodes']
    },
    handler: async (args) => {
      const validated = GenerateLayoutSchema.parse(args);
      const { nodes, spacingX, spacingY } = validated;

      const childrenMap = new Map<string | null, any[]>();
      nodes.forEach(node => {
        const parent = node.parentId || null;
        if (!childrenMap.has(parent)) childrenMap.set(parent, []);
        childrenMap.get(parent)!.push(node);
      });

      const positionedNodes: any[] = [];
      const levelsCount: { [key: number]: number } = {};

      const traverse = (nodeId: string | null, depth: number, parentX: number) => {
        const children = childrenMap.get(nodeId) || [];
        if (!levelsCount[depth]) levelsCount[depth] = 0;

        const totalWidth = (children.length - 1) * spacingX;
        let startX = parentX - totalWidth / 2;

        children.forEach((child, index) => {
          const currentX = children.length === 1 ? parentX : startX + index * spacingX;
          const currentY = depth * spacingY + 80;

          positionedNodes.push({
            ...child,
            xPos: currentX,
            yPos: currentY
          });

          levelsCount[depth]++;
          traverse(child.id, depth + 1, currentX);
        });
      };

      const roots = childrenMap.get(null) || [];
      const totalRootWidth = (roots.length - 1) * spacingX;
      let startRootX = 400 - totalRootWidth / 2;

      roots.forEach((root, index) => {
        const rx = roots.length === 1 ? 400 : startRootX + index * spacingX;
        const ry = 80;
        positionedNodes.push({
          ...root,
          xPos: rx,
          yPos: ry
        });
        traverse(root.id, 1, rx);
      });

      return { positionedNodes };
    }
  },
  {
    name: 'analyze_knowledge_nodes',
    description: 'Scans markdown text, extracts tags, and links relevant knowledge nodes.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string' },
        content: { type: 'string' }
      },
      required: ['nodeId', 'content']
    },
    handler: async (args) => {
      const { content } = AnalyzeKnowledgeSchema.parse(args);
      const commonKeywords = ['react', 'node', 'agent', 'mcp', 'database', 'security', 'api', 'state'];
      const textLower = content.toLowerCase();
      const tags = commonKeywords.filter(keyword => textLower.includes(keyword));
      
      const suggestedLinks = [];
      if (textLower.includes('api') || textLower.includes('http')) {
        suggestedLinks.push({ title: 'Secure API Gateways', nodeId: 'node-sec-api' });
      }
      if (textLower.includes('agent') || textLower.includes('adk')) {
        suggestedLinks.push({ title: 'ADK Orchestration Engine', nodeId: 'node-adk-orch' });
      }

      return {
        tags: tags.length > 0 ? tags : ['knowledge-mapping'],
        suggestedLinks
      };
    }
  },
  {
    name: 'build_learning_roadmap',
    description: 'Generates subtopic branches and research summaries for a learning goal.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string' },
        depth: { type: 'number' }
      },
      required: ['topic']
    },
    handler: async (args) => {
      const { topic, depth } = BuildRoadmapSchema.parse(args);
      const roadmapLibraries: { [key: string]: string[] } = {
        'machine learning': ['Linear Regression', 'Neural Networks', 'Loss Functions', 'Model Training', 'Gradient Descent'],
        'react typescript': ['Component Lifecycle', 'State Hooks', 'TypeScript Props', 'Vite Bundler', 'Performance Profiling'],
        'security': ['Token Audits', 'CSP Policies', 'Zod Validations', 'Rate Limiters', 'Data Encryption']
      };

      const key = topic.toLowerCase();
      let subtopics = ['Foundation Core', 'Intermediate Operations', 'Advanced Frameworks', 'Security Verification'];
      
      for (const mapKey of Object.keys(roadmapLibraries)) {
        if (key.includes(mapKey)) {
          subtopics = roadmapLibraries[mapKey];
          break;
        }
      }

      const generatedSubnodes = subtopics.slice(0, depth * 3).map((sub, idx) => ({
        id: `gen-sub-${Date.now()}-${idx}`,
        title: sub,
        type: idx === 0 ? 'goal' : idx % 2 === 0 ? 'knowledge' : 'task',
        status: 'todo',
        description: `Explore the fundamental concepts of ${sub} inside the ${topic} curriculum.`
      }));

      return {
        topic,
        nodes: generatedSubnodes
      };
    }
  },
  {
    name: 'search_web_resources',
    description: 'Performs simulated web search queries to retrieve relevant documentation pages.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' }
      },
      required: ['query']
    },
    handler: async (args) => {
      const { query } = SearchWebSchema.parse(args);
      return {
        results: [
          {
            title: `Official Documentation: ${query}`,
            url: `https://docs.vibetree.io/search?q=${encodeURIComponent(query)}`,
            snippet: `Complete details regarding ${query}, syntax implementations, best practices, and error handling guidelines.`
          },
          {
            title: `Getting Started Guide on ${query}`,
            url: `https://vibetree.io/guide/${encodeURIComponent(query)}`,
            snippet: `Step-by-step walkthrough detailing how to construct applications incorporating ${query} elements.`
          }
        ]
      };
    }
  },
  {
    name: 'sync_workspace_state',
    description: 'Saves current tree node mappings, audit log entries, and workspace layout configurations.',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: { type: 'string' },
        treeData: { type: 'object' }
      },
      required: ['workspaceId', 'treeData']
    },
    handler: async (args) => {
      const { workspaceId } = SyncWorkspaceSchema.parse(args);
      return {
        status: 'synced',
        workspaceId,
        timestamp: new Date().toISOString(),
        nodesCount: args.treeData.nodes ? args.treeData.nodes.length : 0
      };
    }
  }
];
