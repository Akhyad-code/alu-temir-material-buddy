import React from 'react';
import { CommercialProposal, formatCurrency } from '@/types/documents';
import kpBackground from '@/assets/kp-template-bg.jpg';

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
      {/* Background - only show header from template */}
      <div 
        className="absolute top-0 left-0 right-0 h-[150px] pointer-events-none"
        style={{
          backgroundImage: `url(${kpBackground})`,
          backgroundSize: '210mm auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Footer from template */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50px] pointer-events-none"
        style={{
          backgroundImage: `url(${kpBackground})`,
          backgroundSize: '210mm auto',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content area with white background */}
      <div className="relative z-10">
        {/* Spacing for header logo area */}
        <div className="h-[150px]" />
        
        {/* Date and Contact */}
        <div className="text-center text-[11px] text-black/90 py-2 bg-white">
          <p className="font-medium">{document.date}</p>
          <p>+7 775 587 77 89</p>
        </div>

        {/* Materials Table */}
        <div className="mx-[20px] bg-white pb-4">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr className="bg-[#1a3a5c] text-white">
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-left font-medium">Наименование</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-center w-[50px] font-medium">размер</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-center w-[45px] font-medium">ед.изм.</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-right w-[70px] font-medium">цена, в тг</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-center w-[50px] font-medium">кол-во</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-right w-[80px] font-medium">сумма</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {document.items.length === 0 ? (
                <>
                  <tr>
                    <td colSpan={6} className="border border-gray-300 px-2 py-4 text-center text-gray-400 italic">
                      Добавьте позиции через калькулятор слева
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1 text-right text-[#1a3a5c]">Итого</td>
                    <td className="border border-gray-300 px-1 py-1 text-right">0,00</td>
                  </tr>
                </>
              ) : (
                <>
                  {document.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-2 py-1">{item.name}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center">{item.size || '-'}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center">{item.unit}</td>
                      <td className="border border-gray-300 px-1 py-1 text-right">{formatCurrency(item.price)}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-1 py-1 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1 text-right text-[#1a3a5c]">Итого</td>
                    <td className="border border-gray-300 px-1 py-1 text-right">{formatCurrency(total)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Notes */}
          {document.notes && (
            <div className="mt-4 text-[9px] p-2 border border-gray-200 rounded">
              <p className="whitespace-pre-wrap">{document.notes}</p>
            </div>
          )}
        </div>
        
        {/* Spacer to push content up from footer */}
        <div className="h-[60px]" />
      </div>
    </div>
  );
};
