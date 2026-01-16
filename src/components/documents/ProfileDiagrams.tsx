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
  
  const profileCount = 5;
  const scale = 2;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledGap = gap * scale;
  
  const lipWidth = 8;
  const lipHeight = 10;
  
  const totalProfilesWidth = profileCount * scaledWidth + (profileCount - 1) * scaledGap;
  const padding = 50;
  const arrowSpace = 45;
  const svgWidth = totalProfilesWidth + padding * 2 + arrowSpace * 2;
  const svgHeight = scaledHeight + padding * 2 + arrowSpace;
  
  const startX = padding + arrowSpace;
  const startY = padding;

  const generateProfilePath = (x: number) => {
    const y = startY;
    const w = scaledWidth;
    const h = scaledHeight;
    
    // U-shape with Г-shaped lips (vertical then horizontal inward)
    return `
      M ${x + lipWidth} ${y}
      L ${x + lipWidth} ${y + lipHeight}
      L ${x} ${y + lipHeight}
      L ${x} ${y + h}
      L ${x + w} ${y + h}
      L ${x + w} ${y + lipHeight}
      L ${x + w - lipWidth} ${y + lipHeight}
      L ${x + w - lipWidth} ${y}
    `;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-3xl"
        style={{ minHeight: '160px' }}
      >
        {/* Profiles */}
        {Array.from({ length: profileCount }).map((_, i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          return (
            <path
              key={i}
              d={generateProfilePath(x)}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Left height */}
        <g>
          <line x1={startX - 25} y1={startY} x2={startX - 25} y2={startY + scaledHeight} stroke="#0088cc" strokeWidth="1" />
          <polygon points={`${startX - 25},${startY} ${startX - 28},${startY + 5} ${startX - 22},${startY + 5}`} fill="#0088cc" />
          <polygon points={`${startX - 25},${startY + scaledHeight} ${startX - 28},${startY + scaledHeight - 5} ${startX - 22},${startY + scaledHeight - 5}`} fill="#0088cc" />
          <text x={startX - 38} y={startY + scaledHeight / 2 + 4} fill="#0088cc" fontSize="11" fontWeight="500" textAnchor="middle" transform={`rotate(-90, ${startX - 38}, ${startY + scaledHeight / 2})`}>
            {height} мм
          </text>
        </g>

        {/* Right height */}
        <g>
          <line x1={startX + totalProfilesWidth + 25} y1={startY} x2={startX + totalProfilesWidth + 25} y2={startY + scaledHeight} stroke="#0088cc" strokeWidth="1" />
          <polygon points={`${startX + totalProfilesWidth + 25},${startY} ${startX + totalProfilesWidth + 22},${startY + 5} ${startX + totalProfilesWidth + 28},${startY + 5}`} fill="#0088cc" />
          <polygon points={`${startX + totalProfilesWidth + 25},${startY + scaledHeight} ${startX + totalProfilesWidth + 22},${startY + scaledHeight - 5} ${startX + totalProfilesWidth + 28},${startY + scaledHeight - 5}`} fill="#0088cc" />
          <text x={startX + totalProfilesWidth + 38} y={startY + scaledHeight / 2 + 4} fill="#0088cc" fontSize="11" fontWeight="500" textAnchor="middle" transform={`rotate(90, ${startX + totalProfilesWidth + 38}, ${startY + scaledHeight / 2})`}>
            {height} мм
          </text>
        </g>

        {/* Width dimensions */}
        {Array.from({ length: profileCount }).map((_, i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          const y = startY + scaledHeight + 18;
          return (
            <g key={`w-${i}`}>
              <line x1={x} y1={y} x2={x + scaledWidth} y2={y} stroke="#0088cc" strokeWidth="1" />
              <polygon points={`${x},${y} ${x + 5},${y - 3} ${x + 5},${y + 3}`} fill="#0088cc" />
              <polygon points={`${x + scaledWidth},${y} ${x + scaledWidth - 5},${y - 3} ${x + scaledWidth - 5},${y + 3}`} fill="#0088cc" />
              <text x={x + scaledWidth / 2} y={y - 5} fill="#0088cc" fontSize="10" fontWeight="500" textAnchor="middle">{width} мм</text>
            </g>
          );
        })}

        {/* Gap dimensions */}
        {Array.from({ length: profileCount - 1 }).map((_, i) => {
          const x1 = startX + (i + 1) * scaledWidth + i * scaledGap;
          const x2 = x1 + scaledGap;
          const y = startY + scaledHeight + 18;
          return (
            <g key={`g-${i}`}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#0088cc" strokeWidth="1" />
              <polygon points={`${x1},${y} ${x1 + 5},${y - 3} ${x1 + 5},${y + 3}`} fill="#0088cc" />
              <polygon points={`${x2},${y} ${x2 - 5},${y - 3} ${x2 - 5},${y + 3}`} fill="#0088cc" />
              <text x={(x1 + x2) / 2} y={y - 5} fill="#0088cc" fontSize="10" fontWeight="500" textAnchor="middle">{gap} мм</text>
            </g>
          );
        })}
      </svg>
      
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-muted-foreground">Профиль V-{width}/{height}</span>
        <span className="text-xs text-muted-foreground/70 ml-2">(модуль: {width + gap} мм)</span>
      </div>
    </div>
  );
};

export default ProfileDiagram;
