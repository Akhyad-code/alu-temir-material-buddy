import React from 'react';
import { CommercialProposal, formatCurrency } from '@/types/documents';
import { ProfileDiagram, DEFAULT_DIMENSIONS } from './ProfileDiagrams';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

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
      {/* Header with gradient */}
      <div 
        className="relative h-[200px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a87 50%, #1a3a5c 100%)',
        }}
      >
        {/* Decorative pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`,
          }}
        />
        
        {/* Logo and company info */}
        <div className="relative z-10 flex items-center justify-between h-full px-10">
          <div className="flex items-center gap-6">
            {/* Logo placeholder */}
            <div className="w-[80px] h-[80px] bg-white rounded-lg flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-[#1a3a5c] font-bold text-[14px] leading-tight">ALU</div>
                <div className="text-[#c9a54a] font-bold text-[14px] leading-tight">TEMIR</div>
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-[28px] font-bold tracking-wide">ALU-TEMIR</h1>
              <p className="text-[11px] opacity-90 tracking-wider">РЕЕЧНЫЕ ПОДВЕСНЫЕ ПОТОЛКИ | ФАСАДНЫЕ РЕШЕНИЯ</p>
            </div>
          </div>
          
          {/* Contact info in header */}
          <div className="text-white text-right text-[10px] space-y-1">
            <p className="flex items-center justify-end gap-2">
              <span>+7 707 040 30 30</span>
              <Phone className="w-3 h-3" />
            </p>
            <p className="flex items-center justify-end gap-2">
              <span>info@alutemir.kz</span>
              <Mail className="w-3 h-3" />
            </p>
            <p className="flex items-center justify-end gap-2">
              <span>www.alutemir.kz</span>
              <Globe className="w-3 h-3" />
            </p>
          </div>
        </div>
        
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#c9a54a] via-[#e8d48a] to-[#c9a54a]" />
      </div>

      {/* Document title */}
      <div className="text-center py-6">
        <h2 className="text-[22px] font-bold text-[#1a3a5c] tracking-wide">
          КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
        </h2>
        <div className="flex items-center justify-center gap-8 mt-3 text-[11px] text-gray-600">
          <span>№ {document.number}</span>
          <span>от {document.date}</span>
          <span>{document.city}</span>
        </div>
      </div>

      {/* Client info block */}
      {document.client.name && (
        <div className="mx-8 mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#c9a54a]">
          <p className="text-[10px] text-gray-500 mb-1">Для:</p>
          <p className="text-[12px] font-medium text-gray-800">{document.client.name}</p>
          {document.client.address && (
            <p className="text-[10px] text-gray-600 mt-1">{document.client.address}</p>
          )}
          {document.client.phone && (
            <p className="text-[10px] text-gray-600">{document.client.phone}</p>
          )}
        </div>
      )}

      {/* Materials Table */}
      <div className="mx-8 mb-6">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-[#1a3a5c] text-white">
              <th className="border border-[#1a3a5c] px-3 py-2.5 text-left font-medium">№</th>
              <th className="border border-[#1a3a5c] px-3 py-2.5 text-left font-medium">Наименование</th>
              <th className="border border-[#1a3a5c] px-2 py-2.5 text-center w-[50px] font-medium">Ед.изм.</th>
              <th className="border border-[#1a3a5c] px-2 py-2.5 text-right w-[75px] font-medium">Цена, тг</th>
              <th className="border border-[#1a3a5c] px-2 py-2.5 text-center w-[55px] font-medium">Кол-во</th>
              <th className="border border-[#1a3a5c] px-2 py-2.5 text-right w-[85px] font-medium">Сумма, тг</th>
            </tr>
          </thead>
          <tbody>
            {document.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 px-3 py-6 text-center text-gray-400 italic bg-white">
                  Добавьте позиции через калькулятор
                </td>
              </tr>
            ) : (
              document.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center">{item.unit}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-[#1a3a5c] text-white font-bold">
              <td colSpan={5} className="border border-[#1a3a5c] px-3 py-2.5 text-right">ИТОГО:</td>
              <td className="border border-[#1a3a5c] px-2 py-2.5 text-right">{formatCurrency(total)} ₸</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Notes */}
      {document.notes && (
        <div className="mx-8 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-[10px] font-medium text-[#1a3a5c] mb-1">Примечание:</p>
          <p className="text-[10px] text-gray-700 whitespace-pre-wrap">{document.notes}</p>
        </div>
      )}

      {/* Profile Diagram Section */}
      {document.showDiagram && document.diagramDimensions && (
        <div className="mx-8 mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-[10px] font-medium text-[#1a3a5c] mb-2 text-center">Схема профиля</p>
          <ProfileDiagram dimensions={document.diagramDimensions || DEFAULT_DIMENSIONS} />
        </div>
      )}

      {/* Benefits section */}
      <div className="mx-8 mb-6">
        <div className="grid grid-cols-3 gap-3 text-[8px]">
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-[#1a3a5c] font-bold text-[14px] mb-1">25 лет</div>
            <div className="text-gray-600">срок службы</div>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-[#1a3a5c] font-bold text-[14px] mb-1">-40°...+60°</div>
            <div className="text-gray-600">температурный режим</div>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-[#1a3a5c] font-bold text-[14px] mb-1">100%</div>
            <div className="text-gray-600">влагостойкость</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[70px]"
        style={{
          background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a87 100%)',
        }}
      >
        <div className="h-[3px] bg-gradient-to-r from-[#c9a54a] via-[#e8d48a] to-[#c9a54a]" />
        <div className="flex items-center justify-between h-[67px] px-8 text-white text-[9px]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-[#c9a54a]" />
              <span>+7 707 040 30 30</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-[#c9a54a]" />
              <span>info@alutemir.kz</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#c9a54a]" />
              <span>www.alutemir.kz</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-[#c9a54a]" />
            <span>г. Алматы, ул. Сагадат Нурмагамбетова, 144/1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
