import { TemployeeDto } from '../dtoTypes';

type Tinvoice_type = '二聯式' | '三聯式';
type Ttax_type = '應稅' | '零稅' | '免稅';

export type { Tinvoice_type, Ttax_type };

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
  tax_deduction_category: string | null; //  扣稅類別
  journal_method: string | null; // 立帳方式
  invoice_number: string | null; // 發票號碼
  invoice_price: number | null; // 發票金額
  note: string | null; // 備註
}

type TcreatePurchaseCollectTicket_Dto = Pick<
  TpurchaseCollectTicket_Dto,
  | 'applicant_department'
  | 'agent_employee_id'
  | 'ticket_method'
  | 'tax_deduction_category'
  | 'journal_method'
  | 'invoice_number'
  | 'invoice_price'
  | 'note'
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
}

// ==============================================================================

export type {
  //
  TnetCoreApiBody,
  Tbase,
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
  //
  Tprodreceipt_Dto,
};
