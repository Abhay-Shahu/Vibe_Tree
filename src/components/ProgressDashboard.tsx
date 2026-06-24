import React from 'react';
import { TreeNode } from '../types';
import { Award, CheckCircle, Clock, Ban, ListTodo } from 'lucide-react';

interface ProgressDashboardProps {
  nodes: TreeNode[];
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ nodes }) => {
  const total = nodes.length;
  const completed = nodes.filter(n => n.status === 'completed').length;
  const inProgress = nodes.filter(n => n.status === 'in_progress').length;
  const blocked = nodes.filter(n => n.status === 'blocked').length;
  const todo = nodes.filter(n => n.status === 'todo').length;

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by types
  const goals = nodes.filter(n => n.type === 'goal').length;
  const knowledge = nodes.filter(n => n.type === 'knowledge').length;
  const resources = nodes.filter(n => n.type === 'resource').length;
  const tasks = nodes.filter(n => n.type === 'task').length;

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }}>
      <div>
        <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          <Award size={16} color="var(--accent-primary)" /> Progress & Analytics
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Real-time tracking of workspace milestone distributions and completion metrics.
        </p>
      </div>

      {/* Radial percentage block */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 16 }}>
        <div style={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="35"
              cy="35"
              r="30"
              fill="transparent"
              stroke="var(--bg-tertiary)"
              strokeWidth="6"
            />
            <circle
              cx="35"
              cy="35"
              r="30"
              fill="transparent"
              stroke="var(--accent-primary)"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 30}
              strokeDashoffset={2 * Math.PI * 30 * (1 - pct / 100)}
            />
          </svg>
          <span style={{ position: 'absolute', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {pct}%
          </span>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600 }}>Overall Completion</h4>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {completed} of {total} nodes completed
          </p>
        </div>
      </div>

      {/* Node Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={16} color="var(--color-completed)" />
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>COMPLETED</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{completed}</div>
          </div>
        </div>
        
        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={16} color="var(--color-in-progress)" />
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>IN PROGRESS</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{inProgress}</div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ban size={16} color="var(--color-blocked)" />
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>BLOCKED</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{blocked}</div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ListTodo size={16} color="var(--color-todo)" />
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>TODO</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{todo}</div>
          </div>
        </div>
      </div>

      {/* Node Type Breakdown */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Branch Type Distribution</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Goals</span>
              <span>{goals}</span>
            </div>
            <div style={{ height: 4, width: '100%', background: 'var(--bg-tertiary)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: total > 0 ? `${(goals/total)*100}%` : '0%', background: 'var(--color-goal)', borderRadius: 2 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Knowledge Cards</span>
              <span>{knowledge}</span>
            </div>
            <div style={{ height: 4, width: '100%', background: 'var(--bg-tertiary)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: total > 0 ? `${(knowledge/total)*100}%` : '0%', background: 'var(--color-knowledge)', borderRadius: 2 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Resources</span>
              <span>{resources}</span>
            </div>
            <div style={{ height: 4, width: '100%', background: 'var(--bg-tertiary)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: total > 0 ? `${(resources/total)*100}%` : '0%', background: 'var(--color-resource)', borderRadius: 2 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Tasks</span>
              <span>{tasks}</span>
            </div>
            <div style={{ height: 4, width: '100%', background: 'var(--bg-tertiary)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: total > 0 ? `${(tasks/total)*100}%` : '0%', background: 'var(--color-task)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
