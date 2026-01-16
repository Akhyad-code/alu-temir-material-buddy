import React from 'react';
import { CommercialProposal, formatCurrency } from '@/types/documents';
import kpBackground from '@/assets/kp-template-clean.jpg';
import kpGradientBg from '@/assets/kp-background.jpg';
import { ProfileDiagram, DEFAULT_DIMENSIONS } from './ProfileDiagrams';

interface CommercialProposalPreviewProps {
  document: CommercialProposal;
}

export const CommercialProposalPreview: React.FC<CommercialProposalPreviewProps> = ({
  document,
}) => {
  const total = document.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div
      id="kp-preview"
      className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl relative overflow-hidden"
    >
      {/* Header background from template - only top portion */}
      <div 
        className="absolute top-0 left-0 right-0 h-[270px]"
        style={{
          backgroundImage: `url(${kpBackground})`,
          backgroundSize: '210mm auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Semi-transparent gradient background image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${kpGradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.06,
          zIndex: 1,
        }}
      />
      
      {/* White content area below header */}
      <div 
        className="absolute bg-white" 
        style={{ 
          top: '270px', 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 2,
        }} 
      />
      
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Spacing for header logo area */}
        <div className="h-[280px]" />

        {/* Materials Table */}
        <div className="mx-[25px] bg-white relative z-10">
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
                    <td colSpan={6} className="border border-gray-300 px-2 py-4 text-center text-gray-400 italic bg-white">
                      Добавьте позиции через калькулятор
                    </td>
                  </tr>
                  <tr className="font-bold bg-white">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1.5 bg-white"></td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right text-[#1a3a5c] bg-white">Итого</td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right bg-white">0,00</td>
                  </tr>
                </>
              ) : (
                <>
                  {document.items.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="border border-gray-300 px-2 py-1.5 bg-white">{item.name}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-center bg-white">{item.size || '-'}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-center bg-white">{item.unit}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-right bg-white">{formatCurrency(item.price)}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-center bg-white">{item.quantity}</td>
                      <td className="border border-gray-300 px-1 py-1.5 text-right font-medium bg-white">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-white">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1.5 bg-white"></td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right text-[#1a3a5c] bg-white">Итого</td>
                    <td className="border border-gray-300 px-1 py-1.5 text-right bg-white">{formatCurrency(total)}</td>
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
        {document.showDiagram && document.diagramDimensions && (
          <div className="mx-[25px] mt-6 bg-white relative z-10 p-4 rounded-lg border border-gray-100 shadow-sm">
            <ProfileDiagram dimensions={document.diagramDimensions || DEFAULT_DIMENSIONS} />
          </div>
        )}
        
        {/* Spacer to push content up from footer */}
        <div className="h-[100px]" />
      </div>
    </div>
  );
};
