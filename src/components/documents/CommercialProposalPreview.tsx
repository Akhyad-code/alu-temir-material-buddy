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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Content overlay */}
      <div className="relative z-10 p-8 pt-[180px]">
        {/* Date and Contact */}
        <div className="text-center mb-8 text-sm">
          <p>{document.date}</p>
          <p>+7 747 578 4878</p>
          <p>{document.city}</p>
        </div>

        {/* Materials Table */}
        <div className="mt-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#1a3a5c] text-white">
                <th className="border border-[#1a3a5c] px-2 py-2 text-left">Наименование</th>
                <th className="border border-[#1a3a5c] px-2 py-2 text-center w-20">размер</th>
                <th className="border border-[#1a3a5c] px-2 py-2 text-center w-16">ед.изм.</th>
                <th className="border border-[#1a3a5c] px-2 py-2 text-right w-24">цена, в тг</th>
                <th className="border border-[#1a3a5c] px-2 py-2 text-center w-16">кол-во</th>
                <th className="border border-[#1a3a5c] px-2 py-2 text-right w-28">сумма</th>
              </tr>
            </thead>
            <tbody>
              {document.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="border border-gray-300 px-2 py-1.5">{item.name}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{item.size || '-'}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{item.unit}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right">{formatCurrency(item.price)}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-1.5 text-right font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="font-bold">
                <td colSpan={4} className="border border-gray-300 px-2 py-1.5"></td>
                <td className="border border-gray-300 px-2 py-1.5 text-right text-[#1a3a5c]">Итого</td>
                <td className="border border-gray-300 px-2 py-1.5 text-right">{formatCurrency(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="mt-6 text-sm">
            <p className="whitespace-pre-wrap">{document.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
