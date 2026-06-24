import React, { useState } from 'react';
import { Users, Shield, Send, CheckCircle2 } from 'lucide-react';

interface CollaborationCenterProps {
  isPublic: boolean;
  onTogglePrivacy: () => void;
}

export const CollaborationCenter: React.FC<CollaborationCenterProps> = ({
  isPublic,
  onTogglePrivacy
}) => {
  const [messages, setMessages] = useState<any[]>([
    { id: '1', sender: 'Elena (UI Lead)', text: 'Just updated the React styling sub-branch.', time: '17:22' },
    { id: '2', sender: 'Devin (Agent)', text: 'Automated test suite nodes are ready for execution.', time: '17:34' }
  ]);
  const [inputText, setInputText] = useState<string>('');

  const activeUsers = [
    { name: 'Abhay (You)', color: 'var(--accent-primary)', initials: 'A' },
    { name: 'Elena', color: '#ec4899', initials: 'E' },
    { name: 'Marcus', color: '#3b82f6', initials: 'M' }
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Abhay (You)',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate Agent quick response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 1,
        sender: 'GoalAgent (Bot)',
        text: 'Received notes. Updating progress completion rates on the dashboard.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div>
        <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          <Users size={16} color="var(--accent-primary)" /> Collaboration Center
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Manage workspace permissions, share secure links, and chat with teammates and bots.
        </p>
      </div>

      {/* Sharing controls */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
            <Shield size={14} color={isPublic ? 'var(--accent-primary)' : 'var(--text-muted)'} /> 
            {isPublic ? 'Public Workspace' : 'Private Workspace'}
          </span>
          <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={onTogglePrivacy}>
            Make {isPublic ? 'Private' : 'Public'}
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {isPublic 
            ? 'Anyone with the link can view and collaborate on this tree.' 
            : 'Only added collaborators can access these workspace planning structures.'}
        </p>
      </div>

      {/* Teammates List */}
      <div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Co-Authors
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeUsers.map(user => (
            <div
              key={user.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                border: `2px solid ${user.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              title={user.name}
            >
              {user.initials}
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Chat */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Workspace Chat
        </span>
        <div
          style={{
            flexGrow: 1,
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--card-border)',
            borderRadius: 8,
            padding: 10,
            overflowY: 'auto',
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          {messages.map(msg => (
            <div key={msg.id} style={{ fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, marginBottom: 2 }}>
                <span style={{ fontWeight: 'bold' }}>{msg.sender}</span>
                <span style={{ fontSize: 9 }}>{msg.time}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: 6, borderRadius: 4 }}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            className="form-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder="Type message..."
          />
          <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={handleSendMessage}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
