import { Moment } from 'moment';

import {
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
} from 'js/api/api_netCore/api_accountant';

import { TemployeeDto } from 'js/api/dtoTypes';

interface Tstate {
  id: string | undefined; // purchase_collect_ticket_uuid
  // prodreceipt_uuid: string | undefined; // 進貨單uuid
  //
  agent_employee: TemployeeDto | undefined;
  //
  serial_number: string | undefined; // 收票單號
  applicant_department: string; // 申請單位
  ticket_method: string; // 開票方式
  tax_deduction_category: string; //  扣稅類別
  journal_method: string; // 立帳方式
  invoice_number: string; // 發票號碼
  invoice_price: `${number}` | ''; // 發票金額
  note: string; // 備註
  //
  detailArr: Tstate_detail[];
}

interface Tstate_detail {
  updateCount: number;
  //
  id: string | undefined; // detail_uuid
  identifyId: string;
  //
  item: string;
  prodreceipt_number: string | number;
  transaction_date: Moment | null;
  quantity: `${number}` | '';
  unit: string;
  unit_price: `${number}` | '';
  amount: `${number}` | '';
  note: string;
  //
  goods_spec: string;
  prodreceipt_uuid: string;
}

type Interface_classState = Pick<
  Tstate,
  | 'serial_number'
  | 'applicant_department'
  | 'ticket_method'
  | 'tax_deduction_category'
  | 'journal_method'
  | 'invoice_number'
  // | 'invoice_price'
  | 'note'
> & {
  agentName: string;
  invoice_price: string;
  chagneAgent: (agent: TemployeeDto) => Interface_classState;
  changeInvoice: (invoice: { invoiceNumber: string; invoicePrice: `${number}` | number }) => Interface_classState;
  //
  detailArr: Interface_classState_detail[];
  detailAmountTotal: string;
  addDetail: (state_detailArr: Tstate_detail[]) => Interface_classState;
  deleteDetail: (identifyId: string) => Interface_classState;
  //
  reqBody: TcreatePurchaseCollectTicket_Dto | TupdatePurchaseCollectTicket_Dto;
};

type Interface_classState_detail = Pick<
  Tstate_detail,
  | 'identifyId'
  | 'updateCount'
  | 'item'
  | 'prodreceipt_number'
  | 'transaction_date'
  | 'quantity'
  | 'unit'
  | 'unit_price'
  | 'amount'
  | 'note'
  | 'goods_spec'
> & {
  // identifyId: string;
  // quantity: string;
  // unit_price: string;
  // amount: string;
  deleteSelf: () => Interface_classState_detail;
  reqBody: TcreatePurchaseCollectTicketDetail_Dto | TupdatePurchaseCollectTicketDetail_Dto;
};

export type { Tstate, Tstate_detail, Interface_classState, Interface_classState_detail };
