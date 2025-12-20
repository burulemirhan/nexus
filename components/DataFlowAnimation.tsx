import React, { useMemo } from 'react';

interface FarmNode {
  id: string;
  type: 'Field' | 'Greenhouse' | 'Vertical Farm' | 'Livestock';
  x: number;
  y: number;
  label: string;
}

interface DataFlowAnimationProps {
  className?: string;
}

const DataFlowAnimation: React.FC<DataFlowAnimationProps> = ({ className }) => {
  const nodes: FarmNode[] = useMemo(() => [
    { id: '1', type: 'Field', x: 20, y: 30, label: 'Field' },
    { id: '2', type: 'Greenhouse', x: 80, y: 25, label: 'Greenhouse' },
    { id: '3', type: 'Vertical Farm', x: 25, y: 75, label: 'Vertical Farm' },
    { id: '4', type: 'Livestock', x: 75, y: 80, label: 'Livestock Farm' },
  ], []);

  const center = { x: 50, y: 55 };

  const getCurvePath = (startX: number, startY: number, endX: number, endY: number, index: number, reverse: boolean = false) => {
    const sX = reverse ? endX : startX;
    const sY = reverse ? endY : startY;
    const eX = reverse ? startX : endX;
    const eY = reverse ? startY : endY;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    const offsetScale = 12;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    const px = -dy / len;
    const py = dx / len;
    
    const direction = index % 2 === 0 ? 1 : -1;
    const cpX = midX + px * offsetScale * direction;
    const cpY = midY + py * offsetScale * direction;

    return `M ${sX} ${sY} Q ${cpX} ${cpY} ${eX} ${eY}`;
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center p-8 ${className || ''}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 25px rgba(16, 185, 129, 0.4))' }}
      >
        {/* Background Connections */}
        {nodes.map((node, i) => {
          const path = getCurvePath(center.x, center.y, node.x, node.y, i);
          const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6']; // Cyan, Amber, Emerald, Purple
          return (
            <path
              key={`path-${node.id}`}
              d={path}
              fill="none"
              stroke={colors[i]}
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}

        {/* Animated Data Pulses */}
        {nodes.map((node, i) => {
          const outboundPath = getCurvePath(center.x, center.y, node.x, node.y, i, false);
          const inboundPath = getCurvePath(center.x, center.y, node.x, node.y, i, true);
          const duration = 3 + i * 0.7;
          
          return (
            <React.Fragment key={`pulses-group-${node.id}`}>
              {/* Outbound Pulse (Center -> Node) */}
              {(() => {
                const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6']; // Cyan, Amber, Emerald, Purple
                const nodeColor = colors[i];
                return (
                  <>
                    <circle r="0.75" fill={nodeColor}>
                      <animateMotion
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        path={outboundPath}
                        begin={`${i * 0.4}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.4}s`}
                      />
                    </circle>
                    {/* Glow effect for pulse */}
                    <circle r="1.2" fill={nodeColor} opacity="0.3">
                      <animateMotion
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        path={outboundPath}
                        begin={`${i * 0.4}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.5;0"
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.4}s`}
                      />
                    </circle>

                    {/* Inbound Pulse (Node -> Center) */}
                    <circle r="0.65" fill={nodeColor} opacity="0.9">
                      <animateMotion
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        path={inboundPath}
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                      />
                    </circle>
                    {/* Glow effect for inbound pulse */}
                    <circle r="1.0" fill={nodeColor} opacity="0.25">
                      <animateMotion
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        path={inboundPath}
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.4;0"
                        dur={`${duration * 1.2}s`}
                        repeatCount="indefinite"
                        begin={`${(i * 0.4) + (duration / 2)}s`}
                      />
                    </circle>
                  </>
                );
              })()}
            </React.Fragment>
          );
        })}

        {/* Central Nexus Node */}
        <g transform={`translate(${center.x - 4}, ${center.y - 4})`}>
          <rect
            width="8"
            height="8"
            rx="1.5"
            fill="transparent"
            stroke="#10b981"
            strokeWidth="0.15"
            className="animate-pulse"
            style={{ animation: 'pulse 2s ease-in-out infinite', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }}
          />
          <rect
            x="1.5"
            y="1.5"
            width="5"
            height="5"
            rx="0.5"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.3"
            className="opacity-70"
          />
          <circle cx="4" cy="4" r="1.5" fill="#10b981" className="opacity-60" />
          <circle cx="4" cy="4" r="0.6" fill="#fff" />
          <circle cx="4" cy="4" r="2" fill="#10b981" opacity="0.1" className="animate-pulse" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        </g>

        {/* Farm Nodes */}
        {nodes.map((node, i) => {
          const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6']; // Cyan, Amber, Emerald, Purple
          const nodeColor = colors[i];
          return (
            <g
              key={node.id}
              className="group"
              transform={`translate(${node.x}, ${node.y})`}
            >
              <circle r="6" fill="transparent" />
              
              <circle
                r="4"
                fill={nodeColor}
                opacity="0.15"
                className="transition-all duration-700 group-hover:opacity-0.25"
              />
              <circle
                r="2.5"
                fill={nodeColor}
                opacity="0.25"
                className="transition-all duration-700"
              />
              <circle
                r="1"
                fill={nodeColor}
                className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                style={{ filter: `drop-shadow(0 0 6px ${nodeColor})` }}
              />
              
              <text
                y="8"
                fontSize="2.2"
                fill="#ddd"
                textAnchor="middle"
                className="font-light tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ fontFamily: 'Barlow' }}
              >
                {node.label}
              </text>

              <g transform="translate(-1.5, -1.5)" className="pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                {node.type === 'Field' && <path d="M 0.5 2.5 L 1.5 0.5 L 2.5 2.5" stroke={nodeColor} strokeWidth="0.25" fill="none" />}
                {node.type === 'Greenhouse' && <path d="M 0.5 2.5 L 0.5 1.5 L 1.5 0.5 L 2.5 1.5 L 2.5 2.5 Z" stroke={nodeColor} strokeWidth="0.25" fill="none" />}
                {node.type === 'Vertical Farm' && <path d="M 0.5 0.5 L 2.5 0.5 M 0.5 1.5 L 2.5 1.5 M 0.5 2.5 L 2.5 2.5" stroke={nodeColor} strokeWidth="0.25" fill="none" />}
                {node.type === 'Livestock' && <circle cx="1.5" cy="1.5" r="1" stroke={nodeColor} strokeWidth="0.25" fill="none" />}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DataFlowAnimation;

