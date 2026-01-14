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
      className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl relative overflow-hidden"
    >
      {/* Background image - only header and footer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${kpBackground})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* White overlay to cover template content but keep header/footer visible */}
      <div className="absolute top-[145px] left-[20px] right-[20px] bottom-[100px] bg-white" />

      {/* Content */}
      <div className="relative z-10">
        {/* Spacing for header */}
        <div className="h-[145px]" />
        
        {/* Date and Contact - centered under header */}
        <div className="text-center text-[11px] mb-4 px-8">
          <p className="font-medium">{document.date}</p>
          <p>+7 775 587 77 89</p>
        </div>

        {/* Materials Table */}
        <div className="px-6 mt-4">
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#1a3a5c] text-white">
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-left font-medium">Наименование</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-center w-12 font-medium">размер</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-center w-12 font-medium">ед.изм.</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-right w-16 font-medium">цена, в тг</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-center w-12 font-medium">кол-во</th>
                <th className="border border-[#1a3a5c] px-1 py-1.5 text-right w-20 font-medium">сумма</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {document.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-2 py-6 text-center text-gray-400 italic">
                    Добавьте позиции через калькулятор
                  </td>
                </tr>
              ) : (
                <>
                  {document.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-300">
                      <td className="border border-gray-300 px-2 py-1">{item.name}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center">{item.size || '-'}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center">{item.unit}</td>
                      <td className="border border-gray-300 px-1 py-1 text-right">{formatCurrency(item.price)}</td>
                      <td className="border border-gray-300 px-1 py-1 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-1 py-1 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="font-bold bg-white">
                    <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                    <td className="border border-gray-300 px-1 py-1 text-right text-[#1a3a5c]">Итого</td>
                    <td className="border border-gray-300 px-1 py-1 text-right">{formatCurrency(total)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="mt-4 mx-6 text-[10px] p-2">
            <p className="whitespace-pre-wrap">{document.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
