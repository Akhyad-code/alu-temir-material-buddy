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

// Схема профиля (вид спереди) как раньше, но форма U-профиля как на фото
interface ProfileDiagramProps {
  dimensions: ProfileDimensions;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ dimensions }) => {
  const { width, height, gap } = dimensions;
  const module = width + gap;

  const profilesCount = 3;

  // Scale to fit different sizes nicely
  const totalRealWidth = profilesCount * width + (profilesCount - 1) * gap;
  const fitWidth = 240; // px in viewBox units
  const scale = Math.min(1, fitWidth / totalRealWidth);

  const scaledWidth = Math.max(18, width * scale);
  const scaledGap = Math.max(10, gap * scale);
  const scaledHeight = Math.max(32, Math.min(86, height * scale * 1.15));

  const wallThickness = Math.max(3, Math.min(6, scaledWidth * 0.1));
  const bottomThickness = wallThickness;
  const innerInsetTop = Math.max(2, wallThickness * 0.5);

  const profileY = 20;
  const startX = 70;
  const totalWidth = profilesCount * scaledWidth + (profilesCount - 1) * scaledGap;

  const viewBoxWidth = startX + totalWidth + 70;
  const viewBoxHeight = profileY + scaledHeight + 95;

  const leftDimX = 25;
  const rightDimX = startX + totalWidth + 25;

  const yDim = profileY + scaledHeight + 26;

  // Bottom dimension segments: width, gap, width, gap, width
  const segments = [
    { kind: 'width' as const, value: width, length: scaledWidth },
    { kind: 'gap' as const, value: gap, length: scaledGap },
    { kind: 'width' as const, value: width, length: scaledWidth },
    { kind: 'gap' as const, value: gap, length: scaledGap },
    { kind: 'width' as const, value: width, length: scaledWidth },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full max-w-[520px] h-auto"
        style={{ minHeight: '140px' }}
      >
        <defs>
          {/* Metal look */}
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="30%" stopColor="#e5e7eb" />
            <stop offset="50%" stopColor="#f3f4f6" />
            <stop offset="70%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="metalGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          {/* Wood insert */}
          <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a0522d" />
            <stop offset="35%" stopColor="#8b4513" />
            <stop offset="70%" stopColor="#a0522d" />
            <stop offset="100%" stopColor="#6b3000" />
          </linearGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Left height dimension */}
        <g>
          <line x1={leftDimX} y1={profileY} x2={leftDimX} y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={leftDimX - 6} y1={profileY} x2={leftDimX + 6} y2={profileY} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={leftDimX - 6} y1={profileY + scaledHeight} x2={leftDimX + 6} y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`${leftDimX},${profileY} ${leftDimX - 3},${profileY + 7} ${leftDimX + 3},${profileY + 7}`} fill="#1a3a5c" />
          <polygon points={`${leftDimX},${profileY + scaledHeight} ${leftDimX - 3},${profileY + scaledHeight - 7} ${leftDimX + 3},${profileY + scaledHeight - 7}`} fill="#1a3a5c" />
          <text
            x={leftDimX - 13}
            y={profileY + scaledHeight / 2}
            fontSize="9"
            fill="#1a3a5c"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, ${leftDimX - 13}, ${profileY + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Right height dimension */}
        <g>
          <line x1={rightDimX} y1={profileY} x2={rightDimX} y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={rightDimX - 6} y1={profileY} x2={rightDimX + 6} y2={profileY} stroke="#1a3a5c" strokeWidth="1" />
          <line x1={rightDimX - 6} y1={profileY + scaledHeight} x2={rightDimX + 6} y2={profileY + scaledHeight} stroke="#1a3a5c" strokeWidth="1" />
          <polygon points={`${rightDimX},${profileY} ${rightDimX - 3},${profileY + 7} ${rightDimX + 3},${profileY + 7}`} fill="#1a3a5c" />
          <polygon points={`${rightDimX},${profileY + scaledHeight} ${rightDimX - 3},${profileY + scaledHeight - 7} ${rightDimX + 3},${profileY + scaledHeight - 7}`} fill="#1a3a5c" />
          <text
            x={rightDimX + 13}
            y={profileY + scaledHeight / 2}
            fontSize="9"
            fill="#1a3a5c"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(90, ${rightDimX + 13}, ${profileY + scaledHeight / 2})`}
          >
            {height} мм
          </text>
        </g>

        {/* Front view: three U-profiles */}
        {[0, 1, 2].map((i) => {
          const x = startX + i * (scaledWidth + scaledGap);
          const innerX = x + wallThickness;
          const innerW = scaledWidth - 2 * wallThickness;
          const innerY = profileY + innerInsetTop;
          const innerH = scaledHeight - bottomThickness - innerInsetTop;

          return (
            <g key={i} filter="url(#softShadow)">
              {/* Inner wood */}
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                rx="1"
                fill="url(#woodGradient)"
                stroke="#5a3000"
                strokeWidth="0.4"
              />

              {/* Left wall */}
              <rect
                x={x}
                y={profileY}
                width={wallThickness}
                height={scaledHeight}
                fill="url(#metalGradient)"
                stroke="#6b7280"
                strokeWidth="0.5"
              />

              {/* Right wall */}
              <rect
                x={x + scaledWidth - wallThickness}
                y={profileY}
                width={wallThickness}
                height={scaledHeight}
                fill="url(#metalGradient)"
                stroke="#6b7280"
                strokeWidth="0.5"
              />

              {/* Bottom */}
              <rect
                x={x}
                y={profileY + scaledHeight - bottomThickness}
                width={scaledWidth}
                height={bottomThickness}
                fill="url(#metalGradientDark)"
                stroke="#6b7280"
                strokeWidth="0.5"
              />

              {/* Highlights */}
              <line
                x1={x + 1.2}
                y1={profileY + 2}
                x2={x + 1.2}
                y2={profileY + scaledHeight - 2}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1"
              />
              <line
                x1={x + scaledWidth - 1.2}
                y1={profileY + 2}
                x2={x + scaledWidth - 1.2}
                y2={profileY + scaledHeight - 2}
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Bottom dimensions: widths and gaps */}
        <g>
          {(() => {
            let cursor = startX;
            return segments.map((s, idx) => {
              const x1 = cursor;
              const x2 = cursor + s.length;
              cursor = x2;

              const stroke = s.kind === 'gap' ? '#c9a54a' : '#1a3a5c';
              const dashed = s.kind === 'gap';

              return (
                <g key={idx}>
                  <line x1={x1} y1={yDim - 8} x2={x1} y2={yDim + 6} stroke={stroke} strokeWidth="1" />
                  <line x1={x2} y1={yDim - 8} x2={x2} y2={yDim + 6} stroke={stroke} strokeWidth="1" />
                  <line
                    x1={x1}
                    y1={yDim}
                    x2={x2}
                    y2={yDim}
                    stroke={stroke}
                    strokeWidth="1"
                    strokeDasharray={dashed ? '3,2' : undefined}
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={yDim + 18}
                    fontSize="9"
                    fill={stroke}
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {s.value}
                  </text>
                </g>
              );
            });
          })()}
        </g>

        {/* Module (width + gap) */}
        <g>
          {(() => {
            const x1 = startX;
            const x2 = startX + scaledWidth + scaledGap;
            const y = yDim + 30;
            return (
              <g>
                <line x1={x1} y1={y - 8} x2={x1} y2={y + 6} stroke="#1a3a5c" strokeWidth="1" />
                <line x1={x2} y1={y - 8} x2={x2} y2={y + 6} stroke="#1a3a5c" strokeWidth="1" />
                <line x1={x1} y1={y} x2={x2} y2={y} stroke="#1a3a5c" strokeWidth="1.5" />
                <polygon points={`${x1},${y} ${x1 + 6},${y - 2} ${x1 + 6},${y + 2}`} fill="#1a3a5c" />
                <polygon points={`${x2},${y} ${x2 - 6},${y - 2} ${x2 - 6},${y + 2}`} fill="#1a3a5c" />
                <text x={(x1 + x2) / 2} y={y + 16} fontSize="9" fill="#1a3a5c" fontWeight="700" textAnchor="middle">
                  {module}
                </text>
                <text x={(x1 + x2) / 2} y={y + 28} fontSize="8" fill="#6b7280" textAnchor="middle">
                  модуль
                </text>
              </g>
            );
          })()}
        </g>

        {/* Caption */}
        <text x={viewBoxWidth / 2} y={viewBoxHeight - 10} fontSize="9" fill="#6b7280" textAnchor="middle">
          Профиль V-{width}/{height}
        </text>
      </svg>
    </div>
  );
};
