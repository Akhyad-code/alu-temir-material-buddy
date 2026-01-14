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

// Красивый U-образный профиль реечного потолка
interface ProfileDiagramProps {
  dimensions: ProfileDimensions;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ dimensions }) => {
  const { width, height, gap } = dimensions;
  
  // Масштабирование для отображения
  const maxViewWidth = 380;
  const profileCount = 3;
  const totalRealWidth = profileCount * width + (profileCount - 1) * gap;
  const scale = Math.min(1, (maxViewWidth - 100) / totalRealWidth);
  
  const scaledWidth = Math.max(20, width * scale);
  const scaledHeight = Math.min(70, Math.max(35, height * scale * 0.7));
  const scaledGap = Math.max(15, gap * scale);
  const wallThickness = Math.max(3, scaledWidth * 0.1);
  
  const startX = 55;
  const profileY = 25;
  
  const totalWidth = profileCount * scaledWidth + (profileCount - 1) * scaledGap;
  const viewBoxWidth = totalWidth + 110;
  const viewBoxHeight = scaledHeight + 75;

  // Gradient IDs
  const gradientId = `profileGradient-${width}-${height}`;
  const shadowGradientId = `shadowGradient-${width}-${height}`;

  return (
    <div className="flex flex-col items-center">
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        className="w-full max-w-[450px] h-auto"
        style={{ minHeight: '120px' }}
      >
        <defs>
          {/* Gradient for profiles */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="30%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#e5e7eb" />
            <stop offset="70%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          {/* Inner shadow */}
          <linearGradient id={shadowGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.15"/>
          </filter>
        </defs>

        {/* Левый размер высоты */}
        <g className="dimension-left">
          <line x1="20" y1={profileY} x2="20" y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <line x1="15" y1={profileY} x2="25" y2={profileY} stroke="#1a3a5c" strokeWidth="1" />
          <line x1="15" y1={profileY + scaledHeight} x2="25" y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`20,${profileY} 17,${profileY + 6} 23,${profileY + 6}`} fill="#1a3a5c" />
          <polygon points={`20,${profileY + scaledHeight} 17,${profileY + scaledHeight - 6} 23,${profileY + scaledHeight - 6}`} fill="#1a3a5c" />
          <text 
            x="10" 
            y={profileY + scaledHeight / 2} 
            fontSize="9" 
            fill="#1a3a5c" 
            fontWeight="500"
            textAnchor="middle" 
            transform={`rotate(-90, 10, ${profileY + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Правый размер высоты */}
        <g className="dimension-right">
          <line x1={viewBoxWidth - 20} y1={profileY} x2={viewBoxWidth - 20} y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={viewBoxWidth - 25} y1={profileY} x2={viewBoxWidth - 15} y2={profileY} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={viewBoxWidth - 25} y1={profileY + scaledHeight} x2={viewBoxWidth - 15} y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`${viewBoxWidth - 20},${profileY} ${viewBoxWidth - 23},${profileY + 6} ${viewBoxWidth - 17},${profileY + 6}`} fill="#1a3a5c" />
          <polygon points={`${viewBoxWidth - 20},${profileY + scaledHeight} ${viewBoxWidth - 23},${profileY + scaledHeight - 6} ${viewBoxWidth - 17},${profileY + scaledHeight - 6}`} fill="#1a3a5c" />
          <text 
            x={viewBoxWidth - 10} 
            y={profileY + scaledHeight / 2} 
            fontSize="9" 
            fill="#1a3a5c" 
            fontWeight="500"
            textAnchor="middle" 
            transform={`rotate(90, ${viewBoxWidth - 10}, ${profileY + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* U-образные профили с 3D эффектом */}
        {[0, 1, 2].map((i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          return (
            <g key={i} filter="url(#dropShadow)">
              {/* Внутренняя часть (фон) */}
              <rect 
                x={x + wallThickness} 
                y={profileY} 
                width={scaledWidth - 2 * wallThickness} 
                height={scaledHeight - wallThickness} 
                fill={`url(#${shadowGradientId})`}
              />
              
              {/* Левая стенка */}
              <rect 
                x={x} 
                y={profileY} 
                width={wallThickness} 
                height={scaledHeight} 
                fill={`url(#${gradientId})`}
                stroke="#6b7280" 
                strokeWidth="0.5" 
              />
              
              {/* Правая стенка */}
              <rect 
                x={x + scaledWidth - wallThickness} 
                y={profileY} 
                width={wallThickness} 
                height={scaledHeight} 
                fill={`url(#${gradientId})`}
                stroke="#6b7280" 
                strokeWidth="0.5" 
              />
              
              {/* Дно */}
              <rect 
                x={x} 
                y={profileY + scaledHeight - wallThickness} 
                width={scaledWidth} 
                height={wallThickness} 
                fill={`url(#${gradientId})`}
                stroke="#6b7280" 
                strokeWidth="0.5" 
              />
              
              {/* Блик на левой стенке */}
              <rect 
                x={x + 1} 
                y={profileY + 2} 
                width={1} 
                height={scaledHeight - 6} 
                fill="rgba(255,255,255,0.4)"
              />
            </g>
          );
        })}

        {/* Нижние размеры */}
        <g className="dimensions-bottom">
          {/* Ширина первого профиля */}
          <line x1={startX} y1={profileY + scaledHeight + 10} x2={startX} y2={profileY + scaledHeight + 18} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 10} x2={startX + scaledWidth} y2={profileY + scaledHeight + 18} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX} y1={profileY + scaledHeight + 14} x2={startX + scaledWidth} y2={profileY + scaledHeight + 14} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`${startX},${profileY + scaledHeight + 14} ${startX + 5},${profileY + scaledHeight + 12} ${startX + 5},${profileY + scaledHeight + 16}`} fill="#1a3a5c" />
          <polygon points={`${startX + scaledWidth},${profileY + scaledHeight + 14} ${startX + scaledWidth - 5},${profileY + scaledHeight + 12} ${startX + scaledWidth - 5},${profileY + scaledHeight + 16}`} fill="#1a3a5c" />
          <text x={startX + scaledWidth / 2} y={profileY + scaledHeight + 28} fontSize="8" fill="#1a3a5c" fontWeight="500" textAnchor="middle">{width}</text>

          {/* Зазор 1 */}
          <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 10} x2={startX + scaledWidth} y2={profileY + scaledHeight + 18} stroke="#c9a54a" strokeWidth="1" />
          <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 10} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 18} stroke="#c9a54a" strokeWidth="1" />
          <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 14} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#c9a54a" strokeWidth="1" strokeDasharray="2,1" />
          <text x={startX + scaledWidth + scaledGap / 2} y={profileY + scaledHeight + 28} fontSize="8" fill="#c9a54a" fontWeight="500" textAnchor="middle">{gap}</text>

          {/* Ширина второго профиля */}
          <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 10} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 18} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 10} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 18} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 14} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#1a3a5c" strokeWidth="1" />
          <text x={startX + 1.5 * scaledWidth + scaledGap} y={profileY + scaledHeight + 28} fontSize="8" fill="#1a3a5c" fontWeight="500" textAnchor="middle">{width}</text>

          {/* Зазор 2 */}
          <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 10} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 18} stroke="#c9a54a" strokeWidth="1" />
          <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 10} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 18} stroke="#c9a54a" strokeWidth="1" />
          <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 14} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#c9a54a" strokeWidth="1" strokeDasharray="2,1" />
          <text x={startX + 2 * scaledWidth + 1.5 * scaledGap} y={profileY + scaledHeight + 28} fontSize="8" fill="#c9a54a" fontWeight="500" textAnchor="middle">{gap}</text>

          {/* Ширина третьего профиля */}
          <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 10} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 18} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + 3 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 10} x2={startX + 3 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 18} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 14} x2={startX + 3 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#1a3a5c" strokeWidth="1" />
          <text x={startX + 2.5 * scaledWidth + 2 * scaledGap} y={profileY + scaledHeight + 28} fontSize="8" fill="#1a3a5c" fontWeight="500" textAnchor="middle">{width}</text>
        </g>

        {/* Модуль (ширина + зазор) */}
        <g className="module-dimension">
          <line x1={startX} y1={profileY + scaledHeight + 38} x2={startX} y2={profileY + scaledHeight + 46} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 38} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 46} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={startX} y1={profileY + scaledHeight + 42} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 42} stroke="#1a3a5c" strokeWidth="1.5" />
          <polygon points={`${startX},${profileY + scaledHeight + 42} ${startX + 6},${profileY + scaledHeight + 40} ${startX + 6},${profileY + scaledHeight + 44}`} fill="#1a3a5c" />
          <polygon points={`${startX + scaledWidth + scaledGap},${profileY + scaledHeight + 42} ${startX + scaledWidth + scaledGap - 6},${profileY + scaledHeight + 40} ${startX + scaledWidth + scaledGap - 6},${profileY + scaledHeight + 44}`} fill="#1a3a5c" />
          <rect x={startX + (scaledWidth + scaledGap) / 2 - 30} y={profileY + scaledHeight + 48} width="60" height="14" rx="2" fill="#1a3a5c" />
          <text x={startX + (scaledWidth + scaledGap) / 2} y={profileY + scaledHeight + 58} fontSize="8" fill="white" fontWeight="600" textAnchor="middle">
            модуль {width + gap}
          </text>
        </g>
      </svg>
      
      {/* Label */}
      <div className="mt-2 px-4 py-1.5 bg-gradient-to-r from-[#1a3a5c] to-[#2d5a87] rounded-full">
        <span className="text-[10px] text-white font-medium tracking-wide">
          Профиль V-{width}/{height}
        </span>
      </div>
    </div>
  );
};
