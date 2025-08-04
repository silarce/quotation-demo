interface Tinvoice_Dto {
  fullInvoiceNumber: string;
  buyer: string | null;
  taxId: string | null;
  projectName: string | null;
  invoiceAmount: number;
  invoiceTaxes: number;
  totalAmount: number;
}

export type { Tinvoice_Dto };
