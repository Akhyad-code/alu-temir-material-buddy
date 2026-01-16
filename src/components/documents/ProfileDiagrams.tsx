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
  const profileCount = 5;
  const scale = 2;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledGap = gap * scale;
  
  // Profile wall thickness
  const wallThickness = 2.5;
  
  // Lip dimensions (ушки)
  const lipWidth = 8;
  const lipHeight = 12;
  const lipInnerCurve = 4;
  
  // Substrate height
  const substrateHeight = 14;
  
  // Calculate total SVG dimensions
  const totalProfilesWidth = profileCount * scaledWidth + (profileCount - 1) * scaledGap;
  const padding = 50;
  const arrowSpace = 45;
  const svgWidth = totalProfilesWidth + padding * 2 + arrowSpace * 2;
  const svgHeight = scaledHeight + substrateHeight + padding * 2 + arrowSpace + 10;
  
  // Starting position
  const startX = padding + arrowSpace;
  const startY = padding;

  // Generate realistic U-shaped profile with curved lips (like reference image)
  const generateProfilePath = (x: number) => {
    const y = startY + substrateHeight;
    const w = scaledWidth;
    const h = scaledHeight;
    const cornerRadius = 4;
    
    // Outer path of the U-shape with lips curving inward at top
    const outerPath = `
      M ${x + lipWidth} ${y}
      L ${x + lipWidth} ${y + lipHeight}
      Q ${x + lipWidth} ${y + lipHeight + lipInnerCurve} ${x + lipWidth - lipInnerCurve} ${y + lipHeight + lipInnerCurve}
      L ${x} ${y + lipHeight + lipInnerCurve}
      L ${x} ${y + h - cornerRadius}
      Q ${x} ${y + h} ${x + cornerRadius} ${y + h}
      L ${x + w - cornerRadius} ${y + h}
      Q ${x + w} ${y + h} ${x + w} ${y + h - cornerRadius}
      L ${x + w} ${y + lipHeight + lipInnerCurve}
      L ${x + w - lipWidth + lipInnerCurve} ${y + lipHeight + lipInnerCurve}
      Q ${x + w - lipWidth} ${y + lipHeight + lipInnerCurve} ${x + w - lipWidth} ${y + lipHeight}
      L ${x + w - lipWidth} ${y}
    `;
    
    // Inner path (cutout) - creates the hollow U shape
    const innerX = x + wallThickness;
    const innerW = w - wallThickness * 2;
    const innerH = h - wallThickness;
    const innerCornerRadius = 3;
    
    const innerPath = `
      M ${innerX + lipWidth - wallThickness} ${y + lipHeight + lipInnerCurve + wallThickness}
      L ${innerX} ${y + lipHeight + lipInnerCurve + wallThickness}
      L ${innerX} ${y + innerH - innerCornerRadius}
      Q ${innerX} ${y + innerH} ${innerX + innerCornerRadius} ${y + innerH}
      L ${innerX + innerW - innerCornerRadius} ${y + innerH}
      Q ${innerX + innerW} ${y + innerH} ${innerX + innerW} ${y + innerH - innerCornerRadius}
      L ${innerX + innerW} ${y + lipHeight + lipInnerCurve + wallThickness}
      L ${x + w - lipWidth + wallThickness} ${y + lipHeight + lipInnerCurve + wallThickness}
    `;
    
    return { outerPath, innerPath };
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-3xl"
        style={{ minHeight: '200px' }}
      >
        <defs>
          {/* Substrate gradient */}
          <linearGradient id="substrateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8f8f8" />
            <stop offset="50%" stopColor="#eeeeee" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </linearGradient>
        </defs>

        {/* Background - light blue-gray like reference */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#e8eef4" />
        
        {/* Dark header band */}
        <rect 
          x="0" 
          y="0" 
          width={svgWidth} 
          height={startY + substrateHeight / 2} 
          fill="#4a5568"
        />

        {/* Substrate (основание сверху) */}
        <rect
          x={startX - 15}
          y={startY}
          width={totalProfilesWidth + 30}
          height={substrateHeight}
          fill="url(#substrateGradient)"
          stroke="#bbb"
          strokeWidth="0.5"
        />

        {/* Profiles */}
        {Array.from({ length: profileCount }).map((_, i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          const { outerPath } = generateProfilePath(x);
          return (
            <path
              key={i}
              d={outerPath}
              fill="#ffffff"
              stroke="#1a1a1a"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Left height dimension */}
        <g>
          <line 
            x1={startX - 30} 
            y1={startY + substrateHeight} 
            x2={startX - 30} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="1"
          />
          <polygon
            points={`${startX - 30},${startY + substrateHeight} ${startX - 33},${startY + substrateHeight + 5} ${startX - 27},${startY + substrateHeight + 5}`}
            fill="#0088cc"
          />
          <polygon
            points={`${startX - 30},${startY + substrateHeight + scaledHeight} ${startX - 33},${startY + substrateHeight + scaledHeight - 5} ${startX - 27},${startY + substrateHeight + scaledHeight - 5}`}
            fill="#0088cc"
          />
          <line 
            x1={startX - 38} 
            y1={startY + substrateHeight} 
            x2={startX - 5} 
            y2={startY + substrateHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          <line 
            x1={startX - 38} 
            y1={startY + substrateHeight + scaledHeight} 
            x2={startX - 5} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          <text 
            x={startX - 42} 
            y={startY + substrateHeight + scaledHeight / 2 + 4}
            fill="#0088cc"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            transform={`rotate(-90, ${startX - 42}, ${startY + substrateHeight + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Right height dimension */}
        <g>
          <line 
            x1={startX + totalProfilesWidth + 30} 
            y1={startY + substrateHeight} 
            x2={startX + totalProfilesWidth + 30} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="1"
          />
          <polygon
            points={`${startX + totalProfilesWidth + 30},${startY + substrateHeight} ${startX + totalProfilesWidth + 27},${startY + substrateHeight + 5} ${startX + totalProfilesWidth + 33},${startY + substrateHeight + 5}`}
            fill="#0088cc"
          />
          <polygon
            points={`${startX + totalProfilesWidth + 30},${startY + substrateHeight + scaledHeight} ${startX + totalProfilesWidth + 27},${startY + substrateHeight + scaledHeight - 5} ${startX + totalProfilesWidth + 33},${startY + substrateHeight + scaledHeight - 5}`}
            fill="#0088cc"
          />
          <line 
            x1={startX + totalProfilesWidth + 5} 
            y1={startY + substrateHeight} 
            x2={startX + totalProfilesWidth + 38} 
            y2={startY + substrateHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          <line 
            x1={startX + totalProfilesWidth + 5} 
            y1={startY + substrateHeight + scaledHeight} 
            x2={startX + totalProfilesWidth + 38} 
            y2={startY + substrateHeight + scaledHeight}
            stroke="#0088cc"
            strokeWidth="0.5"
          />
          <text 
            x={startX + totalProfilesWidth + 42} 
            y={startY + substrateHeight + scaledHeight / 2 + 4}
            fill="#0088cc"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            transform={`rotate(90, ${startX + totalProfilesWidth + 42}, ${startY + substrateHeight + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Bottom width dimensions - alternating width and gap */}
        {Array.from({ length: profileCount }).map((_, i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          const y = startY + substrateHeight + scaledHeight + 20;
          
          return (
            <g key={`width-${i}`}>
              <line x1={x} y1={y} x2={x + scaledWidth} y2={y} stroke="#0088cc" strokeWidth="1" />
              <polygon points={`${x},${y} ${x + 5},${y - 3} ${x + 5},${y + 3}`} fill="#0088cc" />
              <polygon points={`${x + scaledWidth},${y} ${x + scaledWidth - 5},${y - 3} ${x + scaledWidth - 5},${y + 3}`} fill="#0088cc" />
              <line x1={x} y1={startY + substrateHeight + scaledHeight + 3} x2={x} y2={y + 5} stroke="#0088cc" strokeWidth="0.5" />
              <line x1={x + scaledWidth} y1={startY + substrateHeight + scaledHeight + 3} x2={x + scaledWidth} y2={y + 5} stroke="#0088cc" strokeWidth="0.5" />
              <text x={x + scaledWidth / 2} y={y - 5} fill="#0088cc" fontSize="10" fontWeight="500" textAnchor="middle">
                {width} мм
              </text>
            </g>
          );
        })}

        {/* Gap dimensions */}
        {Array.from({ length: profileCount - 1 }).map((_, i) => {
          const x1 = startX + (i + 1) * scaledWidth + i * scaledGap;
          const x2 = x1 + scaledGap;
          const y = startY + substrateHeight + scaledHeight + 20;
          
          return (
            <g key={`gap-${i}`}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#0088cc" strokeWidth="1" />
              <polygon points={`${x1},${y} ${x1 + 5},${y - 3} ${x1 + 5},${y + 3}`} fill="#0088cc" />
              <polygon points={`${x2},${y} ${x2 - 5},${y - 3} ${x2 - 5},${y + 3}`} fill="#0088cc" />
              <text x={(x1 + x2) / 2} y={y - 5} fill="#0088cc" fontSize="10" fontWeight="500" textAnchor="middle">
                {gap} мм
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Profile name label */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-muted-foreground">
          Профиль V-{width}/{height}
        </span>
        <span className="text-xs text-muted-foreground/70 ml-2">
          (модуль: {width + gap} мм)
        </span>
      </div>
    </div>
  );
};

export default ProfileDiagram;
