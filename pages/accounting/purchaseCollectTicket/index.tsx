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
  console.log(raw_purchaseCollectTicket);

  // ------------------------------------------------------------

  const { state } = useTicket(raw_purchaseCollectTicket, userInfo.employee);
  console.log('state', state);

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
          <Profile disabled={disabled} />
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
const Profile = ({ disabled }: { disabled: boolean }) => {
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
            defaultValue: '',
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
            // value: state_applyPayment.applicant_department
            //   ? {
            //       value: state_applyPayment.applicant_department,
            //       label: state_applyPayment.applicant_department,
            //     }
            //   : null,
            // onChange: (option) => {
            //   setState_applyPayment((prev) => ({ ...prev, applicant_department: option?.value }));
            // },
          },
        }}
      />
      <InputSel caption={'經辦人員'} showBaseline="invisible" node={''} />
      <div />
      {/*  */}
      <InputSel
        caption={'開票方式'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {},
        }}
      />

      <InputSel
        caption={'扣稅類別'}
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {},
        }}
      />
      <InputSel
        caption={'立帳方式'}
        showBaseline="invisible"
        inputProps={{
          props: {},
        }}
      />
      <div />
      {/*  */}

      <InputSel
        caption={'發票號碼'}
        showBaseline="invisible"
        inputProps={{
          props: {
            placeholder: '請選擇發票',
            readOnly: true,
          },
        }}
        suffix={
          <SquareBtn
            // content="search"
            label="選擇發票"
            sharp="mini"
            onClick={() => {
              // handleSearchInvoice();
            }}
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
          props: {},
        }}
      />
    </div>
  );
};

// ===============================================================================

// MARK:useTicket
const useTicket = (
  //
  rawData: TpurchaseCollectTicket_Dto_detailed | undefined,
  userEmployee: TemployeeDto | undefined
) => {
  const defaultState = useDefaultState(rawData, userEmployee);

  const [state, setState] = useState<Tstate>(defaultState);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return { state };
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
