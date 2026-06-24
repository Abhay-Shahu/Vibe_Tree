import { agentPool, AgentProfile } from './profiles.js';

export interface AgentMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'tool_call' | 'tool_response';
  metadata?: any;
}

export class AgentOrchestrator {
  private messages: AgentMessage[] = [];
  private onMessageCallback?: (msg: AgentMessage) => void;

  constructor(onMessage?: (msg: AgentMessage) => void) {
    if (onMessage) this.onMessageCallback = onMessage;
  }

  public registerMessageCallback(callback: (msg: AgentMessage) => void) {
    this.onMessageCallback = callback;
  }

  private postMessage(msg: Omit<AgentMessage, 'id' | 'timestamp'>) {
    const newMessage: AgentMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.messages.push(newMessage);
    if (this.onMessageCallback) {
      this.onMessageCallback(newMessage);
    }
    return newMessage;
  }

  /**
   * Orchestrates a Learning Roadmap workflow by passing messages
   * between the Roadmap Agent, Research Agent, and Tree Layout Agent.
   */
  public async orchestrateRoadmapGeneration(topic: string): Promise<any[]> {
    this.messages = []; // Reset logs for this run

    // Step 1: User requests roadmap. Orchestrator triggers Learning Roadmap Agent
    this.postMessage({
      senderId: 'user',
      receiverId: 'lra',
      content: `Please generate a structured, progressive learning roadmap for: "${topic}".`,
      type: 'text'
    });

    await this.delay(800);

    // Step 2: Learning Roadmap Agent requests resources from Search & Research Agent
    this.postMessage({
      senderId: 'lra',
      receiverId: 'sra',
      content: `Need official documents and references related to "${topic}" to draft an accurate curriculum.`,
      type: 'text'
    });

    await this.delay(1000);

    // Step 3: Search & Research Agent calls 'search_web_resources'
    this.postMessage({
      senderId: 'sra',
      receiverId: 'system',
      content: `Invoking tool: search_web_resources with query "${topic}"`,
      type: 'tool_call',
      metadata: { toolName: 'search_web_resources', args: { query: topic } }
    });

    await this.delay(800);

    // Simulated tool response from system
    const mockSearchResults = {
      results: [
        { title: `Docs - ${topic}`, url: `https://docs.example.com/${topic.toLowerCase().replace(/ /g, '-')}` },
        { title: `${topic} Roadmap Starter`, url: `https://roadmap.example.com/${topic.toLowerCase().replace(/ /g, '-')}` }
      ]
    };

    this.postMessage({
      senderId: 'system',
      receiverId: 'sra',
      content: JSON.stringify(mockSearchResults),
      type: 'tool_response'
    });

    await this.delay(900);

    // Step 4: Search & Research Agent replies to Learning Roadmap Agent
    this.postMessage({
      senderId: 'sra',
      receiverId: 'lra',
      content: `Retrieved primary references for "${topic}". Found documentation site: ${mockSearchResults.results[0].url}. Suggested structuring into: Foundations, Hooks/State, and Deployment.`,
      type: 'text'
    });

    await this.delay(1100);

    // Step 5: Learning Roadmap Agent builds raw subtopics and asks Tree Planning Agent to position them
    this.postMessage({
      senderId: 'lra',
      receiverId: 'tpa',
      content: `Drafted nodes for "${topic}". Requesting layout coordinate calculation for 5 nodes.`,
      type: 'text'
    });

    await this.delay(900);

    // Step 6: Tree Planning Agent invokes tool 'generate_tree_layout'
    this.postMessage({
      senderId: 'tpa',
      receiverId: 'system',
      content: 'Invoking tool: generate_tree_layout',
      type: 'tool_call',
      metadata: { toolName: 'generate_tree_layout' }
    });

    await this.delay(800);

    // Custom layout nodes calculation
    const rawSubnodes = [
      { id: 'n1', title: `Introduction to ${topic}`, type: 'goal' },
      { id: 'n2', title: `Core Principles of ${topic}`, type: 'knowledge' },
      { id: 'n3', title: `Building your first ${topic} Project`, type: 'task' },
      { id: 'n4', title: `Advanced structures in ${topic}`, type: 'knowledge' },
      { id: 'n5', title: `Deployment & Validation`, type: 'task' }
    ];

    const positioned = rawSubnodes.map((node, index) => ({
      ...node,
      parentId: null,
      xPos: 400 + (index - 2) * 220,
      yPos: 180 + (index % 2 === 0 ? 0 : 50),
      status: 'todo',
      description: `Structured path module for learning ${node.title}.`
    }));

    this.postMessage({
      senderId: 'system',
      receiverId: 'tpa',
      content: JSON.stringify({ positionedNodes: positioned }),
      type: 'tool_response'
    });

    await this.delay(800);

    // Step 7: Tree Planning Agent sends layout back to Learning Roadmap Agent
    this.postMessage({
      senderId: 'tpa',
      receiverId: 'lra',
      content: 'Computed optimal 2D coordinates for the roadmap hierarchy. Layout finalized.',
      type: 'text'
    });

    await this.delay(800);

    // Step 8: Learning Roadmap Agent concludes, returning the final branches to the UI
    this.postMessage({
      senderId: 'lra',
      receiverId: 'user',
      content: `Roadmap for "${topic}" generated and appended successfully. Check the visual canvas for the new branches!`,
      type: 'text',
      metadata: { nodes: positioned }
    });

    return positioned;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
