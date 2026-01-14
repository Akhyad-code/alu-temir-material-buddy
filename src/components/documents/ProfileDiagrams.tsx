import React from 'react';

export interface ProfileType {
  id: string;
  name: string;
  width: number;
  height: number;
  gap: number;
}

export const PROFILE_TYPES: ProfileType[] = [
  { id: 'V59x43', name: 'V59x43', width: 59, height: 43, gap: 40 },
  { id: 'V30x75', name: 'V30x75', width: 30, height: 75, gap: 25 },
  { id: 'V26x100', name: 'V26x100', width: 26, height: 100, gap: 50 },
  { id: 'V120x50', name: 'V120x50', width: 120, height: 50, gap: 30 },
  { id: 'V80x35', name: 'V80x35', width: 80, height: 35, gap: 35 },
  { id: 'V40x60', name: 'V40x60', width: 40, height: 60, gap: 45 },
];

// V59x43 - Standard T-profile
const DiagramV59x43: React.FC = () => (
  <svg viewBox="0 0 400 120" className="w-full max-w-[500px] h-auto">
    {/* Left height dimension */}
    <line x1="15" y1="20" x2="15" y2="90" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="20" x2="20" y2="20" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="90" x2="20" y2="90" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="15,20 12,27 18,27" fill="#0066cc" />
    <polygon points="15,90 12,83 18,83" fill="#0066cc" />
    <text x="8" y="58" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 8, 58)">43 мм</text>

    {/* Right height dimension */}
    <line x1="385" y1="20" x2="385" y2="90" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="20" x2="390" y2="20" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="90" x2="390" y2="90" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="385,20 382,27 388,27" fill="#0066cc" />
    <polygon points="385,90 382,83 388,83" fill="#0066cc" />
    <text x="392" y="58" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 392, 58)">43 мм</text>

    {/* Three T-profiles */}
    {/* Profile 1 */}
    <rect x="40" y="20" width="59" height="7" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="65" y="20" width="8" height="70" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="40" y="83" width="59" height="7" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 2 */}
    <rect x="139" y="20" width="59" height="7" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="164" y="20" width="8" height="70" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="139" y="83" width="59" height="7" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 3 */}
    <rect x="238" y="20" width="59" height="7" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="263" y="20" width="8" height="70" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="238" y="83" width="59" height="7" fill="none" stroke="#333" strokeWidth="1.5" />

    {/* Bottom dimensions */}
    {/* Profile 1 width */}
    <line x1="40" y1="100" x2="40" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="99" y1="100" x2="99" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="40" y1="103" x2="99" y2="103" stroke="#0066cc" strokeWidth="1" />
    <polygon points="40,103 47,101 47,105" fill="#0066cc" />
    <polygon points="99,103 92,101 92,105" fill="#0066cc" />
    <text x="69" y="115" fontSize="8" fill="#0066cc" textAnchor="middle">59 мм</text>

    {/* Gap 1 */}
    <line x1="99" y1="100" x2="99" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="139" y1="100" x2="139" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="99" y1="103" x2="139" y2="103" stroke="#0066cc" strokeWidth="1" />
    <text x="119" y="115" fontSize="8" fill="#0066cc" textAnchor="middle">40 мм</text>

    {/* Profile 2 width */}
    <line x1="139" y1="100" x2="139" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="198" y1="100" x2="198" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="139" y1="103" x2="198" y2="103" stroke="#0066cc" strokeWidth="1" />
    <text x="168" y="115" fontSize="8" fill="#0066cc" textAnchor="middle">59 мм</text>

    {/* Gap 2 */}
    <line x1="198" y1="100" x2="198" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="238" y1="100" x2="238" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="198" y1="103" x2="238" y2="103" stroke="#0066cc" strokeWidth="1" />
    <text x="218" y="115" fontSize="8" fill="#0066cc" textAnchor="middle">40 мм</text>

    {/* Profile 3 width */}
    <line x1="238" y1="100" x2="238" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="297" y1="100" x2="297" y2="106" stroke="#0066cc" strokeWidth="1" />
    <line x1="238" y1="103" x2="297" y2="103" stroke="#0066cc" strokeWidth="1" />
    <text x="267" y="115" fontSize="8" fill="#0066cc" textAnchor="middle">59 мм</text>
  </svg>
);

// V30x75 - Narrow tall profile
const DiagramV30x75: React.FC = () => (
  <svg viewBox="0 0 400 140" className="w-full max-w-[500px] h-auto">
    {/* Left height dimension */}
    <line x1="15" y1="15" x2="15" y2="115" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="15" x2="20" y2="15" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="115" x2="20" y2="115" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="15,15 12,22 18,22" fill="#0066cc" />
    <polygon points="15,115 12,108 18,108" fill="#0066cc" />
    <text x="8" y="68" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 8, 68)">75 мм</text>

    {/* Right height dimension */}
    <line x1="385" y1="15" x2="385" y2="115" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="15" x2="390" y2="15" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="115" x2="390" y2="115" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="385,15 382,22 388,22" fill="#0066cc" />
    <polygon points="385,115 382,108 388,108" fill="#0066cc" />
    <text x="392" y="68" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 392, 68)">75 мм</text>

    {/* Four narrow profiles */}
    {/* Profile 1 */}
    <rect x="50" y="15" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="61" y="15" width="8" height="100" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="50" y="109" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 2 */}
    <rect x="105" y="15" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="116" y="15" width="8" height="100" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="105" y="109" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 3 */}
    <rect x="160" y="15" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="171" y="15" width="8" height="100" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="160" y="109" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 4 */}
    <rect x="215" y="15" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="226" y="15" width="8" height="100" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="215" y="109" width="30" height="6" fill="none" stroke="#333" strokeWidth="1.5" />

    {/* Bottom dimensions */}
    <line x1="50" y1="125" x2="50" y2="131" stroke="#0066cc" strokeWidth="1" />
    <line x1="80" y1="125" x2="80" y2="131" stroke="#0066cc" strokeWidth="1" />
    <line x1="50" y1="128" x2="80" y2="128" stroke="#0066cc" strokeWidth="1" />
    <text x="65" y="138" fontSize="8" fill="#0066cc" textAnchor="middle">30 мм</text>

    <line x1="80" y1="125" x2="80" y2="131" stroke="#0066cc" strokeWidth="1" />
    <line x1="105" y1="125" x2="105" y2="131" stroke="#0066cc" strokeWidth="1" />
    <line x1="80" y1="128" x2="105" y2="128" stroke="#0066cc" strokeWidth="1" />
    <text x="92" y="138" fontSize="8" fill="#0066cc" textAnchor="middle">25 мм</text>

    <line x1="105" y1="125" x2="105" y2="131" stroke="#0066cc" strokeWidth="1" />
    <line x1="135" y1="125" x2="135" y2="131" stroke="#0066cc" strokeWidth="1" />
    <line x1="105" y1="128" x2="135" y2="128" stroke="#0066cc" strokeWidth="1" />
    <text x="120" y="138" fontSize="8" fill="#0066cc" textAnchor="middle">30 мм</text>
  </svg>
);

// V26x100 - Very narrow extra tall profile
const DiagramV26x100: React.FC = () => (
  <svg viewBox="0 0 400 160" className="w-full max-w-[500px] h-auto">
    {/* Left height dimension */}
    <line x1="15" y1="10" x2="15" y2="130" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="10" x2="20" y2="10" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="130" x2="20" y2="130" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="15,10 12,17 18,17" fill="#0066cc" />
    <polygon points="15,130 12,123 18,123" fill="#0066cc" />
    <text x="8" y="75" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 8, 75)">100 мм</text>

    {/* Right height dimension */}
    <line x1="385" y1="10" x2="385" y2="130" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="10" x2="390" y2="10" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="130" x2="390" y2="130" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="385,10 382,17 388,17" fill="#0066cc" />
    <polygon points="385,130 382,123 388,123" fill="#0066cc" />
    <text x="392" y="75" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 392, 75)">100 мм</text>

    {/* Three slim tall profiles */}
    {/* Profile 1 */}
    <rect x="60" y="10" width="26" height="5" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="69" y="10" width="8" height="120" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="60" y="125" width="26" height="5" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 2 */}
    <rect x="136" y="10" width="26" height="5" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="145" y="10" width="8" height="120" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="136" y="125" width="26" height="5" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 3 */}
    <rect x="212" y="10" width="26" height="5" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="221" y="10" width="8" height="120" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="212" y="125" width="26" height="5" fill="none" stroke="#333" strokeWidth="1.5" />

    {/* Bottom dimensions */}
    <line x1="60" y1="142" x2="60" y2="148" stroke="#0066cc" strokeWidth="1" />
    <line x1="86" y1="142" x2="86" y2="148" stroke="#0066cc" strokeWidth="1" />
    <line x1="60" y1="145" x2="86" y2="145" stroke="#0066cc" strokeWidth="1" />
    <text x="73" y="155" fontSize="8" fill="#0066cc" textAnchor="middle">26 мм</text>

    <line x1="86" y1="142" x2="86" y2="148" stroke="#0066cc" strokeWidth="1" />
    <line x1="136" y1="142" x2="136" y2="148" stroke="#0066cc" strokeWidth="1" />
    <line x1="86" y1="145" x2="136" y2="145" stroke="#0066cc" strokeWidth="1" />
    <text x="111" y="155" fontSize="8" fill="#0066cc" textAnchor="middle">50 мм</text>

    <line x1="136" y1="142" x2="136" y2="148" stroke="#0066cc" strokeWidth="1" />
    <line x1="162" y1="142" x2="162" y2="148" stroke="#0066cc" strokeWidth="1" />
    <line x1="136" y1="145" x2="162" y2="145" stroke="#0066cc" strokeWidth="1" />
    <text x="149" y="155" fontSize="8" fill="#0066cc" textAnchor="middle">26 мм</text>
  </svg>
);

// V120x50 - Wide profile
const DiagramV120x50: React.FC = () => (
  <svg viewBox="0 0 420 110" className="w-full max-w-[520px] h-auto">
    {/* Left height dimension */}
    <line x1="12" y1="15" x2="12" y2="80" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="7" y1="15" x2="17" y2="15" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="7" y1="80" x2="17" y2="80" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="12,15 9,22 15,22" fill="#0066cc" />
    <polygon points="12,80 9,73 15,73" fill="#0066cc" />
    <text x="6" y="50" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 6, 50)">50 мм</text>

    {/* Right height dimension */}
    <line x1="408" y1="15" x2="408" y2="80" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="403" y1="15" x2="413" y2="15" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="403" y1="80" x2="413" y2="80" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="408,15 405,22 411,22" fill="#0066cc" />
    <polygon points="408,80 405,73 411,73" fill="#0066cc" />
    <text x="414" y="50" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 414, 50)">50 мм</text>

    {/* Two wide profiles */}
    {/* Profile 1 */}
    <rect x="30" y="15" width="120" height="8" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="82" y="15" width="10" height="65" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="30" y="72" width="120" height="8" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 2 */}
    <rect x="180" y="15" width="120" height="8" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="232" y="15" width="10" height="65" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="180" y="72" width="120" height="8" fill="none" stroke="#333" strokeWidth="1.5" />

    {/* Bottom dimensions */}
    <line x1="30" y1="92" x2="30" y2="98" stroke="#0066cc" strokeWidth="1" />
    <line x1="150" y1="92" x2="150" y2="98" stroke="#0066cc" strokeWidth="1" />
    <line x1="30" y1="95" x2="150" y2="95" stroke="#0066cc" strokeWidth="1" />
    <polygon points="30,95 37,93 37,97" fill="#0066cc" />
    <polygon points="150,95 143,93 143,97" fill="#0066cc" />
    <text x="90" y="106" fontSize="8" fill="#0066cc" textAnchor="middle">120 мм</text>

    <line x1="150" y1="92" x2="150" y2="98" stroke="#0066cc" strokeWidth="1" />
    <line x1="180" y1="92" x2="180" y2="98" stroke="#0066cc" strokeWidth="1" />
    <line x1="150" y1="95" x2="180" y2="95" stroke="#0066cc" strokeWidth="1" />
    <text x="165" y="106" fontSize="8" fill="#0066cc" textAnchor="middle">30 мм</text>

    <line x1="180" y1="92" x2="180" y2="98" stroke="#0066cc" strokeWidth="1" />
    <line x1="300" y1="92" x2="300" y2="98" stroke="#0066cc" strokeWidth="1" />
    <line x1="180" y1="95" x2="300" y2="95" stroke="#0066cc" strokeWidth="1" />
    <text x="240" y="106" fontSize="8" fill="#0066cc" textAnchor="middle">120 мм</text>
  </svg>
);

// V80x35 - Medium width low profile
const DiagramV80x35: React.FC = () => (
  <svg viewBox="0 0 400 100" className="w-full max-w-[500px] h-auto">
    {/* Left height dimension */}
    <line x1="15" y1="20" x2="15" y2="70" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="20" x2="20" y2="20" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="70" x2="20" y2="70" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="15,20 12,27 18,27" fill="#0066cc" />
    <polygon points="15,70 12,63 18,63" fill="#0066cc" />
    <text x="8" y="48" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 8, 48)">35 мм</text>

    {/* Right height dimension */}
    <line x1="385" y1="20" x2="385" y2="70" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="20" x2="390" y2="20" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="70" x2="390" y2="70" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="385,20 382,27 388,27" fill="#0066cc" />
    <polygon points="385,70 382,63 388,63" fill="#0066cc" />
    <text x="392" y="48" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 392, 48)">35 мм</text>

    {/* Three medium profiles */}
    {/* Profile 1 */}
    <rect x="40" y="20" width="80" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="74" y="20" width="9" height="50" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="40" y="64" width="80" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 2 */}
    <rect x="155" y="20" width="80" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="189" y="20" width="9" height="50" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="155" y="64" width="80" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 3 */}
    <rect x="270" y="20" width="80" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="304" y="20" width="9" height="50" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="270" y="64" width="80" height="6" fill="none" stroke="#333" strokeWidth="1.5" />

    {/* Bottom dimensions */}
    <line x1="40" y1="80" x2="40" y2="86" stroke="#0066cc" strokeWidth="1" />
    <line x1="120" y1="80" x2="120" y2="86" stroke="#0066cc" strokeWidth="1" />
    <line x1="40" y1="83" x2="120" y2="83" stroke="#0066cc" strokeWidth="1" />
    <text x="80" y="95" fontSize="8" fill="#0066cc" textAnchor="middle">80 мм</text>

    <line x1="120" y1="80" x2="120" y2="86" stroke="#0066cc" strokeWidth="1" />
    <line x1="155" y1="80" x2="155" y2="86" stroke="#0066cc" strokeWidth="1" />
    <line x1="120" y1="83" x2="155" y2="83" stroke="#0066cc" strokeWidth="1" />
    <text x="137" y="95" fontSize="8" fill="#0066cc" textAnchor="middle">35 мм</text>

    <line x1="155" y1="80" x2="155" y2="86" stroke="#0066cc" strokeWidth="1" />
    <line x1="235" y1="80" x2="235" y2="86" stroke="#0066cc" strokeWidth="1" />
    <line x1="155" y1="83" x2="235" y2="83" stroke="#0066cc" strokeWidth="1" />
    <text x="195" y="95" fontSize="8" fill="#0066cc" textAnchor="middle">80 мм</text>
  </svg>
);

// V40x60 - Narrow medium height profile
const DiagramV40x60: React.FC = () => (
  <svg viewBox="0 0 400 120" className="w-full max-w-[500px] h-auto">
    {/* Left height dimension */}
    <line x1="15" y1="15" x2="15" y2="95" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="15" x2="20" y2="15" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="10" y1="95" x2="20" y2="95" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="15,15 12,22 18,22" fill="#0066cc" />
    <polygon points="15,95 12,88 18,88" fill="#0066cc" />
    <text x="8" y="58" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 8, 58)">60 мм</text>

    {/* Right height dimension */}
    <line x1="385" y1="15" x2="385" y2="95" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="15" x2="390" y2="15" stroke="#0066cc" strokeWidth="1.5" />
    <line x1="380" y1="95" x2="390" y2="95" stroke="#0066cc" strokeWidth="1.5" />
    <polygon points="385,15 382,22 388,22" fill="#0066cc" />
    <polygon points="385,95 382,88 388,88" fill="#0066cc" />
    <text x="392" y="58" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 392, 58)">60 мм</text>

    {/* Four profiles */}
    {/* Profile 1 */}
    <rect x="45" y="15" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="60" y="15" width="8" height="80" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="45" y="89" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 2 */}
    <rect x="130" y="15" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="145" y="15" width="8" height="80" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="130" y="89" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 3 */}
    <rect x="215" y="15" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="230" y="15" width="8" height="80" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="215" y="89" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    
    {/* Profile 4 */}
    <rect x="300" y="15" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="315" y="15" width="8" height="80" fill="none" stroke="#333" strokeWidth="1.5" />
    <rect x="300" y="89" width="40" height="6" fill="none" stroke="#333" strokeWidth="1.5" />

    {/* Bottom dimensions */}
    <line x1="45" y1="105" x2="45" y2="111" stroke="#0066cc" strokeWidth="1" />
    <line x1="85" y1="105" x2="85" y2="111" stroke="#0066cc" strokeWidth="1" />
    <line x1="45" y1="108" x2="85" y2="108" stroke="#0066cc" strokeWidth="1" />
    <text x="65" y="118" fontSize="8" fill="#0066cc" textAnchor="middle">40 мм</text>

    <line x1="85" y1="105" x2="85" y2="111" stroke="#0066cc" strokeWidth="1" />
    <line x1="130" y1="105" x2="130" y2="111" stroke="#0066cc" strokeWidth="1" />
    <line x1="85" y1="108" x2="130" y2="108" stroke="#0066cc" strokeWidth="1" />
    <text x="107" y="118" fontSize="8" fill="#0066cc" textAnchor="middle">45 мм</text>

    <line x1="130" y1="105" x2="130" y2="111" stroke="#0066cc" strokeWidth="1" />
    <line x1="170" y1="105" x2="170" y2="111" stroke="#0066cc" strokeWidth="1" />
    <line x1="130" y1="108" x2="170" y2="108" stroke="#0066cc" strokeWidth="1" />
    <text x="150" y="118" fontSize="8" fill="#0066cc" textAnchor="middle">40 мм</text>
  </svg>
);

// Main component that renders the correct diagram based on type
interface ProfileDiagramProps {
  profileType: string;
}

export const ProfileDiagram: React.FC<ProfileDiagramProps> = ({ profileType }) => {
  const diagrams: Record<string, React.FC> = {
    'V59x43': DiagramV59x43,
    'V30x75': DiagramV30x75,
    'V26x100': DiagramV26x100,
    'V120x50': DiagramV120x50,
    'V80x35': DiagramV80x35,
    'V40x60': DiagramV40x60,
  };

  const DiagramComponent = diagrams[profileType] || DiagramV59x43;

  return (
    <div className="flex flex-col items-center py-4">
      <DiagramComponent />
      <p className="text-[10px] text-gray-500 mt-2 font-medium">Профиль {profileType}</p>
    </div>
  );
};
