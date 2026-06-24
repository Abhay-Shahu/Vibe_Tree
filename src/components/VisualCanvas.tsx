import React, { useState, useRef, useEffect } from 'react';
import { TreeNode } from '../types';
import { Plus, Trash2, FolderPlus, Minimize2, Maximize2 } from 'lucide-react';

interface VisualCanvasProps {
  nodes: TreeNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onUpdateNode: (node: TreeNode) => void;
  onAddChild: (parentId: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onUpdateNode,
  onAddChild,
  onDeleteNode,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter out collapsed descendants
  const isNodeCollapsedByParent = (node: TreeNode): boolean => {
    let current = node;
    while (current.parentId) {
      const parent = nodes.find(n => n.id === current.parentId);
      if (!parent) break;
      if (parent.isCollapsed) return true;
      current = parent;
    }
    return false;
  };

  const visibleNodes = nodes.filter(n => !isNodeCollapsedByParent(n));
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

  // Handle zooming
  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev * factor)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan actions
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).classList.contains('canvas-bg')) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y
      });
    } else if (draggedNodeId) {
      const target = nodes.find(n => n.id === draggedNodeId);
      if (target && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        // Convert screen coordinates to SVG client space coordinates, accounting for zoom and pan
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;

        onUpdateNode({
          ...target,
          xPos: Math.round(x),
          yPos: Math.round(y)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    const target = nodes.find(n => n.id === nodeId);
    if (target) {
      setDragStart({ x: target.xPos, y: target.yPos });
    }
  };

  // Render connector path
  const getConnectorPath = (child: TreeNode): string => {
    if (!child.parentId) return '';
    const parent = nodes.find(n => n.id === child.parentId);
    if (!parent) return '';

    // Smooth cubic bezier curves
    const startX = parent.xPos;
    const startY = parent.yPos;
    const endX = child.xPos;
    const endY = child.yPos;

    const midY = (startY + endY) / 2;

    return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
  };

  const getNodeColor = (type: string): string => {
    switch (type) {
      case 'goal': return 'var(--color-goal)';
      case 'knowledge': return 'var(--color-knowledge)';
      case 'resource': return 'var(--color-resource)';
      case 'task': return 'var(--color-task)';
      default: return 'var(--accent-primary)';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'var(--color-completed)';
      case 'in_progress': return 'var(--color-in-progress)';
      case 'blocked': return 'var(--color-blocked)';
      default: return 'var(--color-todo)';
    }
  };

  return (
    <div className="canvas-wrapper">
      {/* Zoom / Controls Panel */}
      <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, zIndex: 5 }}>
        <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => handleZoom(1.1)} title="Zoom In">
          <Plus size={16} />
        </button>
        <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => handleZoom(0.9)} title="Zoom Out">
          <Minimize2 size={16} />
        </button>
        <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: 12 }} onClick={handleReset}>
          Reset View
        </button>
      </div>

      <div style={{ position: 'absolute', top: 16, right: 16, pointerEvents: 'none', zIndex: 5 }}>
        <div className="glass-panel" style={{ fontSize: 12, display: 'flex', gap: 12, padding: '8px 12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-goal)' }} /> Goal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-knowledge)' }} /> Knowledge
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-resource)' }} /> Resource
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-task)' }} /> Task
          </span>
        </div>
      </div>

      <svg
        ref={svgRef}
        className="svg-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Clickable background grid */}
        <rect width="100%" height="100%" fill="transparent" className="canvas-bg" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Draw connections */}
          {visibleNodes.map(node => {
            if (!node.parentId || !visibleNodeIds.has(node.parentId)) return null;
            return (
              <path
                key={`link-${node.id}`}
                d={getConnectorPath(node)}
                fill="none"
                stroke={getNodeColor(node.type)}
                strokeWidth={2}
                opacity={0.4}
                className="node-link"
              />
            );
          })}

          {/* 2. Draw nodes */}
          {visibleNodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const nodeColor = getNodeColor(node.type);
            const statusColor = getStatusColor(node.status);
            const hasChildren = nodes.some(n => n.parentId === node.id);

            return (
              <g
                key={`node-group-${node.id}`}
                transform={`translate(${node.xPos}, ${node.yPos})`}
                onClick={(e) => { e.stopPropagation(); onSelectNode(node.id); }}
              >
                {/* Node Shape */}
                {node.type === 'goal' ? (
                  // Diamond shape for Goals
                  <polygon
                    points="0,-24 24,0 0,24 -24,0"
                    fill="var(--bg-secondary)"
                    stroke={isSelected ? 'var(--accent-primary)' : nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="node-circle"
                    onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                    style={{ '--glow-color': nodeColor } as React.CSSProperties}
                  />
                ) : node.type === 'resource' ? (
                  // Square shape for Resources
                  <rect
                    x="-20"
                    y="-20"
                    width="40"
                    height="40"
                    rx="4"
                    fill="var(--bg-secondary)"
                    stroke={isSelected ? 'var(--accent-primary)' : nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="node-circle"
                    onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                    style={{ '--glow-color': nodeColor } as React.CSSProperties}
                  />
                ) : (
                  // Circle shape for Knowledge / Task
                  <circle
                    r="20"
                    fill="var(--bg-secondary)"
                    stroke={isSelected ? 'var(--accent-primary)' : nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="node-circle"
                    onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                    style={{ '--glow-color': nodeColor } as React.CSSProperties}
                  />
                )}

                {/* Status Dot */}
                <circle
                  cx="15"
                  cy="-15"
                  r="6"
                  fill={statusColor}
                  stroke="var(--bg-secondary)"
                  strokeWidth="1.5"
                />

                {/* Branch Collapser if it has children */}
                {hasChildren && (
                  <g
                    transform="translate(0, 24)"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateNode({ ...node, isCollapsed: !node.isCollapsed });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle r="7" fill="var(--bg-tertiary)" stroke={nodeColor} strokeWidth="1" />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill="var(--text-primary)"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {node.isCollapsed ? '+' : '-'}
                    </text>
                  </g>
                )}

                {/* Node Title Text */}
                <text
                  y="-32"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="12"
                  fontWeight="600"
                  style={{ userSelect: 'none', filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
                >
                  {node.title.length > 22 ? `${node.title.slice(0, 20)}...` : node.title}
                </text>

                {/* Node Hover Actions Panel when selected */}
                {isSelected && (
                  <g transform="translate(0, -56)">
                    <rect x="-42" y="-12" width="84" height="24" rx="4" fill="var(--bg-tertiary)" stroke="var(--card-border)" strokeWidth="1" />
                    
                    {/* Add child button */}
                    <g transform="translate(-24, 0)" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}>
                      <title>Add Child Node</title>
                      <circle r="8" fill="var(--accent-primary)" />
                      <text y="3" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">+</text>
                    </g>

                    {/* Delete node button */}
                    <g transform="translate(24, 0)" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }}>
                      <title>Delete Node</title>
                      <circle r="8" fill="var(--color-blocked)" />
                      <text y="3.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">×</text>
                    </g>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
