import type { decimal, DateTime } from './shared';

interface Tinvoice_Dto {
  fullInvoiceNumber: string; //完整發票號碼
  customerNumber: string; //客戶編號
  buyer: string; //客戶姓名
  taxId: string; // 統一編號
  projectName: string; //案場名稱
  invoiceAmount: decimal; // 未稅金額
  invoiceTaxes: decimal; // 稅額
  totalAmount: decimal; // 含稅總額
  alphabeticLetter: string; // 發票字軌
  invoiceDate: DateTime | null; //發票日期
  contractNumber: string | null; //合約編號
  quotationNumber: string | null; //報價單號
  status: string; // 發票狀態
}

interface Tbody_updateInvoiceStatus {
  invoiceNumber: string;
  status: number;
  updatedBy: string; //員工編號;
  updatedAt: string;
}

interface Tbody_insertInvoiceDiscount {
  createdAt: string;
  createdBy: string; // 員工編號,

  invoiceNumber: string;
  discountDate: string;
  memo: string; //備註
  invoiceBookId: string; // 發票本ID;
  discountAmount: number; // 折讓金額;
}

export type { Tinvoice_Dto, Tbody_updateInvoiceStatus, Tbody_insertInvoiceDiscount };
