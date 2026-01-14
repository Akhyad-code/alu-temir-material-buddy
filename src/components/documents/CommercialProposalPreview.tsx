import React from 'react';
import { CommercialProposal, formatCurrency } from '@/types/documents';
import kpBackground from '@/assets/kp-template-clean.jpg';

interface CommercialProposalPreviewProps {
  document: CommercialProposal;
}

// Profile diagram component
const ProfileDiagram: React.FC<{ profileWidth?: number; profileHeight?: number; gap?: number }> = ({ 
  profileWidth = 59, 
  profileHeight = 43,
  gap = 40 
}) => {
  return (
    <div className="flex flex-col items-center py-4">
      <svg viewBox="0 0 400 120" className="w-full max-w-[500px] h-auto">
        {/* Left height dimension */}
        <line x1="15" y1="15" x2="15" y2="95" stroke="#0066cc" strokeWidth="1.5" />
        <line x1="10" y1="15" x2="20" y2="15" stroke="#0066cc" strokeWidth="1.5" />
        <line x1="10" y1="95" x2="20" y2="95" stroke="#0066cc" strokeWidth="1.5" />
        <polygon points="15,15 12,22 18,22" fill="#0066cc" />
        <polygon points="15,95 12,88 18,88" fill="#0066cc" />
        <text x="8" y="58" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(-90, 8, 58)">{profileHeight} мм</text>

        {/* Right height dimension */}
        <line x1="385" y1="15" x2="385" y2="95" stroke="#0066cc" strokeWidth="1.5" />
        <line x1="380" y1="15" x2="390" y2="15" stroke="#0066cc" strokeWidth="1.5" />
        <line x1="380" y1="95" x2="390" y2="95" stroke="#0066cc" strokeWidth="1.5" />
        <polygon points="385,15 382,22 388,22" fill="#0066cc" />
        <polygon points="385,95 382,88 388,88" fill="#0066cc" />
        <text x="392" y="58" fontSize="9" fill="#0066cc" textAnchor="middle" transform="rotate(90, 392, 58)">{profileHeight} мм</text>

        {/* Profile shapes - 5 profiles */}
        {[0, 1, 2, 3, 4].map((i) => {
          const isProfile = i % 2 === 0;
          const x = 35 + i * 70;
          return (
            <g key={i}>
              {isProfile ? (
                // T-shaped profile
                <>
                  <rect x={x} y="15" width={profileWidth} height="8" fill="none" stroke="#333" strokeWidth="1.5" />
                  <rect x={x + (profileWidth - 8) / 2} y="15" width="8" height={profileHeight + 8} fill="none" stroke="#333" strokeWidth="1.5" />
                  <rect x={x} y={15 + profileHeight} width={profileWidth} height="8" fill="none" stroke="#333" strokeWidth="1.5" />
                </>
              ) : (
                // Gap area (empty)
                null
              )}
            </g>
          );
        })}

        {/* Bottom dimensions */}
        {/* First profile width */}
        <line x1="35" y1="105" x2="35" y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + profileWidth} y1="105" x2={35 + profileWidth} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1="35" y1="108" x2={35 + profileWidth} y2="108" stroke="#0066cc" strokeWidth="1" />
        <polygon points={`35,108 40,106 40,110`} fill="#0066cc" />
        <polygon points={`${35 + profileWidth},108 ${30 + profileWidth},106 ${30 + profileWidth},110`} fill="#0066cc" />
        <text x={35 + profileWidth / 2} y="117" fontSize="8" fill="#0066cc" textAnchor="middle">{profileWidth} мм</text>

        {/* First gap */}
        <line x1={35 + profileWidth} y1="105" x2={35 + profileWidth} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + profileWidth + gap} y1="105" x2={35 + profileWidth + gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + profileWidth} y1="108" x2={35 + profileWidth + gap} y2="108" stroke="#0066cc" strokeWidth="1" />
        <text x={35 + profileWidth + gap / 2} y="117" fontSize="8" fill="#0066cc" textAnchor="middle">{gap} мм</text>

        {/* Second profile width */}
        <line x1={35 + profileWidth + gap} y1="105" x2={35 + profileWidth + gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + 2 * profileWidth + gap} y1="105" x2={35 + 2 * profileWidth + gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + profileWidth + gap} y1="108" x2={35 + 2 * profileWidth + gap} y2="108" stroke="#0066cc" strokeWidth="1" />
        <text x={35 + 1.5 * profileWidth + gap} y="117" fontSize="8" fill="#0066cc" textAnchor="middle">{profileWidth} мм</text>

        {/* Second gap */}
        <line x1={35 + 2 * profileWidth + gap} y1="105" x2={35 + 2 * profileWidth + gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + 2 * profileWidth + 2 * gap} y1="105" x2={35 + 2 * profileWidth + 2 * gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + 2 * profileWidth + gap} y1="108" x2={35 + 2 * profileWidth + 2 * gap} y2="108" stroke="#0066cc" strokeWidth="1" />
        <text x={35 + 2 * profileWidth + 1.5 * gap} y="117" fontSize="8" fill="#0066cc" textAnchor="middle">{gap} мм</text>

        {/* Third profile width */}
        <line x1={35 + 2 * profileWidth + 2 * gap} y1="105" x2={35 + 2 * profileWidth + 2 * gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + 3 * profileWidth + 2 * gap} y1="105" x2={35 + 3 * profileWidth + 2 * gap} y2="110" stroke="#0066cc" strokeWidth="1" />
        <line x1={35 + 2 * profileWidth + 2 * gap} y1="108" x2={35 + 3 * profileWidth + 2 * gap} y2="108" stroke="#0066cc" strokeWidth="1" />
        <text x={35 + 2.5 * profileWidth + 2 * gap} y="117" fontSize="8" fill="#0066cc" textAnchor="middle">{profileWidth} мм</text>
      </svg>
    </div>
  );
};

export const CommercialProposalPreview: React.FC<CommercialProposalPreviewProps> = ({
  document,
}) => {
  const total = document.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div
      id="kp-preview"
      className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl relative overflow-hidden"
      style={{
        backgroundImage: `url(${kpBackground})`,
        backgroundSize: '210mm auto',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Spacing for header logo area - matching template */}
        <div className="h-[170px]" />
        
        {/* Date, Phone and City */}
        <div className="text-center text-[11px] text-black/90 py-3">
          <p className="font-medium">{document.date}</p>
          <p>{document.client.phone || '+7 707 297 7585'}</p>
          {document.city && <p>{document.city}</p>}
        </div>

        {/* Spacer before table */}
        <div className="h-[60px]" />

        {/* Materials Table */}
        <div className="mx-[25px]">
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#1a3a5c] text-white">
                <th className="border border-[#1a3a5c] px-2 py-2 text-left font-medium">Наименование</th>
                <th className="border border-[#1a3a5c] px-1 py-2 text-center w-[55px] font-medium">размер</th>
                <th className="border border-[#1a3a5c] px-1 py-2 text-center w-[50px] font-medium">ед.изм.</th>
                <th className="border border-[#1a3a5c] px-1 py-2 text-right w-[80px] font-medium">цена , в тг</th>
                <th className="border border-[#1a3a5c] px-1 py-2 text-center w-[55px] font-medium">кол-во</th>
                <th className="border border-[#1a3a5c] px-1 py-2 text-right w-[90px] font-medium">сумма</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {document.items.length === 0 ? (
                <>
                  <tr>
                    <td colSpan={6} className="border border-gray-300 px-2 py-4 text-center text-gray-400 italic">
                      Добавьте позиции через калькулятор
                    </td>
                  </tr>
                  <tr className="font-bold bg-white">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1.5"></td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right text-[#1a3a5c]">Итого</td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right">0,00</td>
                  </tr>
                </>
              ) : (
                <>
                  {document.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-2 py-1.5">{item.name}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-center">{item.size || '-'}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-center">{item.unit}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-right">{formatCurrency(item.price)}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-white">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1.5"></td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right text-[#1a3a5c]">Итого</td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right">{formatCurrency(total)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Notes */}
          {document.notes && (
            <div className="mt-4 text-[9px] p-2 border border-gray-200 rounded bg-white">
              <p className="whitespace-pre-wrap">{document.notes}</p>
            </div>
          )}
        </div>

        {/* Profile Diagram Section */}
        <div className="mx-[25px] mt-8 bg-white">
          <ProfileDiagram 
            profileWidth={document.diagramType === 'V26x100' ? 26 : 59} 
            profileHeight={document.diagramType === 'V26x100' ? 100 : 43}
            gap={document.diagramType === 'V26x100' ? 50 : 40}
          />
        </div>
        
        {/* Spacer to push content up from footer */}
        <div className="h-[100px]" />
      </div>
    </div>
  );
};
