interface TsalesOrder_simple_Dto {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;

  salesOrderNumber: string;

  status: number; //狀態
  sourceType: string; //來源類型
  sourceId: string | null; //來源id(合約ID)

  customerId: string;
  customerNumber: string;
  customerName: string;
  companyPhone: string;
  companyFax: string;
  address: string; // 客戶地址

  constructionSite: string; //工地名稱

  salesCurrency: string | null; //幣別
  exchangeRate: number | null; //匯率
  currencyAmount: number | null; //外幣金額

  salesAmount: number | null; //銷售金額
  taxes: number | null; //稅金
  changedAmount: number | null; //追加減金額
  changedTaxes: number | null; //追加減稅金
  totalAmount: number | null; //總金額

  quotationNumber: string;
  quotationContractNumber: string | null;
  taxId: string | null;
  taxDeductionCategory: string | null;
  invoiceType: string | null;

  // 這個api固定給null，但不代表這筆資料沒有salesOrderItems，TsalesOrder_Dto才會給資料
  // TsalesOrder_Dto在 js/api/api_netCore/schemas/accountsReceivable.ts
  salesOrderItems: null;
}

interface TproductView_Dto {
  id: string; // 產品ID (Guid)
  productNumber: string; // 產品編號
  productName: string; // 產品名稱
  productSpec: string; // 規格
  unit: string; // 單位
  price: number; // 單價 (decimal)
}

interface TgetCustomerList_Dto {
  id: string;
  customerNumber: string;
  name: string;
  taxId: string;
  phone1: string;
  phone2: string;
  address: string;
}

export type { TsalesOrder_simple_Dto, TproductView_Dto, TgetCustomerList_Dto };
