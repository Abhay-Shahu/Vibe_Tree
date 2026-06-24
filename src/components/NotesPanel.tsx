import React, { useState, useEffect } from 'react';
import { TreeNode } from '../types';
import { BookOpen, Save, Hash, Link as LinkIcon } from 'lucide-react';

interface NotesPanelProps {
  node: TreeNode | null;
  nodes: TreeNode[];
  onSelectNode: (nodeId: string) => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  node,
  nodes,
  onSelectNode
}) => {
  const [noteText, setNoteText] = useState<string>('');
  const [tagsText, setTagsText] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('All notes saved');

  // Load note text when active node changes
  useEffect(() => {
    if (node) {
      const storedNote = localStorage.getItem(`note-${node.id}`);
      setNoteText(storedNote || `## ${node.title}\n\nAdd your detailed study guides, external resources, and bookmarks here...`);
      
      const storedTags = localStorage.getItem(`tags-${node.id}`);
      setTagsText(storedTags || node.type);
    }
  }, [node]);

  const handleSave = () => {
    if (!node) return;
    setSaveStatus('Saving...');
    localStorage.setItem(`note-${node.id}`, noteText);
    localStorage.setItem(`tags-${node.id}`, tagsText);
    setTimeout(() => {
      setSaveStatus('All notes saved');
    }, 600);
  };

  // Find related nodes for links
  const getRelatedNodes = (): TreeNode[] => {
    if (!node) return [];
    const searchTerms = tagsText.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    if (searchTerms.length === 0) return [];

    return nodes.filter(n => {
      if (n.id === node.id) return false;
      const titleMatch = searchTerms.some(term => n.title.toLowerCase().includes(term));
      const descMatch = searchTerms.some(term => n.description.toLowerCase().includes(term));
      return titleMatch || descMatch;
    }).slice(0, 3);
  };

  if (!node) {
    return (
      <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Select a node to access notes, tags, and bi-directional linking recommendations.
      </div>
    );
  }

  const related = getRelatedNodes();

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)' }}>
          <BookOpen size={16} color="var(--accent-primary)" /> Notes & Knowledge
        </h3>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{saveStatus}</span>
      </div>

      {/* Editor Textarea */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1 }}>
        <textarea
          className="form-input"
          style={{ flexGrow: 1, minHeight: 220, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 }}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="# Markdown headers supported..."
        />
      </div>

      {/* Tags Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Hash size={12} /> Knowledge Tags (comma separated)
        </label>
        <input
          type="text"
          className="form-input"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="e.g. react, layout, router"
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" style={{ flexGrow: 1, padding: '8px 12px', fontSize: 13 }} onClick={handleSave}>
          <Save size={14} /> Save Notes
        </button>
      </div>

      {/* Bi-directional links panel */}
      {related.length > 0 && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
          <h4 style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <LinkIcon size={12} color="var(--accent-secondary)" /> Link Recommendations
          </h4>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Based on note tags, we suggest linking this node to:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {related.map(r => (
              <button
                key={`rel-${r.id}`}
                onClick={() => onSelectNode(r.id)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--accent-secondary)',
                  padding: '6px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                🌲 {r.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
