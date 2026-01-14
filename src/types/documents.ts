// Типы для документов - Коммерческое предложение и Счет

export interface DocumentItem {
  id: number;
  name: string;
  size?: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CompanyInfo {
  name: string;
  bin: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bank: string;
  iban: string;
  bik: string;
}

export interface ClientInfo {
  name: string;
  bin?: string;
  address: string;
  phone?: string;
  contactPerson?: string;
}

export interface CommercialProposal {
  id: number;
  type: 'kp';
  number: string;
  date: string;
  client: ClientInfo;
  items: DocumentItem[];
  notes?: string;
  validUntil?: string;
  city: string;
  showDiagram?: boolean;
  diagramType?: string;
}

export interface Invoice {
  id: number;
  type: 'invoice';
  number: string;
  date: string;
  supplier: CompanyInfo;
  buyer: ClientInfo;
  items: DocumentItem[];
  contractNumber?: string;
  contractDate?: string;
  notes?: string;
  includeVAT: boolean;
  vatRate: number;
}

export type Document = CommercialProposal | Invoice;

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'ТОО "SAT IN TRADING"',
  bin: '250340017362',
  address: 'г. Алматы, Улица Сагадат Нурмагамбетов, 144/1',
  phone: '+7 707 349 9009',
  email: 'Bericov1990@gmail.com',
  website: 'www.alutemir.kz',
  bank: 'АО «Bank RBK»',
  iban: 'KZ26821EFDD610000001',
  bik: 'KINCKZKA',
};

export const DOCUMENT_TEMPLATES = {
  kp: {
    name: 'Коммерческое предложение',
    description: 'Шаблон для коммерческих предложений',
  },
  invoice: {
    name: 'Счет на оплату',
    description: 'Шаблон для счетов на оплату',
  },
};

// Форматирование чисел для тенге
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Преобразование числа в слова (тенге)
export const numberToWords = (num: number): string => {
  const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  const thousands = ['тысяча', 'тысячи', 'тысяч'];
  const millions = ['миллион', 'миллиона', 'миллионов'];

  const getPlural = (n: number, forms: string[]): string => {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
    return forms[2];
  };

  const convertGroup = (n: number, feminine = false): string => {
    if (n === 0) return '';
    let result = '';
    
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;
    
    if (h > 0) result += hundreds[h] + ' ';
    
    if (t === 1) {
      result += teens[o] + ' ';
    } else {
      if (t > 0) result += tens[t] + ' ';
      if (o > 0) {
        if (feminine && o === 1) result += 'одна ';
        else if (feminine && o === 2) result += 'две ';
        else result += ones[o] + ' ';
      }
    }
    
    return result;
  };

  if (num === 0) return 'ноль тенге 00 тиын';

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  let result = '';
  
  const millions_part = Math.floor(intPart / 1000000);
  const thousands_part = Math.floor((intPart % 1000000) / 1000);
  const ones_part = intPart % 1000;

  if (millions_part > 0) {
    result += convertGroup(millions_part) + getPlural(millions_part, millions) + ' ';
  }
  
  if (thousands_part > 0) {
    result += convertGroup(thousands_part, true) + getPlural(thousands_part, thousands) + ' ';
  }
  
  if (ones_part > 0) {
    result += convertGroup(ones_part);
  }

  result = result.trim();
  result = result.charAt(0).toUpperCase() + result.slice(1);
  
  const tengePlural = getPlural(ones_part || (thousands_part > 0 ? thousands_part : millions_part), ['тенге', 'тенге', 'тенге']);
  const tiynStr = decPart.toString().padStart(2, '0');
  
  return `${result} ${tengePlural} ${tiynStr} тиын`;
};
