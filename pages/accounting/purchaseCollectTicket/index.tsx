import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// antd
import { Spin } from 'antd';

// components
import Detail from 'components/page/accounting/purchaseCollectTicket/detail';
import { SearchModal_prodreceipt } from 'components/composition/searchModal/useSearchModal/useSearchModal_prodreceipt';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Row, { Cell } from 'components/global/gear/table/row';

// api
import { useDepartments } from 'js/api/api_department';
import {
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
  TpurchaseCollectTicket_Dto_detailed,
  apiPostAddPurchaseCollectTicket,
  useGetPurchaseCollectTicket,
  useGetPurchaseCollectTicketById,
  useGetPurchaseCollectTicketDetailByTicketId,
  useGetUnpaidProdreceiptByInvoiceNumber,
} from 'js/api/api_netCore/api_accountant';

// type
import { TuserDto, TemployeeDto } from 'js/api/dtoTypes';

// ===========================================================================
type Tquery = {
  purchaseCollectTicketId: string | undefined;
};
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
  // detailArr: (TcreatePurchaseCollectTicketDetail_Dto | TupdatePurchaseCollectTicketDetail_Dto)[];
  detailArr: Tstate_detail[];
}

interface Tstate_detail {
  updateCount: number;
  //
  id: string | undefined; // detail_uuid
  //
  item: string;
  prodreceipt_number: string;
  transaction_date: Moment | null;
  quantity: `${number}` | '';
  unit: string;
  unit_price: `${number}` | '';
  amount: string;
  note: string;
  //
  goods_spec: string;
  prodreceipt_uuid: string | undefined;
}

type TclassState = Pick<
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
  chagneAgent: (agent: TemployeeDto) => TclassState;
  changeInvoice: (invoice: { invoiceNumber: string; invoicePrice: `${number}` | number }) => TclassState;
  //
  detailArr: TclassState_detail[];
  detailTotal: string;
};

type TclassState_detail = Pick<
  Tstate_detail,
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
  identifyId: string;
  // quantity: string;
  // unit_price: string;
  // amount: string;
};

// ===========================================================================

// MARK: START

export default function PurchaseCollectTicket({ userInfo, isAdmin }: { userInfo: TuserDto; isAdmin: boolean }) {
  //
  const router = useRouter();
  const { purchaseCollectTicketId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(true);

  // ------------------------------------------------------------

  const {
    res: raw_purchaseCollectTicket,
    // setRes,
    clear,
    update: update_purchaseCollectTicket,
    reqPatch,
    isFetching: isFetching_purchaseCollectTicket,
  } = useGetPurchaseCollectTicketById(purchaseCollectTicketId ?? '88f78fe4-4ca0-4577-abcd-27dcced43e3a');
  // "88f78fe4-4ca0-4577-abcd-27dcced43e3a"
  // "aa364336-1836-434f-af8f-de1b10f06057"
  // "5f34502e-0741-43c1-ba07-2191d709ba7b"
  // "8dce7a3c-b63c-44fa-a96f-e07647e61500"
  // "b94c34eb-0f88-4c8c-adaa-43f0aad0210a"
  // "d4c94da0-9a36-4f45-9af6-ff7a224c8e54"
  // console.log(raw_purchaseCollectTicket);

  // ------------------------------------------------------------

  const { state, setState } = useTicket({
    rawData: raw_purchaseCollectTicket,
    userEmployee: userInfo.employee,
    disabled,
  });
  // console.log('state', state);

  const State = useMemo(() => {
    return new ClassState(state, setState, ClassState_detail);
  }, [state]);

  // ------------------------------------------------------------

  const handleSelectInvoice = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_prodreceipt
          onRowClick={(prodreceipt) => {
            // console.log(prodreceipt);
            State.changeInvoice({
              //
              invoiceNumber: prodreceipt.invoice,
              // invoicePrice: prodreceipt.invoicePrice, // prodreceipt下沒有prodreceipt
            });
            unmount();
          }}
        />
      ),
    });
  };

  // ------------------------------------------------------------
  // MARK: RENDER
  // ------------------------------------------------------------
  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="進貨收票單" />
      <div>
        <BtnBar
          disabled={disabled}
          // onSearchClick={handleSearch}
          onCancelClick={() => setDisabled(true)}
          onEditClick={() => setDisabled(false)}
          // onAddClick={handleAdd}
          // onConfirmClick={handleConfirm}
        />
        <Spin spinning={isFetching_purchaseCollectTicket} delay={300}>
          <Profile disabled={disabled} classState={State} onInovoiceBtnClick={handleSelectInvoice} />
          <div>
            <div>
              <span>明細資料</span>
              <SquareBtn label="查詢進貨單" sharp="mini" />
            </div>
            <div>
              {/* <Detail_thead /> */}
              {/* <Detail /> */}
            </div>
          </div>
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ===============================================================================
// ===============================================================================
// ===============================================================================

// MARK: BtnBar
const BtnBar = ({
  disabled,
  onSearchClick,
  onCancelClick,
  onEditClick,
  onAddClick,
  onConfirmClick,
}: {
  disabled: boolean;
  onSearchClick?: () => void;
  onCancelClick?: () => void;
  onEditClick?: () => void;
  onAddClick?: () => void;
  onConfirmClick?: () => void;
}) => {
  return (
    <ThreePartBar>
      <>
        <SquareBtn content="search" onClick={onSearchClick} />
        <SquareBtn content="export" />
      </>
      <>
        {!disabled && (
          <>
            <SquareBtn className="invisible" />
            <SquareBtn content="cancel" onClick={onCancelClick} />
            <SquareBtn content="save" theme="danger" onClick={onConfirmClick} />
          </>
        )}
        {disabled && (
          <>
            <SquareBtn content="add" onClick={onAddClick} />
            <SquareBtn content="edit" onClick={onEditClick} />
          </>
        )}
      </>
      <>
        <SquareBtn content="delete" theme="danger" />
      </>
    </ThreePartBar>
  );
};

// MARK: Profile
const Profile = ({
  //
  disabled,
  classState,
  onInovoiceBtnClick,
}: {
  disabled: boolean;
  classState: TclassState;
  onInovoiceBtnClick: () => void;
}) => {
  const { optionArr_name, update } = useDepartments();

  useEffect(() => {
    update();
  }, []);

  return (
    <div className="global_grid01">
      <InputSel
        caption={'收票單號'}
        showBaseline="invisible"
        inputProps={{
          props: {
            defaultValue: classState.serial_number,
            placeholder: '儲存後自動產生',
            readOnly: true,
          },
        }}
      />
      <InputSel
        caption={'部門'}
        showBaseline="auto"
        disabled={disabled}
        selectProps={{
          props: {
            placeholder: '請選擇支出部門',
            options: optionArr_name,
            value: classState.applicant_department
              ? {
                  value: classState.applicant_department,
                  label: classState.applicant_department,
                }
              : null,
            onChange: (option) => {
              classState.applicant_department = option?.value ?? '';
            },
          },
        }}
      />
      <InputSel caption={'經辦人員'} showBaseline="invisible" node={classState.agentName} />
      <div />
      {/*  */}
      <InputSel
        caption={'開票方式'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.ticket_method,
            onChange: (e) => {
              classState.ticket_method = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />

      <InputSel
        caption={'扣稅類別'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.tax_deduction_category,
            onChange: (e) => {
              classState.tax_deduction_category = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />
      <InputSel
        caption={'立帳方式'}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.journal_method,
            onChange: (e) => {
              classState.journal_method = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />
      <div />
      {/*  */}

      <InputSel
        caption={'發票號碼'}
        showBaseline="invisible"
        inputProps={{
          props: {
            value: classState.invoice_number,
            placeholder: '請選擇發票',
            readOnly: true,
          },
        }}
        suffix={
          <SquareBtn
            className={classNames(disabled && 'invisible')}
            label="選擇發票"
            sharp="mini"
            onClick={onInovoiceBtnClick}
          />
        }
      />
      <div />
      <div />
      <div />
      {/*  */}
      <InputSel
        caption={'摘要說明'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: classState.note,
            onChange: (e) => {
              classState.note = e.target.value;
            },
            readOnly: disabled,
            disabled: false,
          },
        }}
      />
    </div>
  );
};

// ===============================================================================

// MARK:useTicket
const useTicket = ({
  rawData,
  userEmployee,
  disabled,
}: {
  rawData: TpurchaseCollectTicket_Dto_detailed | undefined;
  userEmployee: TemployeeDto | undefined;
  disabled: boolean;
}) => {
  const defaultState = useDefaultState(rawData, userEmployee);

  const [state, setState] = useState<Tstate>(defaultState);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return { state, setState };
};

const useDefaultState = (
  //
  rawData: TpurchaseCollectTicket_Dto_detailed | undefined,
  userEmployee: TemployeeDto | undefined
) => {
  const defaultState: Tstate = useMemo(() => {
    if (!rawData) {
      return emptyState(userEmployee);
    } else {
      const detailArr: Tstate_detail[] = rawData.detailArr.map((detail) => {
        const state_detail: Tstate_detail = {
          updateCount: 0,
          id: detail.id,
          item: detail.item || '',
          prodreceipt_number: detail.prodreceipt_number || '',
          transaction_date: detail.transaction_date ? moment(detail.transaction_date) : null,
          quantity: String(detail.quantity || '') as Tstate_detail['quantity'],
          unit: detail.unit || '',
          unit_price: String(detail.unit_price || '') as Tstate_detail['unit_price'],
          amount: detail.amount || '',
          note: detail.note || '',
          goods_spec: detail.goods_spec || '',
          prodreceipt_uuid: detail.prodreceipt_uuid || '',
        };

        return state_detail;
      });

      const state: Tstate = {
        id: rawData.id,
        agent_employee: rawData.agent_employee,
        // prodreceipt_uuid: prodreceipt_uuid,
        //
        serial_number: rawData.serial_number,
        applicant_department: rawData.applicant_department || '',
        ticket_method: rawData.ticket_method || '',
        tax_deduction_category: rawData.tax_deduction_category || '',
        journal_method: rawData.journal_method || '',
        invoice_number: rawData.invoice_number || '',
        invoice_price: String(rawData.invoice_price || '') as Tstate['invoice_price'],
        note: rawData.note || '',
        detailArr: detailArr,
      };

      return state;
    }
  }, [rawData, userEmployee]);

  return defaultState;
};

const emptyState = (agent_employee: TemployeeDto | undefined): Tstate => ({
  id: undefined,
  // prodreceipt_uuid: undefined,
  agent_employee,
  serial_number: undefined,
  applicant_department: '',
  ticket_method: '',
  tax_deduction_category: '',
  journal_method: '',
  invoice_number: '',
  invoice_price: '',
  note: '',
  detailArr: [],
});

const emptyuState_detail = (): Tstate_detail => ({
  updateCount: 0,
  id: undefined,
  //
  item: '',
  prodreceipt_number: '',
  transaction_date: null,
  quantity: '',
  unit: '',
  unit_price: '',
  amount: '',
  note: '',
  //
  goods_spec: '',
  prodreceipt_uuid: undefined,
});

// =============================================================================

// MARK:ClassState
class ClassState implements TclassState {
  private readonly state;
  private readonly setState;
  readonly detailArr: TclassState_detail[] = [];
  //
  constructor(
    //
    state: Tstate,
    setState: React.Dispatch<React.SetStateAction<Tstate>>,
    ClassDetail: new (
      state_datail: Tstate_detail,
      setState_detail: (state_detail: Tstate_detail) => void
    ) => TclassState_detail
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

      return new ClassDetail(detail, setState_detail);
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
  get journal_method() {
    return this.state.journal_method;
  }
  set journal_method(method: string) {
    this.setState((state) => ({
      ...state,
      journal_method: method,
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

  // ------------------------------------------------------------
  chagneAgent(agent: TemployeeDto) {
    this.setState((state) => ({
      ...state,
      agent_employee: agent,
    }));

    return this;
  }

  changeInvoice({
    //
    invoiceNumber,
  }: // invoicePrice,
  {
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
  // ------------------------------------------------------------
  get detailTotal() {
    // this.detailArr.forEach
    return '';
  }
  // get detailArr() {}
} // ClassState

// MARK:ClassState_detail
class ClassState_detail implements TclassState_detail {
  state_datail;
  setState_detail;
  identifyId;

  constructor(state_datail: Tstate_detail, setState_detail: (state_detail: Tstate_detail) => void) {
    this.state_datail = state_datail;
    this.setState_detail = setState_detail;

    this.identifyId = state_datail.id ?? nanoid();
  } // constructor

  get updateCount() {
    return this.state_datail.updateCount;
  }

  get item() {
    return this.state_datail.item;
  }
  set item(item: string) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      item: item,
    });
  }

  get prodreceipt_number() {
    return this.state_datail.prodreceipt_number;
  }

  get transaction_date() {
    return this.state_datail.transaction_date;
  }
  set transaction_date(date: Moment | null) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      transaction_date: date,
    });
  }

  get quantity() {
    return this.state_datail.quantity;
  }
  set quantity(value) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      quantity: value,
    });
  }

  get unit() {
    return this.state_datail.unit;
  }
  set unit(unit: string) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      unit: unit,
    });
  }

  get unit_price() {
    return this.state_datail.unit_price;
  }
  set unit_price(price) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      unit_price: price,
    });
  }

  get amount() {
    return this.state_datail.amount;
  }
  set amount(amount) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      amount: amount,
    });
  }

  get note() {
    return this.state_datail.note;
  }
  set note(note) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      note: note,
    });
  }

  get goods_spec() {
    return this.state_datail.goods_spec;
  }
  set goods_spec(spec) {
    this.countUpdate();
    this.setState_detail({
      ...this.state_datail,
      goods_spec: spec,
    });
  }

  // ------------------------------------------------------------
  private countUpdate() {
    this.setState_detail({
      ...this.state_datail,
      updateCount: this.state_datail.updateCount + 1,
    });

    return this;
  }

  changeProdreceipt({ prodreceiptNumber, prodreceiptId }: { prodreceiptNumber: string; prodreceiptId: string }) {
    this.setState_detail({
      ...this.state_datail,
      prodreceipt_number: prodreceiptNumber,
      prodreceipt_uuid: prodreceiptId,
    });

    this.countUpdate();

    return this;
  }
} // ClassState_detail

// ===============================================================================

// 進貨收票的發票號碼與所有明細的發票號碼皆相同
// 所以查詢進貨單只能選擇相同發票號碼的進貨單
