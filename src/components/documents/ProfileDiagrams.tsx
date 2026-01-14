import React from 'react';

export interface ProfileDimensions {
  width: number;   // Ширина рейки (26, 59, 93 мм и т.д.)
  height: number;  // Высота рейки (43, 84, 100 мм и т.д.)
  gap: number;     // Зазор между рейками
}

export const DEFAULT_DIMENSIONS: ProfileDimensions = {
  width: 59,
  height: 43,
  gap: 40,
};

// Схема профиля как на референсе - вид сбоку с размерами
interface ProfileDiagramProps {
  dimensions: ProfileDimensions;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ dimensions }) => {
  const { width, height, gap } = dimensions;
  const module = width + gap;
  
  // Масштабирование
  const baseScale = 1.2;
  const scaledWidth = width * baseScale;
  const scaledHeight = Math.min(height * baseScale, 100);
  const scaledGap = gap * baseScale;
  const wallThickness = 4;
  
  const viewBoxWidth = 280;
  const viewBoxHeight = 180;
  
  const startX = 80;
  const profileY = 30;

  return (
    <div className="flex flex-col items-center">
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        className="w-full max-w-[400px] h-auto"
        style={{ minHeight: '140px' }}
      >
        <defs>
          {/* Gradient for metal look */}
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a8a8a8" />
            <stop offset="25%" stopColor="#d4d4d4" />
            <stop offset="50%" stopColor="#e8e8e8" />
            <stop offset="75%" stopColor="#d4d4d4" />
            <stop offset="100%" stopColor="#a8a8a8" />
          </linearGradient>
          <linearGradient id="metalGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#888888" />
          </linearGradient>
          {/* Wood texture simulation */}
          <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="20%" stopColor="#A0522D" />
            <stop offset="40%" stopColor="#8B4513" />
            <stop offset="60%" stopColor="#A0522D" />
            <stop offset="80%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#6B3000" />
          </linearGradient>
        </defs>

        {/* Левый размер высоты */}
        <g className="height-dimension">
          <line x1="25" y1={profileY} x2="25" y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <line x1="18" y1={profileY} x2="32" y2={profileY} stroke="#1a3a5c" strokeWidth="1" />
          <line x1="18" y1={profileY + scaledHeight} x2="32" y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`25,${profileY} 22,${profileY + 6} 28,${profileY + 6}`} fill="#1a3a5c" />
          <polygon points={`25,${profileY + scaledHeight} 22,${profileY + scaledHeight - 6} 28,${profileY + scaledHeight - 6}`} fill="#1a3a5c" />
          <text 
            x="12" 
            y={profileY + scaledHeight / 2 + 3} 
            fontSize="11" 
            fill="#1a3a5c" 
            fontWeight="600"
            textAnchor="middle" 
            transform={`rotate(-90, 12, ${profileY + scaledHeight / 2})`}
          >
            {height}
          </text>
        </g>

        {/* Два U-образных профиля - вид сбоку */}
        {[0, 1].map((i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          return (
            <g key={i}>
              {/* Левая стенка профиля (металл) */}
              <rect 
                x={x} 
                y={profileY} 
                width={wallThickness} 
                height={scaledHeight} 
                fill="url(#metalGradient)"
                stroke="#666" 
                strokeWidth="0.5" 
              />
              
              {/* Правая стенка профиля (металл) */}
              <rect 
                x={x + scaledWidth - wallThickness} 
                y={profileY} 
                width={wallThickness} 
                height={scaledHeight} 
                fill="url(#metalGradient)"
                stroke="#666" 
                strokeWidth="0.5" 
              />
              
              {/* Дно профиля (металл) */}
              <rect 
                x={x} 
                y={profileY + scaledHeight - wallThickness} 
                width={scaledWidth} 
                height={wallThickness} 
                fill="url(#metalGradientDark)"
                stroke="#666" 
                strokeWidth="0.5" 
              />
              
              {/* Внутренняя часть (дерево/покрытие) */}
              <rect 
                x={x + wallThickness} 
                y={profileY} 
                width={scaledWidth - 2 * wallThickness} 
                height={scaledHeight - wallThickness} 
                fill="url(#woodGradient)"
                stroke="#5a3000" 
                strokeWidth="0.3" 
              />
              
              {/* Блик на левой стенке */}
              <line 
                x1={x + 1.5} 
                y1={profileY + 3} 
                x2={x + 1.5} 
                y2={profileY + scaledHeight - 5} 
                stroke="rgba(255,255,255,0.5)" 
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Нижние размеры */}
        <g className="bottom-dimensions">
          {/* Ширина первого профиля */}
          <line x1={startX} y1={profileY + scaledHeight + 12} x2={startX} y2={profileY + scaledHeight + 22} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 12} x2={startX + scaledWidth} y2={profileY + scaledHeight + 22} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX} y1={profileY + scaledHeight + 17} x2={startX + scaledWidth} y2={profileY + scaledHeight + 17} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`${startX},${profileY + scaledHeight + 17} ${startX + 5},${profileY + scaledHeight + 15} ${startX + 5},${profileY + scaledHeight + 19}`} fill="#1a3a5c" />
          <polygon points={`${startX + scaledWidth},${profileY + scaledHeight + 17} ${startX + scaledWidth - 5},${profileY + scaledHeight + 15} ${startX + scaledWidth - 5},${profileY + scaledHeight + 19}`} fill="#1a3a5c" />
          <text x={startX + scaledWidth / 2} y={profileY + scaledHeight + 32} fontSize="10" fill="#1a3a5c" fontWeight="600" textAnchor="middle">{width}</text>

          {/* Зазор */}
          <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 12} x2={startX + scaledWidth} y2={profileY + scaledHeight + 22} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 12} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 22} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 17} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 17} stroke="#1a3a5c" strokeWidth="1" />
          <text x={startX + scaledWidth + scaledGap / 2} y={profileY + scaledHeight + 32} fontSize="10" fill="#1a3a5c" fontWeight="600" textAnchor="middle">{gap}</text>
        </g>

        {/* Модуль - общий размер */}
        <g className="module-dimension">
          <line x1={startX} y1={profileY + scaledHeight + 42} x2={startX} y2={profileY + scaledHeight + 52} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 42} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 52} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX} y1={profileY + scaledHeight + 47} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 47} stroke="#1a3a5c" strokeWidth="1.5" />
          <polygon points={`${startX},${profileY + scaledHeight + 47} ${startX + 6},${profileY + scaledHeight + 45} ${startX + 6},${profileY + scaledHeight + 49}`} fill="#1a3a5c" />
          <polygon points={`${startX + scaledWidth + scaledGap},${profileY + scaledHeight + 47} ${startX + scaledWidth + scaledGap - 6},${profileY + scaledHeight + 45} ${startX + scaledWidth + scaledGap - 6},${profileY + scaledHeight + 49}`} fill="#1a3a5c" />
          <text x={startX + (scaledWidth + scaledGap) / 2} y={profileY + scaledHeight + 62} fontSize="10" fill="#1a3a5c" fontWeight="600" textAnchor="middle">{module}</text>
          <text x={startX + (scaledWidth + scaledGap) / 2} y={profileY + scaledHeight + 74} fontSize="9" fill="#666" textAnchor="middle">модуль</text>
        </g>

        {/* Метка профиля справа */}
        <g className="profile-label">
          <text 
            x={viewBoxWidth - 25} 
            y={profileY + scaledHeight / 2} 
            fontSize="10" 
            fill="#1a3a5c" 
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(90, ${viewBoxWidth - 25}, ${profileY + scaledHeight / 2})`}
          >
            V-{width}/{height}
          </text>
        </g>
      </svg>
    </div>
  );
};
