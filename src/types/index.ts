export interface TreeNode {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  type: 'goal' | 'knowledge' | 'resource' | 'task';
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  xPos: number;
  yPos: number;
  isCollapsed?: boolean;
  assignedAgent?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userOrAgent: string;
  action: string;
  details: string;
}

export interface AgentMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'tool_call' | 'tool_response';
  metadata?: any;
}
