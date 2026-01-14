import React from 'react';
import { Invoice, formatCurrency, numberToWords } from '@/types/documents';

interface InvoicePreviewProps {
  document: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ document }) => {
  const subtotal = document.items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = document.includeVAT ? subtotal * (document.vatRate / 100) / (1 + document.vatRate / 100) : 0;
  const total = subtotal;

  return (
    <div 
      id="invoice-preview"
      className="bg-white text-black w-[210mm] min-h-[297mm] mx-auto shadow-xl p-8 text-[11px] print:shadow-none font-['Times_New_Roman',_serif]"
    >
      {/* 1C Style Header - Bank Details Table */}
      <table className="w-full border-collapse mb-4 text-[10px]">
        <tbody>
          <tr>
            <td className="border border-black p-1.5 w-[140px] align-top" rowSpan={2}>
              <div className="text-[9px] text-gray-600 mb-1">Получатель</div>
              <div className="font-medium">{document.supplier.name}</div>
            </td>
            <td className="border border-black p-1.5">
              <div className="text-[9px] text-gray-600">ИИН/БИН</div>
              <div>{document.supplier.bin}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1.5">
              <div className="text-[9px] text-gray-600">ИИК</div>
              <div>{document.supplier.iban}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1.5 align-top" rowSpan={2}>
              <div className="text-[9px] text-gray-600 mb-1">Банк получателя</div>
              <div className="font-medium">{document.supplier.bank}</div>
            </td>
            <td className="border border-black p-1.5">
              <div className="text-[9px] text-gray-600">БИК</div>
              <div>{document.supplier.bik}</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-1.5">
              <div className="text-[9px] text-gray-600">Кбе</div>
              <div>17</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Invoice Title - 1C Style */}
      <h1 className="text-xl font-bold text-center my-6 border-b-2 border-black pb-2">
        СЧЕТ НА ОПЛАТУ № {document.number} от {document.date}
      </h1>

      {/* Supplier */}
      <div className="mb-4 text-[11px]">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-medium w-[120px] py-1 border-b border-black">Поставщик:</td>
              <td className="py-1 border-b border-black">
                {document.supplier.name}, БИН {document.supplier.bin}, {document.supplier.address}, тел.: {document.supplier.phone}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buyer */}
      <div className="mb-6 text-[11px]">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-medium w-[120px] py-1 border-b border-black">Покупатель:</td>
              <td className="py-1 border-b border-black">
                {document.buyer.name || '________________________________________________'}
                {document.buyer.bin && `, БИН ${document.buyer.bin}`}
                {document.buyer.address && `, ${document.buyer.address}`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contract reference */}
      {document.contractNumber && (
        <div className="mb-4 text-[11px]">
          <span className="font-medium">Основание: </span>
          Договор №{document.contractNumber} от {document.contractDate}
        </div>
      )}

      {/* Items Table - 1C Style */}
      <table className="w-full border-collapse text-[10px] mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-1.5 text-center w-8">№</th>
            <th className="border border-black p-1.5 text-left">Наименование товара (работ, услуг)</th>
            <th className="border border-black p-1.5 text-center w-14">Ед. изм.</th>
            <th className="border border-black p-1.5 text-center w-14">Кол-во</th>
            <th className="border border-black p-1.5 text-right w-20">Цена</th>
            <th className="border border-black p-1.5 text-right w-24">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {document.items.length === 0 ? (
            <tr>
              <td colSpan={6} className="border border-black p-4 text-center text-gray-400 italic">
                Добавьте позиции
              </td>
            </tr>
          ) : (
            document.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black p-1.5 text-center">{index + 1}</td>
                <td className="border border-black p-1.5">{item.name}</td>
                <td className="border border-black p-1.5 text-center">{item.unit}</td>
                <td className="border border-black p-1.5 text-center">{item.quantity}</td>
                <td className="border border-black p-1.5 text-right">{formatCurrency(item.price)}</td>
                <td className="border border-black p-1.5 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Totals - 1C Style */}
      <div className="flex justify-end mb-4">
        <table className="text-[11px]">
          <tbody>
            <tr>
              <td className="text-right pr-4 py-1 font-medium">Итого:</td>
              <td className="text-right py-1 font-bold w-32">{formatCurrency(subtotal)} ₸</td>
            </tr>
            {document.includeVAT && (
              <tr>
                <td className="text-right pr-4 py-1">В том числе НДС (16%):</td>
                <td className="text-right py-1 w-32">{formatCurrency(vatAmount)} ₸</td>
              </tr>
            )}
            {!document.includeVAT && (
              <tr>
                <td className="text-right pr-4 py-1">Без НДС</td>
                <td className="text-right py-1 w-32">-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary line */}
      <p className="text-[11px] mb-2">
        Всего наименований <strong>{document.items.length}</strong>, на сумму <strong>{formatCurrency(total)} ₸</strong>
      </p>

      {/* Amount in words - 1C Style */}
      <div className="border-t-2 border-b-2 border-black py-2 mb-8 text-[11px]">
        <strong>{numberToWords(total)}</strong>
      </div>

      {/* Warning */}
      <div className="text-[9px] text-gray-600 mb-8 p-3 border border-gray-300 bg-gray-50">
        Внимание! Оплата данного счета означает согласие с условиями поставки товара. 
        Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на складе. 
        Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.
      </div>

      {/* Signatures - 1C Style */}
      <div className="grid grid-cols-2 gap-8 text-[11px]">
        <div>
          <div className="flex items-end gap-2 mb-8">
            <span className="font-medium">Руководитель</span>
            <span className="flex-1 border-b border-black"></span>
            <span className="w-32 border-b border-black text-center text-[9px] text-gray-400">подпись</span>
            <span>/</span>
            <span className="w-28 border-b border-black"></span>
            <span>/</span>
          </div>
        </div>
        <div>
          <div className="flex items-end gap-2 mb-8">
            <span className="font-medium">Бухгалтер</span>
            <span className="flex-1 border-b border-black"></span>
            <span className="w-32 border-b border-black text-center text-[9px] text-gray-400">подпись</span>
            <span>/</span>
            <span className="w-28 border-b border-black"></span>
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Stamp placeholder */}
      <div className="mt-4 text-[9px] text-gray-400 text-center">
        М.П.
      </div>
    </div>
  );
};
