import Decimal from 'decimal.js';

import { Tstate, Tstate_detail, Interface_classState, Interface_classState_detail } from '../type';
import { TcreatePurchaseCollectTicket_Dto, TupdatePurchaseCollectTicket_Dto } from 'js/api/api_netCore/api_accountant';
import { TemployeeDto } from 'js/api/dtoTypes';

class ClassState implements Interface_classState {
  private readonly state;
  private readonly setState;
  readonly detailArr: Interface_classState_detail[] = [];

  constructor(
    state: Tstate,
    setState: React.Dispatch<React.SetStateAction<Tstate>>,
    ClassDetail: new (
      state_datail: Tstate_detail,
      setState_detail: (state_detail: Tstate_detail) => void,
      parent: Interface_classState
    ) => Interface_classState_detail
  ) {
    this.state = state;
    this.setState = setState;

    this.detailArr = state.detailArr.map((detail, index) => {
      const setState_detail = (state_detail: Tstate_detail) => {
        setState((state) => {
          const newDetailArr = [...state.detailArr];
          newDetailArr[index] = state_detail;

          return {
            ...state,
            detailArr: newDetailArr,
          };
        });
      };

      return new ClassDetail(detail, setState_detail, this);
    });
  } // constructor
  //
  get agentName() {
    return this.state.agent_employee?.chName ?? '';
  }
  get serial_number() {
    return this.state.serial_number ?? '';
  }
  get applicant_department() {
    return this.state.applicant_department;
  }
  set applicant_department(department: string) {
    this.setState((state) => ({
      ...state,
      applicant_department: department,
    }));
  }
  get ticket_method() {
    return this.state.ticket_method;
  }
  set ticket_method(method: string) {
    this.setState((state) => ({
      ...state,
      ticket_method: method,
    }));
  }
  get tax_deduction_category() {
    return this.state.tax_deduction_category;
  }
  set tax_deduction_category(category: string) {
    this.setState((state) => ({
      ...state,
      tax_deduction_category: category,
    }));
  }
  get acct_method() {
    return this.state.acct_method;
  }
  set acct_method(method: string) {
    this.setState((state) => ({
      ...state,
      acct_method: method,
    }));
  }
  get invoice_number() {
    return this.state.invoice_number;
  }
  set invoice_number(number: string) {
    this.setState((state) => ({
      ...state,
      invoice_number: number,
    }));
  }
  get invoice_price() {
    return Number(this.state.invoice_price).toLocaleString();
  }
  get note() {
    return this.state.note;
  }
  set note(note: string) {
    this.setState((state) => ({
      ...state,
      note: note,
    }));
  }

  get supplier_name() {
    return this.state.supplier_name;
  }

  get detailAmountTotal() {
    let total = new Decimal(0);
    this.detailArr.forEach(({ amount }) => {
      total = total.add(amount || 0);
    });

    return total.toNumber().toLocaleString();
  }

  get reqBody() {
    const {
      id,
      agent_employee,
      applicant_department,
      ticket_method,
      tax_deduction_category,
      acct_method,
      invoice_number,
      invoice_price,
      note,
    } = this.state;

    // const body: TcreatePurchaseCollectTicket_Dto | TupdatePurchaseCollectTicket_Dto = {
    //   purchase_collect_ticket_uuid: id,
    //   applicant_department: applicant_department,
    //   agent_employee_id: agent_employee?.id || '',
    //   ticket_method: ticket_method,
    //   tax_deduction_category: tax_deduction_category,
    //   acct_method,
    //   invoice_number: invoice_number,
    //   invoice_price: Number(invoice_price),
    //   note: note,
    //   data: this.detailArr.map((classDetail) => classDetail.reqBody),
    // };

    const body_create: TcreatePurchaseCollectTicket_Dto = {
      applicant_department: applicant_department,
      agent_employee_id: agent_employee?.id || '',
      ticket_method: ticket_method,
      tax_deduction_category: tax_deduction_category,
      acct_method: acct_method,
      invoice_number: invoice_number,
      invoice_price: Number(invoice_price),
      note: note,
      data: this.detailArr.map((classDetail) => classDetail.reqBody),

      supplier_name: this.state.supplier_name,
      supplier_uuid: this.state.supplier_uuid,
    };

    const body_update: TupdatePurchaseCollectTicket_Dto | null = id
      ? {
          purchase_collect_ticket_uuid: id,
          applicant_department: applicant_department,
          agent_employee_id: agent_employee?.id || '',
          ticket_method: ticket_method,
          tax_deduction_category: tax_deduction_category,
          acct_method: acct_method,
          invoice_number: invoice_number,
          invoice_price: Number(invoice_price),
          note: note,
          data: this.detailArr.map((classDetail) => classDetail.reqBody),

          supplier_name: this.state.supplier_name,
          supplier_uuid: this.state.supplier_uuid,
        }
      : null;

    // if (id) {
    //   return body as TupdatePurchaseCollectTicket_Dto;
    // }

    return {
      body_create,
      body_update,
    };
  }

  // ------------------------------------------------------------

  editCustomer({
    supplierSource,
    supplier_name,
    supplier_uuid,
    tax_deduction_category,
    acct_method,
  }: Parameters<Interface_classState['editCustomer']>[0]) {
    this.setState((state) => {
      const copy = { ...state };

      if (supplierSource === 'prodreceipt') {
        copy.supplier_name = supplier_name;
        copy.supplier_uuid = supplier_uuid;
      } else if (supplierSource === 'customer') {
        copy.supplier_name = supplier_name;
        copy.supplier_uuid = supplier_uuid;
        copy.tax_deduction_category = tax_deduction_category;
        copy.acct_method = acct_method;
      }

      return copy;
    });
  }

  chagneAgent(agent: TemployeeDto) {
    this.setState((state) => ({
      ...state,
      agent_employee: agent,
    }));

    return this;
  }

  changeInvoice({
    invoiceNumber,
  }: {
    invoiceNumber: string;
    // 後端說invoicePrice不用管，
    // invoicePrice: `${number}` | number;
  }) {
    this.setState((state) => ({
      ...state,
      invoice_number: invoiceNumber,
      // invoice_price: `${invoicePrice}`,
    }));

    return this;
  }

  addDetail(newState_detailArr: Tstate_detail[]) {
    this.setState((state) => {
      return {
        ...state,
        detailArr: [...state.detailArr, ...newState_detailArr],
      };
    });
    // 不需要做其他的操作，更新狀態就會重新建立class了

    return this;
  }

  deleteDetail(identifyId: string) {
    this.setState((state) => {
      return {
        ...state,
        detailArr: state.detailArr.filter((classDetail) => classDetail.identifyId !== identifyId),
      };
    });

    return this;
  }

  clearDetail() {
    this.setState((state) => {
      return {
        ...state,
        detailArr: [],
      };
    });

    return this;
  }
} // ClassState

export { ClassState };
