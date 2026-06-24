import React from 'react';
import { TreeNode } from '../types';
import { agentPool } from '../../agents/profiles';
import { Sparkles, Trash2, Calendar, UserCheck } from 'lucide-react';

interface NodeEditorProps {
  node: TreeNode | null;
  onUpdateNode: (node: TreeNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onTriggerAgentAnalyze: (nodeId: string) => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onTriggerAgentAnalyze
}) => {
  if (!node) {
    return (
      <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Select a node on the canvas to edit details, assign agents, and write notes.
      </div>
    );
  }

  const handleChange = (field: keyof TreeNode, value: any) => {
    onUpdateNode({
      ...node,
      [field]: value
    });
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }}>
      <div>
        <h3 style={{ fontSize: 18, marginBottom: 4, fontFamily: 'var(--font-display)', display: 'flex', justifyItems: 'center', gap: 8 }}>
          Node Editor
        </h3>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {node.id}</span>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Title</label>
        <input
          type="text"
          className="form-input"
          value={node.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
        <textarea
          className="form-input"
          style={{ minHeight: 80, resize: 'vertical' }}
          value={node.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter detailed goal specifications or learning milestones..."
        />
      </div>

      {/* Row: Type & Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Node Type</label>
          <select
            className="form-input"
            value={node.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="goal">Goal 🟡</option>
            <option value="knowledge">Knowledge 🟢</option>
            <option value="resource">Resource 🔵</option>
            <option value="task">Task 🔴</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Status</label>
          <select
            className="form-input"
            value={node.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Agent Assignment */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserCheck size={14} /> Assigned ADK Agent
          </span>
        </label>
        <select
          className="form-input"
          value={node.assignedAgent || ''}
          onChange={(e) => handleChange('assignedAgent', e.target.value || undefined)}
        >
          <option value="">No Agent Assigned</option>
          {agentPool.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name} ({agent.role})
            </option>
          ))}
        </select>
      </div>

      {/* Quick Agent Actions */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="var(--accent-primary)" /> Agent Actions
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Trigger the Knowledge Agent to scan descriptions and notes, extract relevant tag keywords, and suggest bi-directional tree links.
        </p>
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
          onClick={() => onTriggerAgentAnalyze(node.id)}
        >
          Analyze with Knowledge Agent
        </button>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: 16 }}>
        <button
          className="btn btn-secondary"
          style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-blocked)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          onClick={() => onDeleteNode(node.id)}
        >
          <Trash2 size={16} /> Delete Node
        </button>
      </div>
    </div>
  );
};
