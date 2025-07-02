import { TemployeeDto } from '../dtoTypes';

type Tinvoice_type = '二聯式' | '三聯式';
type Ttax_type = '應稅' | '零稅' | '免稅';
type Treview_status = '未審核' | '已審核' | '審核中';
type Treview_status__stages = '核准' | '提出' | '簽核中' | '';
type Tdocument_status = '審核中' | '駁回' | '核准' | '抽單';

// ==============================================================================

interface TnetCoreApiBody {
  TypeName: string;
  ServiceName: string;
  FunctionName: string;
  FilterConditions: string; // 將post或patch的body轉為JSON放進去
}

interface Tbase {
  id: string;
  create_by: string | null;
  created_at: string;
  update_by: string | null;
  updated_at: string;
}

// ==============================================================================

// MARK: ============
//
//
//
// region =Review=
//
//
//

interface TreviewFlow {
  id: string;
  name: string;
  enable: boolean;
  stage_counter: number;
  user_id: string;
  created_at: string;
  update_at: string;
  stages: {
    stage_uid: string;
    stage_order: number;
    stage_user_name: string;
    stage_user_title: string;
    review_id: string;
    review_type: string;
  }[];
}

interface TgetReivewById {
  id: string;
  create_at: string;
  create_by: string;
  document_uuid: string;
  /**
   * document_id不是真正的，用來辨識唯一資料的識別id，
   * 也就是說，可能會有多筆資料有同樣的document_id
   * 基本上會是serial_number，但不一定，也不是非serial_number不可
   * 後端似乎通常稱為單號
   */
  document_id: string;
  current_stage: `${number}`;
  document_status: Tdocument_status;
  document_title: string;
  document_type: string;
  prestage_review: string;
  query: string;
  review_id: string;
  stages: {
    review_id: string;
    review_order: number;
    review_memo: string;
    review_person: string;
    review_status: Treview_status__stages;
    review_time: string | '0001-01-01T00:00:00'; // '0001-01-01T00:00:00'代表未審核
    review_title: string;
  }[];
}

interface TaddReivew {
  review_id: TgetReivewById['id']; // 審核流程id
  // 舊時document_id是必須要有值的，但不是每個資料都有document_id
  // 所以有些地方會workaround的送cretedAt進去
  // 但現在可以直接不送document_id了
  // 已經送了document_id的地方不要改掉，不然舊資料會取不到
  document_id?: TgetReivewById['document_id'] | undefined;
  document_uuid: string; // 唯一識別id // 被審核資料的唯一識別id
  document_type: string; // ex:請購單 // 任意字串
  // username: string;
  user_id: string;
  document_title: string; // ex:請購單20241024 // 任意字串
  // get被審核資料時用的query
  query: {
    [key: string]: string | number | undefined;
  };
}

interface TgetReview {
  id: string;
  document_type: string;
  document_id: TgetReivewById['document_id'];
  create_at: string;
  create_by: string;
  review_id: string;
  current_stage: number;
  prestage_review: string;
  document_status: string;
  query: string;
  document_uuid: string;
  document_title: string;
  readed: boolean;
}

// ==============================================================================

// region =Accountant=
//
//
//

// MARK:TaccountantPresetDto
interface TaccountantPresetDto extends Tbase {
  // 帳戶名稱
  account_name: string;
  // 帳號
  account: string;
  // 銀行代號
  bank_code: string;
  // 銀行名稱
  bank_name: string;
}

type TcreateAccountantPresetDto = Omit<TaccountantPresetDto, keyof Tbase>;
type TupdateAccountantPresetDto = Partial<TcreateAccountantPresetDto> & {
  id: string;
};

// MARK:TapplyPaymentDto

interface TapplyPayment_Dto extends Tbase {
  serial_number: string; // 單號
  payment_date: string; //  支出日期
  total_price: number; //  合計
  applicant_department: string; //  申請單位(支出部門)
  description: string; // 備註說明
  agent_employee_id: string; //  經辦人id
  agent_employee: TemployeeDto; // 經辦人
  status: string; // 付款狀態
}

interface TcreateApplyPayment_Dto {
  payment_date: string;
  total_price: `${number}`;
  applicant_department: string;
  description: string;
  agent_employee_id: string;
  data: TcreateApplyPayment_data_Dto[];
}

interface TupdateApplyPayment_Dto extends TcreateApplyPayment_Dto {
  apply_payment_id: string;
  data: TupdateApplyPayment_data_Dto[];
}

interface TcreateApplyPayment_data_Dto {
  item: string;
  invoice_business_title: string;
  invoice_type: Tinvoice_type;
  tax: `${number}`;
  amount_total: `${number}`;
  accounting_subject: string;
  invoice_number: string;
  note: string;

  // w ------------------------------------------------
  // 20241108
  // 實際上api不收，但應該要收，所以先送過去吧，以後應該會收吧
  subtotal: `${number}`;
  // 20241108
  // POST Accountant/AddApplyPayment
  // 新增支出單，不收tax_type
  // POST /Accountant/UpdateApplyPayment
  // 編輯支出單 收tax_type
  // 但是只對新增的detail有效，對舊有的detail無效
  // 另外新增的detail若沒有送tax_type，該detail的tax_type會變成"0"
  tax_type: Ttax_type;
  // w ------------------------------------------------
}
interface TupdateApplyPayment_data_Dto extends TcreateApplyPayment_data_Dto {
  id?: string;
}

// region TpurchaseInvoice_Dto
interface TpurchaseInvoice_Dto extends Tbase {
  date: string | null; // 發票日期
  number: string | null; // 發票號碼
  subtotal: number | null; // 發票小計
  tax: number | null; // 發票稅額
  amount_total: number | null; // 發票總計金額
  title: string | null; // 發票抬頭
  tax_id: string | null; // 發票統編
  business_title: string | null; // 營業人抬頭
  business_tax_id: string | null; // 營業人統編
  type: Tinvoice_type | null; // 發票類別(二聯式/三聯式)
  payment_status: string | null; // 付款狀態
  tax_type: Ttax_type | null; // 稅別(應稅/零稅/免稅)
  declaration_category: string | null; // 申報類別
  is_offset: boolean | null; // 是否進項折抵
  note: string | null; // 說明備註
  apply_payment_uuid: string | null; // 支出單uuid
  account_payable_uuid: string | null; // 付款申請uuid
  address: string | null; // 發票地址
  item: string | null; // 發票項目
  accounting_subject: string | null; // 會計科目
}

// region purchaseCollectTicket
interface TpurchaseCollectTicket_Dto extends Tbase {
  serial_number: string; // 收票單號
  applicant_department: string | null; // 申請單位
  agent_employee_id: string; // 經辦人id
  ticket_method: string | null; // 開票方式
  invoice_number: string | null; // 發票號碼
  invoice_price: number | null; // 發票金額
  note: string | null; // 備註

  acct_method: string | null; // 立帳方式
  tax_deduction_category: string | null; //  扣稅類別

  supplier_name: string | null;
  supplier_uuid: string | null;
}

type TcreatePurchaseCollectTicket_Dto = Pick<
  TpurchaseCollectTicket_Dto,
  | 'applicant_department'
  | 'agent_employee_id'
  | 'ticket_method'
  | 'invoice_number'
  | 'invoice_price'
  | 'note'
  | 'acct_method'
  | 'tax_deduction_category'
  | 'supplier_name'
  | 'supplier_uuid'
> & {
  data: TcreatePurchaseCollectTicketDetail_Dto[];
};

interface TupdatePurchaseCollectTicket_Dto extends TcreatePurchaseCollectTicket_Dto {
  purchase_collect_ticket_uuid: string;
  data: (TcreatePurchaseCollectTicketDetail_Dto | TupdatePurchaseCollectTicketDetail_Dto)[];
}

interface TpurchaseCollectTicketDetail_Dto extends Tbase {
  purchase_collect_ticket_uuid: string; // 收票主檔uuid
  item: string | null; // 項目名稱
  prodreceipt_number: string | null; // 進貨單號
  prodreceipt_uuid: string; // 進貨單uuid
  transaction_date: string | null; // 交易日期
  quantity: number | null; // 數量
  goods_spec: string | null; // 貨品規格
  unit: string | null; // 單位
  unit_price: number | null; // 單價
  amount: number | null; // 應開金額
  note: string | null; // 摘要說明
}

type TcreatePurchaseCollectTicketDetail_Dto = Pick<
  TpurchaseCollectTicketDetail_Dto,
  'item' | 'goods_spec' | 'note' | 'transaction_date' | 'prodreceipt_uuid'
> & {
  // quantity: string;
  unit_price: `${number}` | null;
  // amount: string;
};

interface TupdatePurchaseCollectTicketDetail_Dto extends TcreatePurchaseCollectTicketDetail_Dto {
  detail_uuid: string;
}

// MARK:payment_order

interface Tpayment_order_Dto extends Tbase {
  serial_number: string | null; // 申請單編號
  beneficiary_uuid: string | null; // 廠商uuid
  beneficiary_name: string | null; // 廠商名稱
  applicant_date: string | null; // 申請日期
  applicant_department: string | null; // 申請單位
  agent_employee_id: string | null; // 經辦人Id
  offset_method: string | null; // 沖銷方式
  payable_method: string | null; // 支付方式
  remittance_fee: number | null; // 匯費外加
  deduction: number | null; // 折扣金額
  actualpaid: number | null; // 實付金額
  note: string | null; // 備註
  total: number | null;
}

interface TpaymentOrderDetail_Dto extends Tbase {
  account_payable_id: string | null; //應付帳款uuid
  invoice_number: string | null; // 發票號碼
  note: string | null; // 備註
  payable_amount: number | null; // 應付帳款
  payment_date: string | null; // 付款日期
  payment_order_id: string | null; // 付款申請單uuid
  source_number: string | null; // 立帳來源單號
  transaction_date: string | null; // 交易日期

  // settled_amount: number | null; // 已付帳款
  // balance: number | null; // 未付款餘額
  // payment_order_id: string; //付款申請主檔id
}

type TcreatePaymentOrderDetail_Dto = Pick<
  TpaymentOrderDetail_Dto,
  'source_number' | 'transaction_date' | 'payment_date' | 'invoice_number' | 'note'
> & {
  account_payable_id: string;
  payable_amount: `${number}` | null;
};

interface TcreatePaymentOrder_Dto {
  beneficiary_uuid: string | null;
  applicant_date: string | null;
  applicant_department: string | null;
  agent_employee_id: string | null;
  offset_method: string | null;
  total: `${number}` | null;
  remittance_fee: `${number}`;
  deduction: `${number}`;
  actualpaid: `${number}`;
  note: string | null;
  data: TcreatePaymentOrderDetail_Dto[];
}

// region account_payable
interface Taccount_payable_Dto extends Tbase {
  serial_number: string | null; // varchar(50) - 序號
  review_status: Treview_status | null; // varchar(50) - 審核狀態
  note: string | null; // varchar(200) - 摘要說明
  agent_employee_id: string | null; // varchar - 經辦人員
  invoice_title: string | null; // varchar - 發票抬頭
  invoice_date: string | null; // timestamp - 發票日期
  invoice_number: string | null; // varchar - 發票號碼
  invoice_price: number | null; // int4 - 發票金額
  payment_account: string | null; // 付款帳戶名稱
  payment_account_uuid: string | null; // 付款帳戶id
  payment_status: string | null; // varchar - 付款狀態
  payment_order_uuid: string | null; // uuid - 付款申請單uuid
  payment_order_serial_number: string | null; // varchar - 付款申請單號
  purchase_invoice_uuid: string | null; // uuid - 進項發票uuid
  supplier_uuid: string | null; // uuid - 廠商uuid
  transaction_date: string | null; // timestamp - 交易日期(付款日期)
  source_number: string | null; // varchar - 立帳單號
  settled_amount: number | null; // int4 - 已付金額
  balance: number | null; // int4 - 餘額
  supplier: string | null; // varchar - 廠商名
  supplier_id: string | null; // 廠商編號
  payment_tenor_date: string | null; // 票期日
  payment_method: string | null; // 支付方式
  cheque_id: string | null; // 支票號碼
  statistics_uuid: string | null; // 統計表uuid
}

interface Taccount_payable_statistics extends Tbase {
  date: string;
  note: string;
}

interface Taccount_payable_statistics_detail extends Tbase {
  bank_account_uuid: string; // 付款帳號uui
  payment: number; // 貨款金額
  account_payable_statistics_id: string; // 應付帳款統計表uuid
  note: string; //
  bank_account_name: string; // 付款帳號名稱
}

// MARK: ============
//
//
//
// region =WareHouse=
//
//
//

// region prodreceipt
interface Tprodreceipt_Dto extends Tbase {
  prodreceiptid: number;
  supplieruuid: string;
  invoice: string | '';
  purchaseorderuuid: string;
  purchaseorderid: string;
  inspected: boolean;
  totalprice: number;
  tax: number;
  purchaseordercreate_at: string;
  purchaseordercreate_by: string;
  review_by: string;
  review_at: string;
  review_type: string;
  status: string;
  suppliername: string;
  supplierphone: string;
  supplieraddress: string;
  suppliertaxid: string;
  pay_status: string;
  entry_status: string;
  note: string;
  batchid: string;

  detail: Tprodreceiptdetail_Dto[];
}

interface Tprodreceiptdetail_Dto {
  id: string;
  batchid: string;

  productuuid: string | null;
  productid: string | null;

  prodreceiptid: string | null;
  prodreceiptuuid: string | null;

  purchaseorderid: string | null;
  purchaseorderuuid: string | null;

  purchaseorderdetailuuid: string | null;

  invoice: string | null;

  quantity: number | null;
  totalprice: number | null;
  note: string | null;
  unitprice: number | null;
  name: string | null;
  spec: string | null;
  unit: string | null;
}

// ==============================================================================
// region Engineer

interface TengineerContactExport {
  id: string; // 工程聯絡單id
  contractNumber: string; // 合約編號
  projectName: string; // 工程名稱
  projectNumber: string; // 工程編號
  contractor: string; // 承包商(客戶名稱)
  contractorContactNumber: string; // 承包商公司電話
  contractorFaxNumber: string; // 承包商公司傳真
  contractorPrincipal: string; // 負責人
  constructionSiteContactNumber: string; // 工地連絡電話
  constructionSiteFaxNumber: string; // 工地傳真
  address: string; // 工程地點
  projectPrincipal: string; // 工地負責人
  projectContent: string; // 工程內容
  // annotations: string[];
  annotations: string; // JSON.stringify(string[])
  constructionSitePrincipalContactNumber: string;
  scheduledProgress: string; // 預定進度
  productDetails: {
    id: string; // quotation_productId
    productSpec: string; // 產品規格(api組for匯出)
    itemName: string; // 項目
    fullWidth: number; // 全寬(組產品規格用)
    height: number; // 門高(組產品規格用)
    boxB: number; // 捲箱高度(組產品規格用)
    doorModelName: string; // 門型
    materialName: string; // 材質
    guideRailThickness: number; // 厚度(門軌厚度)
    materialSurface: string; // 表面(當表面為烤漆或氟碳)
    guideRail: string; // 門軌
    closingType: string; // 開關方式
    horsepower: string; // 馬力數
    quantity: string; // 數量
    note: string;
    bounceDoorWidth: string;
  }[];
}

// ==============================================================================

export type {
  //
  TnetCoreApiBody,
  Tbase,
  //
  TreviewFlow,
  TaddReivew as TaddReview,
  TgetReivewById as TgetReviewById,
  TgetReview,
  //
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
  //
  TapplyPayment_Dto,
  TcreateApplyPayment_data_Dto,
  TupdateApplyPayment_data_Dto,
  TcreateApplyPayment_Dto,
  TupdateApplyPayment_Dto,
  TpurchaseInvoice_Dto,
  //
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
  Tpayment_order_Dto,
  TpaymentOrderDetail_Dto,
  TcreatePaymentOrderDetail_Dto,
  TcreatePaymentOrder_Dto,
  //
  Taccount_payable_Dto,
  Taccount_payable_statistics,
  Taccount_payable_statistics_detail,
  //
  Tprodreceipt_Dto,
  Tprodreceiptdetail_Dto,
  //
  TengineerContactExport,
};

export type { Tinvoice_type, Ttax_type, Tdocument_status, Treview_status, Treview_status__stages };
