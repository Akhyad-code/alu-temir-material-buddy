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

interface ProfileDiagramProps {
  dimensions: ProfileDimensions;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ dimensions }) => {
  const { width, height, gap } = dimensions;
  
  // SVG dimensions and scaling
  const profileCount = 3;
  const scale = 2.5;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledGap = gap * scale;
  
  // Lip/ear dimensions (proportional to profile)
  const lipWidth = 6;
  const lipHeight = 8;
  const wallThickness = 3;
  
  // Substrate (основание) height
  const substrateHeight = 12;
  
  // Calculate total SVG dimensions
  const totalProfilesWidth = profileCount * scaledWidth + (profileCount - 1) * scaledGap;
  const padding = 60;
  const arrowSpace = 40;
  const svgWidth = totalProfilesWidth + padding * 2 + arrowSpace * 2;
  const svgHeight = scaledHeight + substrateHeight + padding * 2 + arrowSpace;
  
  // Starting position
  const startX = padding + arrowSpace;
  const startY = padding;

  // Generate U-shaped profile path with lips
  const generateProfilePath = (x: number) => {
    const y = startY + substrateHeight;
    const w = scaledWidth;
    const h = scaledHeight;
    
    // U-shape with inward lips at top
    return `
      M ${x} ${y}
      L ${x} ${y + h}
      L ${x + w} ${y + h}
      L ${x + w} ${y}
      L ${x + w - lipWidth} ${y}
      L ${x + w - lipWidth} ${y + lipHeight}
      L ${x + w - lipWidth - wallThickness} ${y + lipHeight}
      L ${x + w - lipWidth - wallThickness} ${y + wallThickness}
      L ${x + lipWidth + wallThickness} ${y + wallThickness}
      L ${x + lipWidth + wallThickness} ${y + lipHeight}
      L ${x + lipWidth} ${y + lipHeight}
      L ${x + lipWidth} ${y}
      Z
    `;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-2xl"
        style={{ minHeight: '180px' }}
      >
        <defs>
          {/* Light gradient for substrate */}
          <linearGradient id="substrateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="50%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#d0d0d0" />
          </linearGradient>
          
          {/* Profile fill - clean white */}
          <linearGradient id="profileFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fafafa" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#f0f4f8" />
        
        {/* Dark band at top */}
        <rect 
          x="0" 
          y="0" 
          width={svgWidth} 
          height={startY + substrateHeight / 2} 
          fill="#4a5568"
        />

        {/* Substrate (основание) */}
        <rect
          x={startX - 10}
          y={startY}
          width={totalProfilesWidth + 20}
          height={substrateHeight}
          fill="url(#substrateGradient)"
          stroke="#999"
          strokeWidth="0.5"
        />

        {/* Profiles */}
        {Array.from({ length: profileCount }).map((_, i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          return (
            <path
              key={i}
              d={generateProfilePath(x)}
              fill="url(#profileFill)"
              stroke="#1a1a1a"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Dimension lines and labels */}
        {/* Left height dimension */}
        <g>
          <line 
            x1={startX - 35} 
            y1={startY + substrateHeight} 
            x2={startX - 35} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="1"
            markerStart="url(#arrowUp)"
            markerEnd="url(#arrowDown)"
          />
          {/* Top arrow */}
          <polygon
            points={`${startX - 35},${startY + substrateHeight} ${startX - 38},${startY + substrateHeight + 6} ${startX - 32},${startY + substrateHeight + 6}`}
            fill="#0088cc"
          />
          {/* Bottom arrow */}
          <polygon
            points={`${startX - 35},${startY + substrateHeight + scaledHeight} ${startX - 38},${startY + substrateHeight + scaledHeight - 6} ${startX - 32},${startY + substrateHeight + scaledHeight - 6}`}
            fill="#0088cc"
          />
          {/* Extension lines */}
          <line 
            x1={startX - 40} 
            y1={startY + substrateHeight} 
            x2={startX - 5} 
            y2={startY + substrateHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          <line 
            x1={startX - 40} 
            y1={startY + substrateHeight + scaledHeight} 
            x2={startX - 5} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          {/* Label */}
          <text 
            x={startX - 50} 
            y={startY + substrateHeight + scaledHeight / 2 + 4}
            fill="#0088cc"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            transform={`rotate(-90, ${startX - 50}, ${startY + substrateHeight + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Right height dimension */}
        <g>
          <line 
            x1={startX + totalProfilesWidth + 35} 
            y1={startY + substrateHeight} 
            x2={startX + totalProfilesWidth + 35} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="1"
          />
          {/* Top arrow */}
          <polygon
            points={`${startX + totalProfilesWidth + 35},${startY + substrateHeight} ${startX + totalProfilesWidth + 32},${startY + substrateHeight + 6} ${startX + totalProfilesWidth + 38},${startY + substrateHeight + 6}`}
            fill="#0088cc"
          />
          {/* Bottom arrow */}
          <polygon
            points={`${startX + totalProfilesWidth + 35},${startY + substrateHeight + scaledHeight} ${startX + totalProfilesWidth + 32},${startY + substrateHeight + scaledHeight - 6} ${startX + totalProfilesWidth + 38},${startY + substrateHeight + scaledHeight - 6}`}
            fill="#0088cc"
          />
          {/* Extension lines */}
          <line 
            x1={startX + totalProfilesWidth + 5} 
            y1={startY + substrateHeight} 
            x2={startX + totalProfilesWidth + 40} 
            y2={startY + substrateHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          <line 
            x1={startX + totalProfilesWidth + 5} 
            y1={startY + substrateHeight + scaledHeight} 
            x2={startX + totalProfilesWidth + 40} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          {/* Label */}
          <text 
            x={startX + totalProfilesWidth + 50} 
            y={startY + substrateHeight + scaledHeight / 2 + 4}
            fill="#0088cc"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            transform={`rotate(90, ${startX + totalProfilesWidth + 50}, ${startY + substrateHeight + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Bottom width dimensions */}
        {Array.from({ length: profileCount }).map((_, i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          const y = startY + substrateHeight + scaledHeight + 25;
          
          return (
            <g key={`width-${i}`}>
              {/* Width dimension line */}
              <line 
                x1={x} 
                y1={y} 
                x2={x + scaledWidth} 
                y2={y}
                stroke="#0088cc"
                strokeWidth="1"
              />
              {/* Left arrow */}
              <polygon
                points={`${x},${y} ${x + 6},${y - 3} ${x + 6},${y + 3}`}
                fill="#0088cc"
              />
              {/* Right arrow */}
              <polygon
                points={`${x + scaledWidth},${y} ${x + scaledWidth - 6},${y - 3} ${x + scaledWidth - 6},${y + 3}`}
                fill="#0088cc"
              />
              {/* Extension lines */}
              <line 
                x1={x} 
                y1={startY + substrateHeight + scaledHeight + 5} 
                x2={x} 
                y2={y + 5}
                stroke="#0088cc"
                strokeWidth="0.5"
              />
              <line 
                x1={x + scaledWidth} 
                y1={startY + substrateHeight + scaledHeight + 5} 
                x2={x + scaledWidth} 
                y2={y + 5}
                stroke="#0088cc"
                strokeWidth="0.5"
              />
              {/* Label */}
              <text 
                x={x + scaledWidth / 2} 
                y={y - 6}
                fill="#0088cc"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {width} мм
              </text>
            </g>
          );
        })}

        {/* Gap dimensions */}
        {Array.from({ length: profileCount - 1 }).map((_, i) => {
          const x1 = startX + (i + 1) * scaledWidth + i * scaledGap;
          const x2 = x1 + scaledGap;
          const y = startY + substrateHeight + scaledHeight + 25;
          
          return (
            <g key={`gap-${i}`}>
              {/* Gap dimension line */}
              <line 
                x1={x1} 
                y1={y} 
                x2={x2} 
                y2={y}
                stroke="#0088cc"
                strokeWidth="1"
              />
              {/* Left arrow */}
              <polygon
                points={`${x1},${y} ${x1 + 6},${y - 3} ${x1 + 6},${y + 3}`}
                fill="#0088cc"
              />
              {/* Right arrow */}
              <polygon
                points={`${x2},${y} ${x2 - 6},${y - 3} ${x2 - 6},${y + 3}`}
                fill="#0088cc"
              />
              {/* Label */}
              <text 
                x={(x1 + x2) / 2} 
                y={y - 6}
                fill="#0088cc"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {gap} мм
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Profile name label */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-gray-700">
          Профиль V-{width}/{height}
        </span>
        <span className="text-xs text-gray-500 ml-2">
          (модуль: {width + gap} мм)
        </span>
      </div>
    </div>
  );
};

export default ProfileDiagram;
