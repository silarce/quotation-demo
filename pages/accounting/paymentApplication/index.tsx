import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table_paymentApplication from 'components/page/accounting/paymentApplication/table_paymentApplication';
import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';
import { SearchModal_invoice } from 'components/composition/searchModal/useSearchModal/useSearchModal_invoice';
import { SearchModal_paymentOrder } from 'components/composition/searchModal/useSearchModal/useSearchModal_paymentOrder';
import { Detail, Detail_thead, Detail_tfoot } from 'components/page/accounting/paymentApplication/detail';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';

// api
import {
  Tpayment_order_Dto,
  Taccount_payable_Dto,
  TpaymentOrderDetail_Dto,
  TcreatePaymentOrderDetail_Dto,
  TcreatePaymentOrder_Dto,
  apiGetPaymentOrder,
  apiGetPaymentOrderById,
  apiPostAddPaymentOrder,
  apiDeletePaymentOrderById,
  useGetPaymentOrder,
  useGetPaymentOrderById,
  useGetAccountPayableBySupplierId,
  Tpayment_order_Dto_detailed,
} from 'js/api/api_netCore/api_accountant';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { TemployeeDto, TcustomerDto } from 'js/api/dtoTypes';

import scss from './index.module.scss';
import { nanoid } from 'nanoid';

// =========================================================================

type Tquery = {
  id: string | undefined;
};

interface Tstate {
  id: string | undefined;
  serial_number: string | ''; // 申請單編號
  applicant_department: string | ''; // 申請單位
  offset_method: string | ''; // 沖銷方式
  payable_method: string | ''; // 支付方式
  note: string | ''; // 備註

  remittance_fee: `${number}` | ''; // 匯費外加
  deduction: `${number}` | ''; // 折扣金額
  actualpaid: `${number}` | ''; // 實付金額
  total: `${number}` | ''; // 總金額

  applicant_date: Moment | null; // 申請日期

  beneficiary: TcustomerDto | undefined; // 廠商
  agent: TemployeeDto | undefined; // 經辦人

  detailArr: TstateDetail[];
}

interface TstateDetail {
  id: string | undefined;
  identifier: string; // 識別碼

  source_number: string | ''; // 立帳來源單號
  invoice_number: string | ''; // 發票號碼
  note: string | ''; // 備註 // 摘要說明
  //
  payable_amount: `${number}` | ''; // 應付帳款 // 本次沖銷

  payment_date: Moment | null; // 付款日期
  transaction_date: Moment | null; // 交易日期
  //
  account_payable_id: string | null; //應付帳款uuid // 實際上不應該null
  //
  // 虛值，get沒給也不會傳到後端
  // 這兩個值來自account_payable，新增時才會從account_payable取得
  settled_amount: `${number}` | '' | null; // account_payable已付帳款
  balance: `${number}` | '' | null; // account_payable餘額 // 未沖餘額
}

export type { TstateDetail };

// =========================================================================
export default function PaymentApplication({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id } = query;

  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------
  const { res: raw_paymentOrder } = useGetPaymentOrderById(id);
  // console.log(raw_paymentOrder);

  // --------------------------------------------------------------------------

  const { state, setState, createSetDetail } = usePaymentOrder(raw_paymentOrder, disabled);

  // --------------------------------------------------------------------------

  // region HANDLE

  const handleSearch = () => {
    DragableModal.create({
      children: (
        <SearchModal_paymentOrder
          limit={1}
          onRowClick={(raw) => {
            const id = raw.id;
            router.replace({
              query: {
                ...query,
                id,
              },
            });
          }}
        />
      ),
    });
  };

  const onEdit = () => {
    setDisabled(false);
  };

  const onCancel = () => {
    setDisabled(true);
  };

  const onConfirm = () => {
    setDisabled(true);
  };

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // if (!isAdmin) {
  //   return (
  //     <SubLayer bodyPreStyle="style01">
  //       <PageHeader02 tag="付款申請" />

  //       <div>
  //         <h1 className="text-5xl">施工中</h1>
  //       </div>
  //     </SubLayer>
  //   );
  // }

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="付款申請" />

      <div>
        <BtnBar
          //
          className="mb-5"
          disabled={disabled}
          onSearchClick={handleSearch}
          onEdit={onEdit}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
        <Profile className="mb-5" disabled={disabled} state={state} setState={setState} />

        <div>
          <Detail_thead />
          {state.detailArr.map((stateDetail, index) => {
            const setStateDetail = createSetDetail(index);

            return (
              <Detail
                key={stateDetail.identifier}
                disabled={disabled}
                stateDetail={stateDetail}
                setStateDetail={setStateDetail}
                indexNumber={index + 1}
              />
            );
          })}

          <Detail_tfoot total={Number(state.total || 0).toLocaleString()} />
        </div>

        {/* <Table_paymentApplication /> */}
      </div>
    </SubLayer>
  );
}

// =========================================================================

const BtnBar = ({
  disabled,
  onSearchClick,
  onEdit,
  onCancel,
  onConfirm,
  className,
}: {
  disabled: boolean;

  onSearchClick: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}) => {
  return (
    <div className={classNames(scss.btnBar, className)}>
      <div>
        <SquareBtn content="search" onClick={onSearchClick} />
      </div>
      <div className="flex gap-1">
        {disabled && (
          <>
            <SquareBtn className="invisible" />
            <SquareBtn content="edit" onClick={onEdit} />
          </>
        )}
        {!disabled && (
          <>
            <SquareBtn content="save" onClick={onConfirm} />
            <SquareBtn content="cancel" theme="danger" onClick={onCancel} />
          </>
        )}
      </div>
      <div>
        <SquareBtn content="delete" theme="danger" />
      </div>
    </div>
  );
};

// MARK:Profile
const Profile = ({
  //
  disabled,
  state,
  setState,
  className,
}: {
  disabled: boolean;
  className?: string;
  state: Tstate;
  setState: React.Dispatch<React.SetStateAction<Tstate>>;
}) => {
  const inputSelConfig_profile: TinputSelProps = {
    disabled,
    showBaseline: 'auto',
    captionSize: '18',
    fontSize: '18',
    captionStyle: { width: 120 },
    // wrapperStyle: { width: 250 },
  };

  const selectCustomer = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_customer
          onRowClick={(customer) => {
            setState((prev) => {
              return { ...prev, beneficiary: customer };
            });
            unmount();
          }}
        />
      ),
    });
  };

  return (
    <div className={classNames('global_grid01', className)}>
      <InputSel
        {...inputSelConfig_profile}
        caption="付款申請單號"
        showBaseline="invisible"
        node={state.serial_number}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption="申請日期"
        showBaseline="invisible"
        node={getTaiwanDateStr(state.applicant_date?.toISOString() || null)}
      />

      <InputSel {...inputSelConfig_profile} caption="經辦人員" showBaseline="invisible" node={state.agent?.chName} />

      <div></div>
      {/*  */}
      <InputSel
        {...inputSelConfig_profile}
        caption="廠商代號"
        htmlFor=""
        showBaseline="invisible"
        suffix={
          <SquareBtn
            className={classNames('mr-2', disabled && 'invisible')}
            sharp="mini"
            label="選擇廠商"
            onClick={selectCustomer}
          />
        }
        node={<div>{state.beneficiary?.customerNumber}</div>}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption="廠商名稱"
        htmlFor=""
        showBaseline="invisible"
        node={state.beneficiary?.name}
      />

      <div></div>
      <div></div>
      {/*  */}
      <InputSel
        {...inputSelConfig_profile}
        caption="沖銷方式"
        inputProps={{
          props: {
            value: state.offset_method,
            onChange: (e) => {
              setState((prev) => {
                return { ...prev, offset_method: e.target.value };
              });
            },
          },
        }}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption="支付方式"
        inputProps={{
          props: {
            value: state.payable_method,
            onChange: (e) => {
              setState((prev) => {
                return { ...prev, payable_method: e.target.value };
              });
            },
          },
        }}
      />
    </div>
  );
};

// =========================================================================

// MARK:usePaymentOrder
const usePaymentOrder = (raw_paymentOrder: Tpayment_order_Dto_detailed | undefined, disabled: boolean) => {
  const defaultState: Tstate = useMemo(() => {
    if (raw_paymentOrder === undefined) {
      return emptyState();
    }

    const detailArr: TstateDetail[] = raw_paymentOrder.detailArr.map((detail) => createStateDetail(detail));

    const state: Tstate = {
      id: raw_paymentOrder.id,
      serial_number: raw_paymentOrder.serial_number || '',
      applicant_department: raw_paymentOrder.applicant_department || '',
      offset_method: raw_paymentOrder.offset_method || '',
      payable_method: raw_paymentOrder.payable_method || '',
      note: raw_paymentOrder.note || '',

      remittance_fee: `${raw_paymentOrder.remittance_fee ?? ''}`,
      deduction: `${raw_paymentOrder.deduction ?? ''}`,
      actualpaid: `${raw_paymentOrder.actualpaid ?? ''}`,
      total: `${raw_paymentOrder.total ?? ''}`,

      applicant_date: raw_paymentOrder.applicant_date ? moment(raw_paymentOrder.applicant_date) : null,
      beneficiary: raw_paymentOrder.beneficiary,
      agent: raw_paymentOrder.agent_employee,
      detailArr,
    };

    return state;
  }, [raw_paymentOrder]);

  const [state, setState] = useState<Tstate>(defaultState);

  const createSetDetail = (index: number) => {
    const setDetail: React.Dispatch<React.SetStateAction<TstateDetail>> = (
      // dispatch: ((detail: TstateDetail) => TstateDetail) | TstateDetail
      dispatch
    ) => {
      setState((state_prev) => {
        const detail = typeof dispatch === 'function' ? dispatch(state_prev.detailArr[index]) : dispatch;

        const copy_stateDetail = [...state_prev.detailArr];
        let total = state_prev.total;

        const shouldCalcTotal = copy_stateDetail[index].payable_amount !== detail.payable_amount;

        if (shouldCalcTotal) {
          total = copy_stateDetail
            .reduce((acc, cur) => {
              return acc.add(cur.payable_amount || 0);
            }, new Decimal(0))
            .toString() as `${number}`;
        }

        copy_stateDetail[index] = detail;

        return { ...state_prev, total, detailArr: copy_stateDetail };
      });
    };

    return setDetail;
  };

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return { state, setState, createSetDetail };
};

// region =========================================================================
// region =========================================================================
// region ===========

const emptyState = (): Tstate => ({
  id: undefined,

  serial_number: '',
  applicant_department: '',
  offset_method: '',
  payable_method: '',
  note: '',

  remittance_fee: '',
  deduction: '',
  actualpaid: '',
  total: '',

  applicant_date: null,

  beneficiary: undefined,
  agent: undefined,

  detailArr: [],
});

const createStateDetail = (detail: TpaymentOrderDetail_Dto): TstateDetail => {
  const stateDetail: TstateDetail = {
    id: detail.id,
    identifier: detail.id || `identifier-${nanoid()}`,
    source_number: detail.source_number || '',
    invoice_number: detail.invoice_number || '',
    note: detail.note || '',
    payable_amount: `${detail.payable_amount || ''}`,
    payment_date: detail.payment_date ? moment(detail.payment_date) : null,
    transaction_date: detail.transaction_date ? moment(detail.transaction_date) : null,
    account_payable_id: detail.account_payable_id,

    settled_amount: null,
    balance: null,
  };

  return stateDetail;
};
