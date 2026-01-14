import React from 'react';
import { CommercialProposal, formatCurrency } from '@/types/documents';
import kpBackground from '@/assets/kp-template-clean.jpg';
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
      style={{
        backgroundImage: `url(${kpBackground})`,
        backgroundSize: '210mm auto',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Spacing for header logo area - increased to avoid overlap */}
        <div className="h-[220px]" />

        {/* Spacer before table */}
        <div className="h-[20px]" />

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
        {document.showDiagram && document.diagramDimensions && (
          <div className="mx-[25px] mt-6 bg-white">
            <ProfileDiagram dimensions={document.diagramDimensions || DEFAULT_DIMENSIONS} />
          </div>
        )}
        
        {/* Spacer to push content up from footer */}
        <div className="h-[100px]" />
      </div>
    </div>
  );
};
