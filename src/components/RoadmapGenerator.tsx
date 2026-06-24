import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, Cpu } from 'lucide-react';
import { AgentOrchestrator, AgentMessage } from '../../agents/orchestrator';

interface RoadmapGeneratorProps {
  onRoadmapGenerated: (newNodes: any[]) => void;
}

export const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ onRoadmapGenerated }) => {
  const [topic, setTopic] = useState<string>('React TypeScript');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const triggerGeneration = async () => {
    if (!topic.trim() || isRunning) return;
    setIsRunning(true);
    setMessages([]);

    const orchestrator = new AgentOrchestrator((msg) => {
      setMessages(prev => [...prev, msg]);
    });

    try {
      const generatedNodes = await orchestrator.orchestrateRoadmapGeneration(topic);
      onRoadmapGenerated(generatedNodes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const getAgentLabel = (id: string): string => {
    switch (id) {
      case 'lra': return 'Learning Roadmap Agent';
      case 'sra': return 'Search & Research Agent';
      case 'tpa': return 'Tree Planning Agent';
      case 'system': return 'MCP Server System';
      default: return 'User';
    }
  };

  const getAgentColor = (id: string): string => {
    switch (id) {
      case 'lra': return 'var(--accent-primary)';
      case 'sra': return 'var(--accent-secondary)';
      case 'tpa': return '#f59e0b';
      case 'system': return 'var(--text-muted)';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div>
        <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          <Sparkles size={16} color="var(--accent-primary)" /> Roadmap AI Generator
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Design structured learning tracks instantly. Runs a coordinated loop across 3 specialized ADK agents.
        </p>
      </div>

      {/* Input controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          className="form-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Deep Learning, Web3, Rust Compiler"
          disabled={isRunning}
        />
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={triggerGeneration}
          disabled={isRunning || !topic.trim()}
        >
          {isRunning ? 'Orchestrating Agents...' : 'Build Roadmap Tree'}
        </button>
      </div>

      {/* Agent Logs terminal */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Cpu size={12} /> Live Agent Stream
        </span>
        <div
          style={{
            flexGrow: 1,
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--card-border)',
            borderRadius: 8,
            padding: 12,
            overflowY: 'auto',
            minHeight: 250,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', fontStyle: 'italic' }}>
              No active agent logs. Enter a topic above and press 'Build' to launch the ADK pipeline.
            </div>
          ) : (
            messages.map((msg) => {
              const label = getAgentLabel(msg.senderId);
              const color = getAgentColor(msg.senderId);
              const isTool = msg.type === 'tool_call' || msg.type === 'tool_response';
              
              return (
                <div
                  key={msg.id}
                  className={`agent-message ${msg.senderId === 'user' ? 'msg-user' : msg.senderId === 'system' ? 'msg-system' : 'msg-agent'}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: color }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
