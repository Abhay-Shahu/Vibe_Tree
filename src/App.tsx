import React, { useState, useEffect } from 'react';
import { TreeNode, Workspace, ActivityLog } from './types';
import { VisualCanvas } from './components/VisualCanvas';
import { NodeEditor } from './components/NodeEditor';
import { NotesPanel } from './components/NotesPanel';
import { RoadmapGenerator } from './components/RoadmapGenerator';
import { ProgressDashboard } from './components/ProgressDashboard';
import { CollaborationCenter } from './components/CollaborationCenter';
import { ActivityTimeline } from './components/ActivityTimeline';
import { agentPool } from '../agents/profiles';
import { 
  Trees, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  Sliders, 
  Sparkles,
  BookOpen,
  Users,
  Award,
  History,
  Info,
  Cpu,
  Unplug,
  Code2,
  Terminal,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';

const defaultNodes: TreeNode[] = [
  { id: 'root', parentId: null, title: 'Machine Learning Masterclass', description: 'Comprehensive learning path for mastering ML models and neural architectures.', type: 'goal', status: 'in_progress', xPos: 400, yPos: 80 },
  
  { id: 'foundation', parentId: 'root', title: 'Mathematical foundations', description: 'Review basic calculations: derivatives, matrices, gradients.', type: 'knowledge', status: 'completed', xPos: 180, yPos: 180 },
  { id: 'la', parentId: 'foundation', title: 'Linear Algebra Matrices', description: 'Understand dot products, matrix multiplications, eigenvalues.', type: 'task', status: 'completed', xPos: 80, yPos: 280 },
  { id: 'calc', parentId: 'foundation', title: 'Multivariate Calculus', description: 'Compute partial derivatives, chain rule operations, gradients.', type: 'task', status: 'completed', xPos: 280, yPos: 280 },
  
  { id: 'ml-core', parentId: 'root', title: 'Supervised Classifiers', description: 'Implement core ML structures in Python using NumPy and Scikit-Learn.', type: 'goal', status: 'in_progress', xPos: 620, yPos: 180 },
  { id: 'regression', parentId: 'ml-core', title: 'Logistic & Ridge Regression', description: 'Build gradient descent solvers for regression cost functions.', type: 'task', status: 'in_progress', xPos: 520, yPos: 280 },
  { id: 'svm', parentId: 'ml-core', title: 'Support Vector Machines', description: 'Configure kernel parameters to map higher dimensional data.', type: 'task', status: 'todo', xPos: 720, yPos: 280 },
  
  { id: 'res', parentId: 'root', title: 'Research & External Courses', description: 'Reference guides, textbook chapters, and coursera videos.', type: 'resource', status: 'todo', xPos: 400, yPos: 180 }
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeView, setActiveView] = useState<'canvas' | 'agents' | 'mcp' | 'specs'>('canvas');
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'w1', name: 'Machine Learning Path', description: 'Core learning curriculums for data science.', isPublic: false },
    { id: 'w2', name: 'Product Roadmap Q3', description: 'VibeTree milestone planner.', isPublic: true }
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('w1');
  const [nodes, setNodes] = useState<TreeNode[]>(defaultNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'editor' | 'notes' | 'roadmap' | 'progress' | 'collab' | 'timeline'>('editor');
  
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: 'l-1', timestamp: '17:40', userOrAgent: 'Abhay', action: 'Initialize workspace', details: 'Created workspace trees and assigned root goals.' }
  ]);

  // Agent Prompts Sandbox State
  const [agentTestPrompt, setAgentTestPrompt] = useState<{ [key: string]: string }>({});
  const [agentResponses, setAgentResponses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addLog = (userOrAgent: string, action: string, details: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [
      { id: `log-${Date.now()}`, timestamp: time, userOrAgent, action, details },
      ...prev
    ]);
  };

  const handleUpdateNode = (updated: TreeNode) => {
    setNodes(prev => prev.map(n => n.id === updated.id ? updated : n));
    const original = nodes.find(n => n.id === updated.id);
    if (original && (original.title !== updated.title || original.status !== updated.status)) {
      addLog('Abhay', 'Modify Node', `Updated "${updated.title}" attributes.`);
    }
  };

  const handleAddChild = (parentId: string) => {
    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const childId = `node-${Date.now()}`;
    const newNode: TreeNode = {
      id: childId,
      parentId,
      title: 'New Subtopic Branch',
      description: 'Define goal specs, milestones, or tools here.',
      type: 'task',
      status: 'todo',
      xPos: parentNode.xPos + (Math.random() * 40 - 20),
      yPos: parentNode.yPos + 100
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(childId);
    addLog('Abhay', 'Add Node', `Appended new branch child to "${parentNode.title}".`);
  };

  const handleDeleteNode = (nodeId: string) => {
    const target = nodes.find(n => n.id === nodeId);
    if (!target) return;
    
    const getDescendants = (id: string): string[] => {
      const children = nodes.filter(n => n.parentId === id);
      return [id, ...children.flatMap(c => getDescendants(c.id))];
    };

    const toDeleteIds = new Set(getDescendants(nodeId));
    setNodes(prev => prev.filter(n => !toDeleteIds.has(n.id)));
    setSelectedNodeId(null);
    addLog('Abhay', 'Delete Node(s)', `Removed "${target.title}" and its connected descendants.`);
  };

  const handleAddRootNode = () => {
    const newId = `node-${Date.now()}`;
    const newRoot: TreeNode = {
      id: newId,
      parentId: null,
      title: 'New Root Goal',
      description: 'Start of a new planning and knowledge hierarchy.',
      type: 'goal',
      status: 'todo',
      xPos: 400,
      yPos: 80
    };
    setNodes(prev => [...prev, newRoot]);
    setSelectedNodeId(newId);
    addLog('Abhay', 'Add Root Node', 'Created a new main visual branch root.');
  };

  const handleTriggerAgentAnalyze = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    addLog('KnowledgeAgent', 'Scan Node', `Triggered analysis tool on details of "${node.title}".`);
    
    setTimeout(() => {
      const common = ['matrices', 'gradients', 'linear', 'neural', 'regression'];
      const text = `${node.title} ${node.description}`.toLowerCase();
      const foundTags = common.filter(k => text.includes(k));

      const updatedNode = {
        ...node,
        description: node.description + (foundTags.length > 0 ? `\n\n[Agent Tags: ${foundTags.join(', ')}]` : '\n\n[Agent Tags: analyzed]')
      };
      setNodes(prev => prev.map(n => n.id === nodeId ? updatedNode : n));
      addLog('KnowledgeAgent', 'Analyze Complete', `Extracted tags: ${foundTags.join(', ') || 'none'}.`);
    }, 1000);
  };

  const handleRoadmapGenerated = (newNodes: any[]) => {
    if (newNodes.length === 0) return;
    
    const parentId = selectedNodeId || 'root';
    const parentNode = nodes.find(n => n.id === parentId);
    const startX = parentNode ? parentNode.xPos : 400;
    const startY = parentNode ? parentNode.yPos : 80;

    const positioned = newNodes.map((n, index) => ({
      ...n,
      parentId: index === 0 ? parentId : newNodes[index - 1].id,
      xPos: startX + (index - 2) * 160,
      yPos: startY + (index + 1) * 90
    }));

    setNodes(prev => [...prev, ...positioned]);
    addLog('RoadmapAgent', 'Build Roadmap', `Generated ${newNodes.length} module tracks under "${parentNode?.title || 'Root'}".`);
  };

  const handleTogglePrivacy = () => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        const nextState = !w.isPublic;
        addLog('WorkspaceAgent', 'Privacy Sync', `Updated workspace privacy setting to ${nextState ? 'Public' : 'Private'}.`);
        return { ...w, isPublic: nextState };
      }
      return w;
    }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nodes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vibetree-${activeWorkspaceId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('WorkspaceAgent', 'Export File', 'Serialized and exported active visual tree configuration.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setNodes(parsed);
            setSelectedNodeId(parsed[0]?.id || null);
            addLog('WorkspaceAgent', 'Import File', `Restored ${parsed.length} visual nodes into active workspace.`);
          }
        } catch (err) {
          alert('Invalid VibeTree file structure.');
        }
      };
    }
  };

  const handleTestAgent = (agentId: string) => {
    const prompt = agentTestPrompt[agentId];
    if (!prompt) return;

    setAgentResponses(prev => ({ ...prev, [agentId]: 'Thinking...' }));

    setTimeout(() => {
      const responseText = `[ADK Sandbox Out] Successfully received instruction: "${prompt}". Running analysis sequence against workspace ID ${activeWorkspaceId}... Verified security token logs. Safe execution complete.`;
      setAgentResponses(prev => ({ ...prev, [agentId]: responseText }));
      addLog(`${agentId.toUpperCase()}Agent`, 'Sandbox Call', `Executed testing prompt: "${prompt}"`);
    }, 1200);
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  const filteredNodes = nodes.map(n => {
    if (!searchQuery) return n;
    const isMatch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isMatch ? n : { ...n, title: `* ${n.title}` };
  });

  return (
    <div className="dashboard-container">
      {/* 1. Header Navigation Bar */}
      <header className="dashboard-header">
        <div className="logo-container">
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trees size={22} color="white" />
          </div>
          <span className="logo-text">VibeTree</span>
        </div>

        {/* Website Links */}
        <nav style={{ display: 'flex', gap: 6 }}>
          <button 
            className={`nav-link ${activeView === 'canvas' ? 'nav-link-active' : ''}`}
            onClick={() => setActiveView('canvas')}
          >
            Workspace Canvas
          </button>
          <button 
            className={`nav-link ${activeView === 'agents' ? 'nav-link-active' : ''}`}
            onClick={() => setActiveView('agents')}
          >
            ADK Agent Pool
          </button>
          <button 
            className={`nav-link ${activeView === 'mcp' ? 'nav-link-active' : ''}`}
            onClick={() => setActiveView('mcp')}
          >
            MCP Tools Hub
          </button>
          <button 
            className={`nav-link ${activeView === 'specs' ? 'nav-link-active' : ''}`}
            onClick={() => setActiveView('specs')}
          >
            Developer Specs
          </button>
        </nav>

        {/* Theme & Profile controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '8px 12px' }}
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* 2. Main Body Grid switching pages based on activeView */}
      {activeView === 'canvas' && (
        <main className="dashboard-body">
          {/* Left Sidebar: Workspace & Hierarchy */}
          <aside className="sidebar">
            <div style={{ padding: 16, borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h4 style={{ fontSize: 14 }}>{activeWorkspace.name}</h4>
                <select
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', width: 'auto' }}
                  value={activeWorkspaceId}
                  onChange={(e) => setActiveWorkspaceId(e.target.value)}
                >
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id}>{w.name.slice(0, 12)}...</option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{activeWorkspace.description}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: activeWorkspace.isPublic ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: activeWorkspace.isPublic ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                  {activeWorkspace.isPublic ? 'Public Share' : 'Private Key'}
                </span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  {nodes.length} nodes
                </span>
              </div>
            </div>

            {/* Search bar */}
            <div style={{ padding: 12, position: 'relative', borderBottom: '1px solid var(--card-border)' }}>
              <Search size={14} style={{ position: 'absolute', left: 22, top: 22, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 32 }}
                placeholder="Search visual nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Hierarchy list */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: 12 }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Node Hierarchy</span>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 11 }}
                  onClick={handleAddRootNode}
                >
                  <Plus size={12} /> Add Root
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {nodes.map(node => (
                  <button
                    key={`list-${node.id}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 12,
                      background: selectedNodeId === node.id ? 'var(--bg-tertiary)' : 'transparent',
                      color: selectedNodeId === node.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {node.parentId ? '  └─ ' : '🌲 '} {node.title}
                    </span>
                    <span style={{ fontSize: 9, opacity: 0.6 }}>({node.type})</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: 12, borderTop: '1px solid var(--card-border)', background: 'var(--bg-tertiary)', fontSize: 11, display: 'flex', gap: 6, alignItems: 'start' }}>
              <Info size={12} style={{ flexShrink: 0, marginTop: 1, color: 'var(--accent-secondary)' }} />
              <span style={{ color: 'var(--text-muted)' }}>Drag nodes on the canvas. Click (+) to append children.</span>
            </div>
          </aside>

          {/* Center Canvas */}
          <section style={{ height: '100%', width: '100%', position: 'relative' }}>
            <VisualCanvas
              nodes={filteredNodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdateNode={handleUpdateNode}
              onAddChild={handleAddChild}
              onDeleteNode={handleDeleteNode}
            />
          </section>

          {/* Right Sidebar: Panel Operations */}
          <aside className="right-panel">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '1px solid var(--card-border)', background: 'var(--bg-tertiary)' }}>
              <button onClick={() => setActiveTab('editor')} style={{ border: 'none', background: 'none', padding: '12px 0', borderBottom: activeTab === 'editor' ? '2px solid var(--accent-primary)' : 'none', cursor: 'pointer', color: activeTab === 'editor' ? 'var(--text-primary)' : 'var(--text-muted)' }} title="Node Editor"><Sliders size={16} style={{ margin: 'auto' }} /></button>
              <button onClick={() => setActiveTab('notes')} style={{ border: 'none', background: 'none', padding: '12px 0', borderBottom: activeTab === 'notes' ? '2px solid var(--accent-primary)' : 'none', cursor: 'pointer', color: activeTab === 'notes' ? 'var(--text-primary)' : 'var(--text-muted)' }} title="Markdown Notes"><BookOpen size={16} style={{ margin: 'auto' }} /></button>
              <button onClick={() => setActiveTab('roadmap')} style={{ border: 'none', background: 'none', padding: '12px 0', borderBottom: activeTab === 'roadmap' ? '2px solid var(--accent-primary)' : 'none', cursor: 'pointer', color: activeTab === 'roadmap' ? 'var(--text-primary)' : 'var(--text-muted)' }} title="Roadmap AI Agent"><Sparkles size={16} style={{ margin: 'auto' }} /></button>
              <button onClick={() => setActiveTab('progress')} style={{ border: 'none', background: 'none', padding: '12px 0', borderBottom: activeTab === 'progress' ? '2px solid var(--accent-primary)' : 'none', cursor: 'pointer', color: activeTab === 'progress' ? 'var(--text-primary)' : 'var(--text-muted)' }} title="Progress Dashboard"><Award size={16} style={{ margin: 'auto' }} /></button>
              <button onClick={() => setActiveTab('collab')} style={{ border: 'none', background: 'none', padding: '12px 0', borderBottom: activeTab === 'collab' ? '2px solid var(--accent-primary)' : 'none', cursor: 'pointer', color: activeTab === 'collab' ? 'var(--text-primary)' : 'var(--text-muted)' }} title="Collaboration Center"><Users size={16} style={{ margin: 'auto' }} /></button>
              <button onClick={() => setActiveTab('timeline')} style={{ border: 'none', background: 'none', padding: '12px 0', borderBottom: activeTab === 'timeline' ? '2px solid var(--accent-primary)' : 'none', cursor: 'pointer', color: activeTab === 'timeline' ? 'var(--text-primary)' : 'var(--text-muted)' }} title="Activity & Versions"><History size={16} style={{ margin: 'auto' }} /></button>
            </div>

            {/* Active Tab Panel Body */}
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {activeTab === 'editor' && <NodeEditor node={selectedNode} onUpdateNode={handleUpdateNode} onDeleteNode={handleDeleteNode} onTriggerAgentAnalyze={handleTriggerAgentAnalyze} />}
              {activeTab === 'notes' && <NotesPanel node={selectedNode} nodes={nodes} onSelectNode={setSelectedNodeId} />}
              {activeTab === 'roadmap' && <RoadmapGenerator onRoadmapGenerated={handleRoadmapGenerated} />}
              {activeTab === 'progress' && <ProgressDashboard nodes={nodes} />}
              {activeTab === 'collab' && <CollaborationCenter isPublic={activeWorkspace.isPublic} onTogglePrivacy={handleTogglePrivacy} />}
              {activeTab === 'timeline' && <ActivityTimeline logs={logs} />}
            </div>

            {/* Sidebar Export Tools footer */}
            <div style={{ padding: 16, borderTop: '1px solid var(--card-border)', background: 'var(--bg-secondary)', display: 'flex', gap: 8 }}>
              <label className="btn btn-secondary" style={{ flexGrow: 1, cursor: 'pointer', fontSize: 13 }} title="Import Node File">
                <Upload size={14} /> Import File
                <input type="file" onChange={handleImport} style={{ display: 'none' }} accept=".json" />
              </label>
              <button className="btn btn-secondary" onClick={handleExport} title="Export Tree layout">
                <Download size={14} /> Export
              </button>
            </div>
          </aside>
        </main>
      )}

      {/* ADK Agent Pool Hub */}
      {activeView === 'agents' && (
        <div className="full-width-page">
          <div className="hero-wrapper">
            <h1 className="hero-title">ADK Agent Registry</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              Inspect and command the 7 specialized planning and management agents that drive VibeTree.
            </p>
          </div>

          <div className="agent-grid">
            {agentPool.map(agent => {
              const accentColor = agent.id === 'tpa' ? 'var(--color-goal)' : agent.id === 'koa' ? 'var(--color-knowledge)' : agent.id === 'lra' ? 'var(--accent-primary)' : 'var(--color-resource)';
              return (
                <div key={agent.id} className="premium-card" style={{ '--card-header-color': accentColor } as React.CSSProperties}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ padding: 8, borderRadius: 8, background: 'var(--bg-tertiary)', color: accentColor, display: 'flex' }}>
                        <Cpu size={20} />
                      </span>
                      <h4 style={{ fontSize: 16 }}>{agent.name}</h4>
                    </div>
                    <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-completed)', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>
                      ACTIVE
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
                    {agent.systemPrompt}
                  </p>

                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Registered MCP Tools</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {agent.keyTools.map(t => (
                        <code key={t} style={{ fontSize: 11, padding: '2px 6px', background: 'var(--bg-tertiary)', border: '1px solid var(--card-border)', borderRadius: 4, color: 'var(--accent-secondary)' }}>
                          {t}
                        </code>
                      ))}
                    </div>
                  </div>

                  {/* Sandbox Prompting Box */}
                  <div style={{ marginTop: 12, borderTop: '1px solid var(--card-border)', paddingTop: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>SANDBOX CONTROLLER</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '8px 12px', fontSize: 12 }}
                        placeholder={`Command ${agent.name}...`}
                        value={agentTestPrompt[agent.id] || ''}
                        onChange={(e) => setAgentTestPrompt({ ...agentTestPrompt, [agent.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleTestAgent(agent.id); }}
                      />
                      <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={() => handleTestAgent(agent.id)}>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {agentResponses[agent.id] && (
                      <div className="code-container" style={{ marginTop: 8, fontSize: 11, wordBreak: 'break-all' }}>
                        {agentResponses[agent.id]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MCP Tools Hub */}
      {activeView === 'mcp' && (
        <div className="full-width-page">
          <div className="hero-wrapper">
            <h1 className="hero-title">Model Context Protocol Registry</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              VibeTree exposes 5 key planning and retrieval toolkits. Inspect schemas and inputs below.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            <div className="premium-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ padding: 8, borderRadius: 8, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex' }}>
                  <Unplug size={20} />
                </span>
                <h3 style={{ fontSize: 18 }}>generate_tree_layout</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Computes balanced visual layout placements (xPos, yPos coordinates) for tree nodes hierarchy. Prevents overlap issues on visual canvas.
              </p>
              <div className="code-container">
                {`ZodSchema = z.object({
  nodes: z.array(z.object({ id: z.string(), parentId: z.string().nullable() })),
  spacingX: z.number().default(220),
  spacingY: z.number().default(90)
});`}
              </div>
            </div>

            <div className="premium-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ padding: 8, borderRadius: 8, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex' }}>
                  <Unplug size={20} />
                </span>
                <h3 style={{ fontSize: 18 }}>analyze_knowledge_nodes</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Processes unstructured text description inputs, returns tag categories, and suggests relative node-to-node backlinks.
              </p>
              <div className="code-container">
                {`ZodSchema = z.object({
  nodeId: z.string(),
  content: z.string()
});`}
              </div>
            </div>

            <div className="premium-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ padding: 8, borderRadius: 8, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex' }}>
                  <Unplug size={20} />
                </span>
                <h3 style={{ fontSize: 18 }}>build_learning_roadmap</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Invokes roadmap agents to generate a progressive branching syllabus based on a starting user topic.
              </p>
              <div className="code-container">
                {`ZodSchema = z.object({
  topic: z.string().min(1),
  depth: z.number().min(1).max(3).default(2)
});`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Specs Tab */}
      {activeView === 'specs' && (
        <div className="full-width-page">
          <div className="hero-wrapper">
            <h1 className="hero-title">Developer Specs Portal</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              Review database scripts, server environments, and API gateway routes setup configurations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            <div className="premium-card">
              <h3 style={{ fontSize: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code2 size={16} color="var(--accent-primary)" /> PostgreSQL Database Tables
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                DDL setup commands for managing trees and audit trails:
              </p>
              <div className="code-container" style={{ maxHeight: 200 }}>
                {`CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- goal, knowledge, resource, task
  x_pos DOUBLE PRECISION DEFAULT 0.0,
  y_pos DOUBLE PRECISION DEFAULT 0.0,
  is_collapsed BOOLEAN DEFAULT false
);`}
              </div>
            </div>

            <div className="premium-card">
              <h3 style={{ fontSize: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Terminal size={16} color="var(--accent-secondary)" /> Express API Gateway Route Handlers
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Backend REST endpoint registrations:
              </p>
              <div className="code-container">
                {`GET  /api/trees/:treeId           -> Returns workspace nodes map
PUT  /api/nodes/:nodeId           -> Modifies titles and coordinate parameters
POST /api/agents/generate-roadmap -> Triggers roadmap planning agent`}
              </div>
            </div>

            <div className="premium-card">
              <h3 style={{ fontSize: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={16} color="var(--accent-gold)" /> Security Verification Rules
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Zod validation filter checks applied before mutations:
              </p>
              <div className="code-container">
                {`import { z } from 'zod';
export const NodeUpdateSchema = z.object({
  title: z.string().min(1).max(255),
  status: z.enum(['todo', 'in_progress', 'completed', 'blocked']),
  xPos: z.number().finite()
});`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
