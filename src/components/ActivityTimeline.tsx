import React from 'react';
import { ActivityLog } from '../types';
import { History, GitCommit, User, Bot, Server } from 'lucide-react';

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  const getIcon = (source: string) => {
    const src = source.toLowerCase();
    if (src.includes('agent') || src.includes('orchestrator')) return <Bot size={12} color="var(--accent-primary)" />;
    if (src.includes('system') || src.includes('mcp')) return <Server size={12} color="var(--accent-secondary)" />;
    return <User size={12} color="#ec4899" />;
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>
      <div>
        <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          <History size={16} color="var(--accent-primary)" /> Activity & Versions
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Immutable logs auditing all user interactions and multi-agent system runs.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', fontStyle: 'italic', padding: 20 }}>
            No activity logged in this workspace session.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                gap: 10,
                padding: 10,
                borderRadius: 6,
                border: '1px solid var(--card-border)',
                background: 'var(--bg-secondary)',
                fontSize: 12
              }}
            >
              <div style={{ marginTop: 2 }}>{getIcon(log.userOrAgent)}</div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontWeight: '600' }}>{log.userOrAgent}</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{log.action}:</span> {log.details}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
