import React from 'react';
import { Invoice, formatCurrency, numberToWords, DEFAULT_COMPANY_INFO } from '@/types/documents';
import aluTemirLogo from '@/assets/alu-temir-logo.png';

interface InvoicePreviewProps {
  document: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ document }) => {
  const subtotal = document.items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = document.includeVAT ? subtotal * (document.vatRate / 100) : 0;
  const total = subtotal;

  return (
    <div className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl p-8 text-sm print:shadow-none">
      {/* Warning banner */}
      <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs mb-4 rounded">
        <p>
          Внимание! Оплата данного счета означает согласие с условиями поставки товара. 
          Уведомление об оплате обязательно, в противном случае не гарантируется наличие 
          товара на складе. Товар отпускается по факту прихода денег на р/с Поставщика, 
          самовывозом, при наличии доверенности и паспорта.
        </p>
      </div>

      {/* Header with logo and bank details */}
      <div className="flex items-start gap-6 mb-6">
        <img src={aluTemirLogo} alt="ALU-TEMIR" className="h-16 object-contain" />
        <div className="flex-1">
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-medium w-32">Бенефициар:</td>
                <td className="border border-gray-300 px-2 py-1">{document.supplier.name}, {document.supplier.address}</td>
                <td className="border border-gray-300 px-2 py-1 w-44">{document.supplier.iban}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1 bg-gray-50">Тел.: {document.supplier.phone}</td>
                <td className="border border-gray-300 px-2 py-1">БИН: {document.supplier.bin}</td>
                <td className="border border-gray-300 px-2 py-1 bg-gray-50">Банк бенефициара: {document.supplier.bank}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1 bg-gray-50">Счет банка</td>
                <td className="border border-gray-300 px-2 py-1">{document.supplier.bik}</td>
                <td className="border border-gray-300 px-2 py-1 bg-gray-50">БИК</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice title */}
      <h1 className="text-2xl font-bold text-center my-6">
        Счет на оплату № {document.number} от {document.date}
      </h1>

      {/* Supplier and Buyer info */}
      <div className="space-y-3 mb-6 text-xs">
        <p>
          <span className="font-medium">Поставщик:</span> БИН / ИИН {document.supplier.bin}, {document.supplier.name}, {document.supplier.address}, тел.: {document.supplier.phone}
        </p>
        {document.contractNumber && (
          <p>
            <span className="font-medium">Контактный телефон:</span> {document.supplier.phone.replace(/[^0-9]/g, '')}
          </p>
        )}
        <p>
          <span className="font-medium">Покупатель:</span> {document.buyer.bin && `БИН / ИИН ${document.buyer.bin}, `}{document.buyer.name}
          {document.buyer.address && `, ${document.buyer.address}`}
        </p>
        {document.contractNumber && (
          <p>
            <span className="font-medium">Основание:</span> Договор №{document.contractNumber} от {document.contractDate}
          </p>
        )}
      </div>

      {/* Items table */}
      <table className="w-full border-collapse text-sm mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-2 text-center w-10">№</th>
            <th className="border border-gray-300 px-2 py-2 text-left">Товар</th>
            <th className="border border-gray-300 px-2 py-2 text-center w-20">Кол-во</th>
            <th className="border border-gray-300 px-2 py-2 text-center w-16">Ед.</th>
            <th className="border border-gray-300 px-2 py-2 text-right w-24">Цена</th>
            <th className="border border-gray-300 px-2 py-2 text-right w-28">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {document.items.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-2 py-1.5 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-2 py-1.5">{item.name}</td>
              <td className="border border-gray-300 px-2 py-1.5 text-center">{item.quantity} {item.unit}</td>
              <td className="border border-gray-300 px-2 py-1.5 text-center">{item.unit}</td>
              <td className="border border-gray-300 px-2 py-1.5 text-right">{formatCurrency(item.price)}</td>
              <td className="border border-gray-300 px-2 py-1.5 text-right">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="text-right space-y-1 mb-4">
        <p className="font-bold">Итого: {formatCurrency(subtotal)}</p>
        {document.includeVAT && (
          <p className="text-sm">В том числе НДС ({document.vatRate}%): {formatCurrency(vatAmount)}</p>
        )}
      </div>

      {/* Summary line */}
      <p className="text-sm mb-2">
        Всего наименований {document.items.length}, на сумму {formatCurrency(total)} KZT
      </p>

      {/* Amount in words */}
      <p className="text-sm font-medium border-t border-b border-gray-300 py-2 mb-8">
        {numberToWords(total)}
      </p>

      {/* Signatures */}
      <div className="flex justify-between mt-12 text-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium">Руководитель</span>
          <span className="border-b border-gray-400 w-32 inline-block"></span>
          <span>/_______________/</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Бухгалтер</span>
          <span className="border-b border-gray-400 w-32 inline-block"></span>
          <span>/_______________/</span>
        </div>
      </div>
    </div>
  );
};
