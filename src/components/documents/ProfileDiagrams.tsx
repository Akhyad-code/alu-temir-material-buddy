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

// U-образный профиль реечного потолка
interface ProfileDiagramProps {
  dimensions: ProfileDimensions;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ dimensions }) => {
  const { width, height, gap } = dimensions;
  
  // Масштабирование для отображения
  const maxViewWidth = 400;
  const profileCount = 3;
  const totalRealWidth = profileCount * width + (profileCount - 1) * gap;
  const scale = Math.min(1, (maxViewWidth - 80) / totalRealWidth);
  
  const scaledWidth = Math.max(15, width * scale);
  const scaledHeight = Math.min(80, Math.max(30, height * scale * 0.8));
  const scaledGap = Math.max(10, gap * scale);
  const wallThickness = Math.max(2, scaledWidth * 0.08);
  
  const startX = 40;
  const profileY = 20;
  
  const totalWidth = profileCount * scaledWidth + (profileCount - 1) * scaledGap;
  const viewBoxWidth = totalWidth + 80;
  const viewBoxHeight = scaledHeight + 60;

  return (
    <div className="flex flex-col items-center py-3">
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        className="w-full max-w-[480px] h-auto"
        style={{ minHeight: '90px' }}
      >
        {/* Левый размер высоты */}
        <line x1="15" y1={profileY} x2="15" y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <line x1="10" y1={profileY} x2="20" y2={profileY} stroke="#0066cc" strokeWidth="1" />
        <line x1="10" y1={profileY + scaledHeight} x2="20" y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <polygon points={`15,${profileY} 13,${profileY + 4} 17,${profileY + 4}`} fill="#0066cc" />
        <polygon points={`15,${profileY + scaledHeight} 13,${profileY + scaledHeight - 4} 17,${profileY + scaledHeight - 4}`} fill="#0066cc" />
        <text 
          x="8" 
          y={profileY + scaledHeight / 2} 
          fontSize="8" 
          fill="#0066cc" 
          textAnchor="middle" 
          transform={`rotate(-90, 8, ${profileY + scaledHeight / 2})`}
        >
          {height} мм
        </text>

        {/* Правый размер высоты */}
        <line x1={viewBoxWidth - 15} y1={profileY} x2={viewBoxWidth - 15} y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <line x1={viewBoxWidth - 20} y1={profileY} x2={viewBoxWidth - 10} y2={profileY} stroke="#0066cc" strokeWidth="1" />
        <line x1={viewBoxWidth - 20} y1={profileY + scaledHeight} x2={viewBoxWidth - 10} y2={profileY + scaledHeight} stroke="#0066cc" strokeWidth="1" />
        <polygon points={`${viewBoxWidth - 15},${profileY} ${viewBoxWidth - 17},${profileY + 4} ${viewBoxWidth - 13},${profileY + 4}`} fill="#0066cc" />
        <polygon points={`${viewBoxWidth - 15},${profileY + scaledHeight} ${viewBoxWidth - 17},${profileY + scaledHeight - 4} ${viewBoxWidth - 13},${profileY + scaledHeight - 4}`} fill="#0066cc" />
        <text 
          x={viewBoxWidth - 8} 
          y={profileY + scaledHeight / 2} 
          fontSize="8" 
          fill="#0066cc" 
          textAnchor="middle" 
          transform={`rotate(90, ${viewBoxWidth - 8}, ${profileY + scaledHeight / 2})`}
        >
          {height} мм
        </text>

        {/* U-образные профили */}
        {[0, 1, 2].map((i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          return (
            <g key={i}>
              {/* Левая стенка U-профиля */}
              <rect 
                x={x} 
                y={profileY} 
                width={wallThickness} 
                height={scaledHeight} 
                fill="#666"
                stroke="#333" 
                strokeWidth="0.5" 
              />
              {/* Правая стенка U-профиля */}
              <rect 
                x={x + scaledWidth - wallThickness} 
                y={profileY} 
                width={wallThickness} 
                height={scaledHeight} 
                fill="#666"
                stroke="#333" 
                strokeWidth="0.5" 
              />
              {/* Дно U-профиля */}
              <rect 
                x={x} 
                y={profileY + scaledHeight - wallThickness} 
                width={scaledWidth} 
                height={wallThickness} 
                fill="#666"
                stroke="#333" 
                strokeWidth="0.5" 
              />
              {/* Внутренняя часть (для визуализации) */}
              <rect 
                x={x + wallThickness} 
                y={profileY} 
                width={scaledWidth - 2 * wallThickness} 
                height={scaledHeight - wallThickness} 
                fill="#f5f5f5"
                stroke="none" 
              />
            </g>
          );
        })}

        {/* Нижние размеры */}
        {/* Ширина первого профиля */}
        <line x1={startX} y1={profileY + scaledHeight + 8} x2={startX} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX} y1={profileY + scaledHeight + 11} x2={startX + scaledWidth} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <polygon points={`${startX},${profileY + scaledHeight + 11} ${startX + 4},${profileY + scaledHeight + 9} ${startX + 4},${profileY + scaledHeight + 13}`} fill="#0066cc" />
        <polygon points={`${startX + scaledWidth},${profileY + scaledHeight + 11} ${startX + scaledWidth - 4},${profileY + scaledHeight + 9} ${startX + scaledWidth - 4},${profileY + scaledHeight + 13}`} fill="#0066cc" />
        <text x={startX + scaledWidth / 2} y={profileY + scaledHeight + 23} fontSize="7" fill="#0066cc" textAnchor="middle">{width}</text>

        {/* Зазор 1 */}
        <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth} y1={profileY + scaledHeight + 11} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + scaledWidth + scaledGap / 2} y={profileY + scaledHeight + 23} fontSize="7" fill="#0066cc" textAnchor="middle">{gap}</text>

        {/* Ширина второго профиля */}
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 11} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + 1.5 * scaledWidth + scaledGap} y={profileY + scaledHeight + 23} fontSize="7" fill="#0066cc" textAnchor="middle">{width}</text>

        {/* Зазор 2 */}
        <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + scaledGap} y1={profileY + scaledHeight + 11} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + 2 * scaledWidth + 1.5 * scaledGap} y={profileY + scaledHeight + 23} fontSize="7" fill="#0066cc" textAnchor="middle">{gap}</text>

        {/* Ширина третьего профиля */}
        <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 2 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 3 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 8} x2={startX + 3 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 14} stroke="#0066cc" strokeWidth="1" />
        <line x1={startX + 2 * scaledWidth + 2 * scaledGap} y1={profileY + scaledHeight + 11} x2={startX + 3 * scaledWidth + 2 * scaledGap} y2={profileY + scaledHeight + 11} stroke="#0066cc" strokeWidth="1" />
        <text x={startX + 2.5 * scaledWidth + 2 * scaledGap} y={profileY + scaledHeight + 23} fontSize="7" fill="#0066cc" textAnchor="middle">{width}</text>

        {/* Общий модуль */}
        <line x1={startX} y1={profileY + scaledHeight + 30} x2={startX} y2={profileY + scaledHeight + 36} stroke="#cc6600" strokeWidth="1" />
        <line x1={startX + scaledWidth + scaledGap} y1={profileY + scaledHeight + 30} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 36} stroke="#cc6600" strokeWidth="1" />
        <line x1={startX} y1={profileY + scaledHeight + 33} x2={startX + scaledWidth + scaledGap} y2={profileY + scaledHeight + 33} stroke="#cc6600" strokeWidth="1" />
        <text x={startX + (scaledWidth + scaledGap) / 2} y={profileY + scaledHeight + 43} fontSize="7" fill="#cc6600" textAnchor="middle">модуль {width + gap}</text>
      </svg>
      <p className="text-[9px] text-gray-500 mt-1">Профиль V-{width}/{height}</p>
    </div>
  );
};
