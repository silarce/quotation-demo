import type { DeepNullable } from 'ts-essentials';
import type { Guid, decimal, int, DateTime } from './shared';

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

  retainageAmount: number | null;
  retainageRate: number | null;
  retainageTaxCategory: string | null;
  retainageType: string | null;

  taxId: string | null; // 統一編號
  taxDeductionCategory: string | null; // 稅別

  currency: string | null; // 幣別 // 建立這個型別時後端還沒實際給這個property
}

interface TquotationListViewModel_Dto {
  id: string; // 報價單id(quotation_content.id)
  quotationNumber: string; // 報價單編號
  version: number; // 報價單版本
  status: string; // 報價單狀態
  type: string; // 報價單類型
  projectName: string; // 案場名稱

  contractId: string | null; // 合約id
  contractStatus: string; // 合約狀態
  contractNumber: string | null; // 合約編號

  reviewManagerEmployeeId: string | null; // 審核經理人員id
  managerReviewedAt: string | null; // 審核經理人員審核時間
  supervisorEmployeeId: string | null; // 主管人員id
  agentEmployeeId: string | null; // 承辦人員id
  reviewSalesEmployeeId: string | null; // 審核業務人員id

  customerId: string | null; // 客戶id
  customerName: string | null; // 客戶名稱
  contactPerson: string; // 聯絡人
  contactNumber: string; // 聯絡人電話

  county: string; // 縣市
  district: string; // 區域(鄉鎮市區)
  address: string; // 地址

  quantity: number | null; // 摚數
  discount: number | null; // 折扣
  subTotal: number | null; // 小計
  salesTax: number | null; // 銷售稅
  total: number | null; // 總金額
  tuneTotal: number | null; // 調整總金額
  averageDiscount: number | null; // 平均折扣
  estimatedDiscount: number | null; // 預估折扣

  currency: string; // 幣別
  foreignTotal: number | null; // 外幣總金額
  exchangeRate: number | null; // 匯率

  additionalAmount: string | null; // 追加減金額

  deliveryLocation: string; // 交貨地點
  paymentMethods: string; // 付款方式

  productsOrder: string; // 產品順序
  editNotes: string; // 編輯備註
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

interface TinsertpaymentRequest_pre {
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

type TinsertpaymentRequest = DeepNullable<TinsertpaymentRequest_pre>;

type Tbody_updatePRInvoice = {
  paymentRequestId: string;
  invoice: TinsertpaymentRequest['invoice'];
};

interface TpaymentRequestType {
  codeName: string;
  name: string;
}

interface Tres_apiGetARPaymentData {
  // 目前累計
  accountsReceivables: {
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
    foreignCurrencyAmount: number | null; //外幣金額
    prAmount: number | null; //已請款金額 總計
    requestAmount: number | null; // 突然冒出來的 // 或許本來就有，只是給我文件時沒有這個?
    collectAmount: number | null; //已收款項 總計
    uncollectedPayment: number | null; //未收款項 (已請款未收款項)
    totalAmount: number | null; //總金額
    createdAt: string | null; //建立時間
    updatedAt: string | null; //更新時間
    createdBy: string | null; //建立人
    updatedBy: string | null; //更新人
    status: string | null; //狀態
    deduction: number | null; //扣款金額
    quotationContractNumber: string | null; //合約編號
    projectName: string | null; //案場名稱
    salesOrderNumber: string | null; //銷售訂單編號
    taxId: string | null;
    taxDeductionCategory: string | null;
  };

  // 本次請款明細
  paymentRequest: {
    id: string | null; //請款單Id

    createdAt: string | null; //建立時間
    createdBy: string | null; //建立人員
    updatedAt: string | null; //更新時間
    updatedBy: string | null; // 更新人員

    accountsReceivableId: string | null; //應收帳款Id
    paymentRequestNumber: string | null; //請款單編號
    type: string; //請款單類型
    period: string; //請款單期別

    sourceFormType: string | null; //來源表單類型
    sourceFormId: string | null; //來源表單Id

    customerNumber: string; //客戶編號
    customerName: string; //客戶名稱

    paymentCurrency: string; //請款幣別
    foreignCurrencyAmount: number | null; //外幣金額
    paymentAmount: number | null; // 本期合計請款金額
    collect_amount: number | null; //已收金額
    receipt_balance: number | null; //收款餘額
    deduction: number | null; //扣款金額

    retainageRate: number | null; //保留款比例
    retainageTaxCategory: string | null; //保留款稅別
    retainageAmount: number | null; //保留款金額

    invoiceBook: string | null; // 發票本 //w 這個不是id，是描述
    invoiceNumber: string | null; //發票號碼
    invoiceAmount: number | null; //發票金額
    invoiceDate: string | null; //發票日期

    //請款單沖銷明細 // 沖銷明細
    prOffsetDetails: {
      id: string | null; //沖銷明細Id
      accountantId: string | null; //會計收管管理Id
      paymentRequestId: string | null; //請款單Id

      prOffsetDate: string; //沖銷日期
      prOffsetType: string | null; //沖銷類別
      prOffsetNumber: string | null; //沖銷編號

      paymentCurrency: string | null; //請款幣別
      exchangeRate: number | null; //匯率
      paymentAmount: number; //收款金額
      settlementSerial: string | null; //結算序號
      isCashierSeen: boolean | null; //出納是否已查看
      isWorkSupervisorSeen: boolean | null; // 工作主管是否已查看
      isManagerSeen: boolean | null; // 總經理是否已查看
      declarationCurrency: string | null; // PostgreSQL enum 建議轉 string 處理
      declarationExchangeRate: number | null; // 申報匯率
      declarationCurrencyPayment: number | null; // 申報幣別收款金額
      declarationPayment: number | null; // 申報收款金額
      exchangeBenefits: number | null; // 匯兌利益
      customerNumber: string | null; // 客戶編號
      customerName: string | null; // 客戶名稱
      fee: number | null; // 手續費
      totalAmount: number | null; // 總金額
      account: string | null; // 會計科目
      createdAt: string | null; //建立時間
      createdBy: string | null; //建立人員
      updatedAt: string | null; //更新時間
      updatedBy: string | null; // 更新人員
    }[];
  };
  salesOrder: {
    id: string; //銷售訂單id
    salesOrderNumber: string; //銷售訂單編號
    customerId: string; //客戶id
    customerNumber: string; //客戶編號
    customerName: string; //客戶名稱
    constructionSite: string; //工地名稱
    companyPhone: string; //公司電話
    companyFax: string; //公司傳真
    address: string; //地址
    salesCurrency: string; //幣別
    exchangeRate: number | null; //匯率
    currencyAmount: number | null; //外幣金額
    salesAmount: number | null; //銷售金額
    taxes: number | null; //稅金
    changedAmount: number | null; //追加減金額
    changedTaxes: number | null; //追加減稅金
    totalAmount: number | null; //總金額
    createdAt: string; //建立時間
    updatedAt: string; //更新時間
    createdBy: string | null; //建立人員
    updatedBy: string | null; //更新人員
    status: number | null; //狀態
    sourceType: string; //來源類型
    sourceId: string | null; //來源id
    quotationNumber: string | null; //報價單編號
    //銷貨明細  // 工程項目明細
    salesOrderItems: {
      salesOrderItemId: string;
      productName: string;
      quantity: number | null;
      unitPrice: number | null;

      itemName: string | null;
      sizeString: string | null;
      prophaseCompletedQuantity: number | null; // 前期以完成
      completedQuantity: number | null; // 本期完成
      completedPayment: number | null; // 本期金額
      totalCompletedQuantity: number | null; // 合計
    }[];
  };
  paymentRequestLogs: {
    id: string;
    sourceFormType: string;
    sourceFormId: string;
    accountsReceivableId: string;
    paymentRequestNumber: string;

    customerNumber: string;
    taxId: string;
    customerName: string;

    invoiceNumber: string | null;
    invoiceAmount: 0;

    type: string;
    period: `${number}`;
    typePeriod: `${number}`;

    paymentCurrency: string;
    foreignCurrencyAmount: number | null;

    paymentAmount: number | null;
    collectAmount: number | null;
    receiptBalance: number | null;
    deduction: number | null;

    retainageTaxCategory: string | null;
    retainageRate: number | null;
    retainageAmount: number | null;

    invoiceDate: string | null;
  }[];
}

type Tres_apiGetARPaymentDataInset = Omit<Tres_apiGetARPaymentData, 'paymentRequest'> & { paymentRequest: null };

interface TsalesOrder_Dto {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  salesOrderNumber: string | null;
  customerId: string | null;
  customerNumber: string | null;
  customerName: string | null;
  constructionSite: string | null;
  companyPhone: string | null;
  companyFax: string | null;
  address: string | null;
  salesCurrency: string | null;
  exchangeRate: number | null;
  currencyAmount: number | null;
  salesAmount: number | null;
  taxes: number | null;
  changedAmount: number | null;
  changedTaxes: number | null;
  totalAmount: number | null;
  status: number | null;
  sourceType: string | null;
  sourceId: string | null;
  quotationNumber: string | null;
  quotationContractNumber: string | null;
  taxId: string | null;
  taxDeductionCategory: string | null;
  invoiceType: string | null;
  salesOrderItems: TsalesOrderItem_Dto[] | null;
}

interface TsalesOrderItem_Dto {
  id: string;
  itemNumber: string | null;
  salesOrderNumber: string | null;
  productId: string | null;
  discount: number | null;
  productName: string | null;
  productNumber: string | null;
  unitPrice: number | null;
  quantity: number | null;
  amount: number | null;
  taxes: number | null;
  attachedToProductId: string | null;
  dualPrice: number | null;
}

type TsalesOrder_post_Dto = {
  customerId: Guid | null; //客戶id
  customerNumber: string | null; //客戶編號
  customerName: string; //客戶名稱
  constructionSite: string; //工地名稱
  companyPhone: string; //公司電話
  companyFax: string; //公司傳真
  address: string; //地址
  salesCurrency: string; //幣別
  exchangeRate: decimal | null; //匯率
  currencyAmount: decimal | null; //外幣金額
  salesAmount: decimal; //銷售金額
  taxes: decimal; //稅金
  changedAmount: decimal | null; //追加減金額
  changedTaxes: decimal | null; //追加減稅金
  totalAmount: decimal; //總金額
  createdAt: DateTime | null; //建立時間
  updatedAt: DateTime | null; //更新時間
  createdBy: string | null; //建立人員
  updatedBy: string | null; //更新人員
  status: int | null; //狀態
  sourceType: string; //來源類型
  sourceId: Guid | null; //來源id(合約ID)
  quotationNumber: string | null; //報價單編號
  quotationContractNumber: string | null; //合約編號
  taxId: string | null; //統一編號
  taxDeductionCategory: string | null; //稅別
  invoiceType: string | null; //發票類型
  salesOrderItems: TsalesOrderItem_post_Dto[]; //銷售訂單明細
};

interface TsalesOrderItem_post_Dto {
  // id: Guid | null; //銷貨明細id // 貓拉，POST的時候哪來的id
  id: null; //銷貨明細id // 貓拉，POST的時候哪來的id
  itemNumber: string | null; //項目編號
  salesOrderNumber: string; //銷售訂單編號
  productId: Guid; //產品id
  discount: decimal | null; //折扣
  productName: string; //產品名稱
  productNumber: string; //產品編號
  unitPrice: decimal | null; //單價
  quantity: decimal | null; //數量
  amount: decimal | null; //金額
  taxes: decimal | null; //稅金
  attachedToProductId: Guid | null; //附加產品id
  dualPrice: decimal | null; //牌價
}

type TsalesOrder_patch_Dto = TsalesOrder_post_Dto & {
  id: string; //銷售訂單id
  salesOrderNumber: string; //銷售訂單編號

  salesOrderItems: TsalesOrderItem_patch_Dto[];
};

type TsalesOrderItem_patch_Dto = TsalesOrderItem_post_Dto & {
  id: string;
  itemNumber: string;
  salesOrderNumber: string;
  productName: string;
  productNumber: string;
};

export type {
  TaccountsReceivablesList_Dto_depressed,
  TaccountsReceivablesList_Dto,
  TquotationListViewModel_Dto,
  TsalesOrderItemData_Dto,
  TpaymentRequest_Dto,
  TaccountsReceivable,
  TinsertpaymentRequest,
  TpaymentRequestType,
  Tres_apiGetARPaymentData,
  Tres_apiGetARPaymentDataInset,
  Tbody_updatePRInvoice,
  //
  TsalesOrder_Dto,
  TsalesOrderItem_Dto,
  TsalesOrder_post_Dto,
  TsalesOrderItem_post_Dto,
  TsalesOrder_patch_Dto,
  TsalesOrderItem_patch_Dto,
};
