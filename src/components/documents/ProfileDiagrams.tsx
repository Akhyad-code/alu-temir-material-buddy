import React from 'react';

export interface ProfileDimensions {
  width: number;
  height: number;
  gap: number;
}

export const DEFAULT_DIMENSIONS: ProfileDimensions = {
  width: 59,
  height: 43,
  gap: 40,
};

// Universal editable profile diagram with custom dimensions
interface ProfileDiagramProps {
  dimensions: ProfileDimensions;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ dimensions }) => {
  const { width, height, gap } = dimensions;
  
  // Scale factor to fit diagram nicely
  const scale = Math.min(1, 300 / (3 * width + 2 * gap + 50));
  const scaledWidth = width * scale;
  const scaledHeight = Math.min(height * scale, 80);
  const scaledGap = gap * scale;
  
  // Calculate positions
  const startX = 40;
  const profileY = 15;
  const stemWidth = Math.max(6, scaledWidth * 0.14);
  const flangeHeight = Math.max(5, scaledHeight * 0.12);
  
  // Calculate total width for centering
  const totalWidth = 3 * scaledWidth + 2 * scaledGap;
  const viewBoxWidth = totalWidth + 80;
  const viewBoxHeight = scaledHeight + 55;

  return (
    <div className="flex flex-col items-center py-3">
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        className="w-full max-w-[480px] h-auto"
        style={{ minHeight: '100px' }}
      >
        {/* Left height dimension */}
        <line x1="12" y1={profileY} x2="12" y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <line x1="8" y1={profileY} x2="16" y2={profileY} stroke="#0066cc" strokeWidth="1" />
        <line x1="8" y1={profileY + scaledHeight} x2="16" y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <polygon points={`12,${profileY} 10,${profileY + 5} 14,${profileY + 5}`} fill="#0066cc" />
        <polygon points={`12,${profileY + scaledHeight} 10,${profileY + scaledHeight - 5} 14,${profileY + scaledHeight - 5}`} fill="#0066cc" />
        <text 
          x="6" 
          y={profileY + scaledHeight / 2} 
          fontSize="8" 
          fill="#0066cc" 
          textAnchor="middle" 
          transform={`rotate(-90, 6, ${profileY + scaledHeight / 2})`}
        >
          {height} мм
        </text>

        {/* Right height dimension */}
        <line x1={viewBoxWidth - 12} y1={profileY} x2={viewBoxWidth - 12} y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <line x1={viewBoxWidth - 16} y1={profileY} x2={viewBoxWidth - 8} y2={profileY} stroke="#0066cc" strokeWidth="1" />
        <line x1={viewBoxWidth - 16} y1={profileY + scaledHeight} x2={viewBoxWidth - 8} y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <polygon points={`${viewBoxWidth - 12},${profileY} ${viewBoxWidth - 14},${profileY + 5} ${viewBoxWidth - 10},${profileY + 5}`} fill="#0066cc" />
        <polygon points={`${viewBoxWidth - 12},${profileY + scaledHeight} ${viewBoxWidth - 14},${profileY + scaledHeight - 5} ${viewBoxWidth - 10},${profileY + scaledHeight - 5}`} fill="#0066cc" />
        <text 
          x={viewBoxWidth - 6} 
          y={profileY + scaledHeight / 2} 
          fontSize="8" 
          fill="#0066cc" 
          textAnchor="middle" 
          transform={`rotate(90, ${viewBoxWidth - 6}, ${profileY + scaledHeight / 2})`}
        >
          {height} мм
        </text>

        {/* Three T-profiles */}
        {[0, 1, 2].map((i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          return (
            <g key={i}>
              {/* Top flange */}
              <rect 
                x={x} 
                y={profileY} 
                width={scaledWidth} 
                height={flangeHeight} 
                fill="none" 
                stroke="#333" 
                strokeWidth="1.5" 
              />
              {/* Stem */}
              <rect 
                x={x + (scaledWidth - stemWidth) / 2} 
                y={profileY} 
                width={stemWidth} 
                height={scaledHeight} 
                fill="none" 
                stroke="#333" 
                strokeWidth="1.5" 
              />
              {/* Bottom flange */}
              <rect 
                x={x} 
                y={profileY + scaledHeight - flangeHeight} 
                width={scaledWidth} 
                height={flangeHeight} 
                fill="none" 
                stroke="#333" 
                strokeWidth="1.5" 
              />
            </g>
          );
        })}

        {/* Bottom dimensions */}
        {/* Profile 1 width */}
        <line x1={startX} y1={profileY + scaledHeight + 8} x2={startX} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX} y1={profileY + scaledHeight + 11} x2={startX + scaledWidth} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + scaledWidth / 2} y={profileY + scaledHeight + 22} fontSize="7" fill="#0066cc" textAnchor="middle">{width} мм</text>

        {/* Gap 1 */}
        <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 11} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + scaledWidth + scaledGap / 2} y={profileY + scaledHeight + 22} fontSize="7" fill="#0066cc" textAnchor="middle">{gap} мм</text>

        {/* Profile 2 width */}
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 11} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + 1.5 * scaledWidth + scaledGap} y={profileY + scaledHeight + 22} fontSize="7" fill="#0066cc" textAnchor="middle">{width} мм</text>

        {/* Gap 2 */}
        <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 11} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + 2 * scaledWidth + 1.5 * scaledGap} y={profileY + scaledHeight + 22} fontSize="7" fill="#0066cc" textAnchor="middle">{gap} мм</text>

        {/* Profile 3 width */}
        <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 3 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 3 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 11} x2={startX + 3 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + 2.5 * scaledWidth + 2 * scaledGap} y={profileY + scaledHeight + 22} fontSize="7" fill="#0066cc" textAnchor="middle">{width} мм</text>
      </svg>
      <p className="text-[9px] text-gray-500 mt-1">Профиль V{width}x{height}</p>
    </div>
  );
};
