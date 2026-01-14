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
      className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl relative"
      style={{
        backgroundImage: `url(${kpBackground})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Content overlay - positioned to match template */}
      <div className="relative z-10 pt-[155px] px-[25px]">
        {/* Date and Contact - positioned at top center area */}
        <div className="text-center text-[11px] mb-2 text-black/80">
          <p className="font-medium">{document.date}</p>
          <p>+7 775 587 77 89</p>
        </div>

        {/* Materials Table - positioned to match template table area */}
        <div className="mt-[50px]">
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#1a3a5c] text-white">
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-left font-medium">Наименование</th>
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-center w-14 font-medium">размер</th>
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-center w-14 font-medium">ед.изм.</th>
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-right w-20 font-medium">цена, в тг</th>
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-center w-14 font-medium">кол-во</th>
                <th className="border border-[#1a3a5c] px-2 py-1.5 text-right w-24 font-medium">сумма</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {document.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="border border-gray-300 px-2 py-1">{item.name}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{item.size || '-'}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{item.unit}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(item.price)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              {/* Empty rows for spacing if few items */}
              {document.items.length < 3 && (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-2 py-1 h-6"></td>
                </tr>
              )}
              {/* Total row */}
              <tr className="font-bold bg-white">
                <td colSpan={4} className="border border-gray-300 px-2 py-1"></td>
                <td className="border border-gray-300 px-2 py-1 text-right text-[#1a3a5c]">Итого</td>
                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="mt-4 text-[10px] bg-white/80 p-2 rounded">
            <p className="whitespace-pre-wrap">{document.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
