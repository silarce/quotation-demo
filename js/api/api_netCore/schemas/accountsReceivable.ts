// import { string, string, number } from './';

interface TaccountsReceivablesList_Dto_depressed {
  id: string; //應收帳款id
  accountsReceivableNumber: string; //應收帳款編號
  sourceType: string; //來源類型
  sourceId: string | null; //來源id
  customerNumber: string; //客戶編號
  customerName: string; //客戶名稱
  companyPhone: string; //公司電話
  companyFax: string; //公司傳真
  salesAmount: number | null; // 銷售金額
  taxes: number | null; //稅金
  salesCurrency: string; //幣別
  exchangeRate: number | null; //匯率
  requestAmount: number | null; //請款金額
  foreignCurrencyAmount: number | null; //外幣金額
  uncollectedPayment: number | null; //未收款項
  totalAmount: number | null; //總金額
  createdAt: string | null; //建立時間
  updatedAt: string | null; //更新時間
  createdBy: string | null; //建立人
  updatedBy: string | null; //更新人
  status: string | null; //狀態
  prAmount: number | null; //已請款金額
  deduction: number | null; //扣款金額
  quotationContractNumber: string | null; //合約編號
  projectName: string | null; //案場名稱
  salesOrderNumber: string | null; //銷售訂單編號
  collectAmount: number | null;
}
interface TaccountsReceivablesList_Dto {
  id: string; //應收帳款id
  accountsReceivableNumber: string; //應收帳款編號
  sourceType: string; //來源類型
  sourceId: string; //來源id
  customerNumber: string; //客戶編號
  customerName: string; //客戶名稱
  companyPhone: string; //公司電話
  companyFax: string; //公司傳真
  salesAmount: number; // 銷售金額
  taxes: number; //稅金
  salesCurrency: string; //幣別
  exchangeRate: number; //匯率
  requestAmount: number; //請款金額
  foreignCurrencyAmount: number; //外幣金額
  uncollectedPayment: number; //未收款項 (已請款未收款項)
  collectAmount: number; //已收款項 總計
  totalAmount: number; //總金額
  createdAt: string; //建立時間
  updatedAt: string; //更新時間
  createdBy: null; //建立人
  updatedBy: null; //更新人
  status: string; //狀態
  prAmount: number; //已請款金額 總計
  deduction: number; //扣款金額
  quotationContractNumber: string; //合約編號
  projectName: string; //案場名稱
  salesOrderNumber: string; //銷售訂單編號
  taxId: string;
  taxDeductionCategory: null;
}

interface TquotationListViewModel_Dto {
  id: string; // 報價單id(quotation_content.id)
  status: string; // 報價單狀態
  reviewManagerEmployeeId: string | null; // 審核經理人員id
  managerReviewedAt: string | null; // 審核經理人員審核時間
  quotationNumber: string; // 報價單編號
  version: number; // 報價單版本
  customerId: string | null; // 客戶id
  projectName: string; // 案場名稱
  county: string; // 縣市
  district: string; // 區域(鄉鎮市區)
  address: string; // 地址
  contactPerson: string; // 聯絡人
  contactNumber: string; // 聯絡人電話
  quantity: number | null; // 摚數
  editNotes: string; // 編輯備註
  discount: number | null; // 折扣
  subTotal: number | null; // 小計
  salesTax: number | null; // 銷售稅
  total: number | null; // 總金額
  deliveryLocation: string; // 交貨地點
  paymentMethods: string; // 付款方式
  supervisorEmployeeId: string | null; // 主管人員id
  agentEmployeeId: string | null; // 承辦人員id
  reviewSalesEmployeeId: string | null; // 審核業務人員id
  productsOrder: string; // 產品順序
  tuneTotal: number | null; // 調整總金額
  averageDiscount: number | null; // 平均折扣
  estimatedDiscount: number | null; // 預估折扣
  type: string; // 報價單類型
  currency: string; // 幣別
  foreignTotal: number | null; // 外幣總金額
  exchangeRate: number | null; // 匯率
  contractId: string | null; // 合約id
  contractStatus: string; // 合約狀態
  contractNumber: string | null; // 合約編號
  customerName: string | null; // 客戶名稱
  additionalAmount: string | null; // 追加減金額
}

interface TsalesOrderItemData_Dto {
  id: string; //銷貨明細id
  itemNumber: string; //項目編號
  salesOrderNumber: string; //銷售訂單編號
  productId: string; //產品id
  discount: number | null; //折扣
  productName: string; //產品名稱
  productNumber: string; //產品編號
  unitPrice: number | null; //單價
  quantity: number | null; //數量
  amount: number | null; //金額
  taxes: number | null; //稅金
  attachedToProductId: string | null; //附加產品id
  dualPrice: number; //牌價
}

interface TpaymentRequest_Dto {
  id: string | null; //請款單Id
  createdAt: string | null; //建立時間
  createdBy: string | null; //建立人員
  updatedAt: string | null; //更新時間
  updatedBy: string | null; // 更新人員

  paymentRequestNumber: string | null; //請款單編號
  sourceFormType: string | null; //來源表單類型
  sourceFormId: string | null; //來源表單Id

  customerNumber: string; //客戶編號
  customerName: string; //客戶名稱

  invoiceNumber: string | null; //發票號碼
  invoiceAmount: number | null; //發票金額

  accountsReceivableId: string | null; //應收帳款Id

  type: string; //請款單類型
  period: string; //請款單期別

  paymentCurrency: string; //請款幣別
  foreignCurrencyAmount: number | null; //外幣金額

  paymentAmount: number | null; //請款金額
  collect_amount: number | null; //已收金額
  receipt_balance: number | null; //收款餘額
  deduction: number | null; //扣款金額
}

/**
 * 這個api回應的東西
 *
 * /api/AccountsReceivable/GetAccountsReceivables
 */
interface TaccountsReceivable {
  accountsReceivablesList: TaccountsReceivablesList_Dto;
  paymentRequests: TpaymentRequest_Dto[];
  salesOrderItem: TsalesOrderItemData_Dto[];
}

interface TinsertpaymentRequest {
  paymentRequest: {
    createdAt: string; // 建立時間,
    createdBy: string; // 建立人員(員工編號),
    updatedAt: string; // 修改時間,
    updatedBy: string; // 修改人員(員工編號),

    sourceFormType: string; // 來源類別-accountsReceivableList.sourceType,
    sourceFormId: string; // 來源ID-accountsReceivableList.sourceId,
    accountsReceivableId: string; // 應收帳款Id,

    customerNumber: string; // 客戶編號,
    customerName: string; // 客戶名稱,

    type: string; // 請款類別 "訂金"、"支軌"、"安裝"...,

    paymentCurrency: string; // 請款幣別,
    foreignCurrencyAmount: number; // 外幣金額,
    paymentAmount: number; // 請款金額,

    retainageType: '保留款'; // "保留款",
    retainageTaxCategory: string; // 保留款稅別(含稅、未稅、無),
    retainageRate: number; // 保留款%數 10 ,
    retainageAmount: number; // 保留款金額 61601,

    completedProduct: {
      salesOrderItemId: string;
      completedPayment: number;
      completedQuantity: number;
    }[];
  };
  invoice?: {
    invoiceDate: string; // 發票開立日期 "2025-05-03",
    invoiceNumber: string; // 發票號碼 "MV34400404",
    buyer: string; // 客戶抬頭 "一代冷氣空調有限公司",

    amount: number; // 發票金額 9524, //
    taxes: number; // 發票稅額 476, //
    totalAmount: number; //總金額 10000, // UI上叫發票金額

    taxId: string; // 統一編號 "54741781",
    taxAddress: string | null; // 發票地址 null,
    remark: string | null; // 備註 null ,

    invoiceBookId: string; // 發票本Id "6600f3cb-d0f5-4a17-b88e-7eb7f002e354",
    period: `${number}`; //發票期數 "3"
  };
}

interface TpaymentRequestType {
  codeName: string;
  name: string;
}

export type {
  TaccountsReceivablesList_Dto_depressed,
  TaccountsReceivablesList_Dto,
  TquotationListViewModel_Dto,
  TsalesOrderItemData_Dto,
  TpaymentRequest_Dto,
  TaccountsReceivable,
  TinsertpaymentRequest,
  TpaymentRequestType,
};
