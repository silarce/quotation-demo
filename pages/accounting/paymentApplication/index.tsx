import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';
import { SearchModal_paymentOrder } from 'components/composition/searchModal/useSearchModal/useSearchModal_paymentOrder';
import { Detail, Detail_thead, Detail_tfoot } from 'components/page/accounting/paymentApplication/detail';
import { useReviewFlow } from 'components/composition/review/reviewFlow_2';
import ReviewFlowSelector from 'components/composition/review/reviewFlowSelecor';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  // Tpayment_order_Dto,
  Taccount_payable_Dto,
  TpaymentOrderDetail_Dto,
  TcreatePaymentOrderDetail_Dto,
  TcreatePaymentOrder_Dto,
  // apiGetPaymentOrder,
  // apiGetPaymentOrderById,
  apiPostAddPaymentOrder,
  apiDeletePaymentOrderById,
  apiGetAccountPayableBySupplierId,
  // useGetPaymentOrder,
  useGetPaymentOrderById,
  // useGetAccountPayableBySupplierId,
  Tpayment_order_Dto_detailed,
} from 'js/api/api_netCore/api_accountant';

import { TaddReivew, apiAddReivew, apiGetReviewBack } from 'js/api/api_netCore/api_review';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// type
import { TuserDto, TemployeeDto, TcustomerDto } from 'js/api/dtoTypes';

import scss from './index.module.scss';

import { useTranslation } from 'react-i18next';

// =========================================================================

type Tquery = {
  id?: string | undefined;
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
  // account_payable_id: string | null; //應付帳款uuid // 實際上不應該null
  account_payable_id: string | null; //應付帳款uuid // 實際上不應該null
  identifier: string; // 識別碼
  //
  source_number: string | ''; // 立帳來源單號
  transaction_date: Moment | null; // 交易日期
  accountsPayableInvoicePrice: `${number}` | ''; // accountPayable.invoice_price // 應付帳款 // 不送後端
  payable_amount: `${number}` | ''; // account_payable.invoice_price  // 本次沖銷
  invoice_number: string | ''; // 發票號碼
  unappliedBalance: `${number}` | '' | null; // account_payable.balance // 未沖餘額 // 不送後端
  note: string | ''; // 備註 // 摘要說明
  //
  payment_date: Moment | null; // 付款日期 // 無欄位
  //
  checked: boolean;
  //
}

export type { TstateDetail };

// =========================================================================
export default function PaymentApplication({ userInfo }: { userInfo: TuserDto }) {
  const userId = userInfo?.employee?.id;

  const router = useRouter();
  const query = router.query as Tquery;
  const { id } = query;

  const { t } = useTranslation('accounting', { keyPrefix: 'paymentOrder' });

  const [disabled, setDisabled] = useState(true);

  // --------------------------------------------------------------------------

  const { ReviewFlow, update: update_reviewFlow } = useReviewFlow();

  // --------------------------------------------------------------------------
  const { res: raw_paymentOrder, clear: clear_paymentOrder } = useGetPaymentOrderById(id);

  // --------------------------------------------------------------------------

  const { state, setState, createSetDetail, selectAllDetail } = usePaymentOrder(
    //
    raw_paymentOrder,
    disabled,
    userInfo
  );

  // --------------------------------------------------------------------------

  // region API
  //
  //
  //

  // region reqAdd
  const reqAdd = async () => {
    const {
      // id,
      // serial_number,
      applicant_department,
      offset_method,
      // payable_method,
      note,

      remittance_fee,
      deduction,
      actualpaid,
      total,

      applicant_date,

      beneficiary,
      agent,

      detailArr,
    } = state;

    if (!beneficiary) {
      myAlert.info({ title: '請選擇廠商' });

      return;
    }

    if (!agent) {
      myAlert.info({ title: '沒有經辦人員' });

      return;
    }

    let isWrong = false;

    const data_pre = detailArr.map((detail) => {
      const {
        // id,
        account_payable_id,
        // identifier,
        source_number,
        transaction_date,
        // accountsPayableInvoicePrice,
        payable_amount,
        invoice_number,
        // balance,
        note,
        payment_date,
        checked,
      } = detail;

      if (!account_payable_id) {
        isWrong = true;

        return undefined;
      }

      if (!checked) {
        return null;
      }

      const detailBody: TcreatePaymentOrderDetail_Dto = {
        account_payable_id,
        source_number: source_number || null,
        transaction_date: transaction_date && transaction_date.toISOString(),
        payment_date: payment_date && payment_date.toISOString(),
        invoice_number,
        note,
        payable_amount: payable_amount || null,
      };

      return detailBody;
    });

    if (isWrong) {
      myAlert.err({ title: '至少一筆detail沒有account_payable_id' });
      console.log('至少一筆detail沒有account_payable_id', state);

      return;
    }

    const data = data_pre.filter((item) => !!item) as TcreatePaymentOrderDetail_Dto[];

    const body: TcreatePaymentOrder_Dto = {
      beneficiary_uuid: beneficiary.id,
      applicant_date: applicant_date && applicant_date.toISOString(),
      applicant_department: applicant_department || null,
      agent_employee_id: agent.id || null,
      offset_method,
      total: total || null,
      remittance_fee: remittance_fee || '0',
      deduction: deduction || '0',
      actualpaid: actualpaid || '0',
      note: note || null,
      data,
    };

    await apiPostAddPaymentOrder(body).then((id) => {
      router.replace({
        query: {
          ...query,
          id,
        },
      });
    });
  };

  // region reqDelete
  const reqDelete = async () => {
    if (!state.id) {
      return;
    }

    await apiDeletePaymentOrderById(state.id).then(() => {
      const { id, ...rest } = query;
      router.replace({
        query: rest as Tquery,
      });
    });
  };

  // region reqAddReview
  const reqAddReview = async (review_id: string, title: string) => {
    if (!state.id || !userId) {
      !state.id && myAlert.warning({ title: '狀態無id' });
      !userId && myAlert.warning({ title: 'userInfo.employee.id為undefined' });

      return;
    }

    const body: TaddReivew = {
      review_id,
      document_id: state.serial_number,
      document_uuid: state.id,
      document_type: '付款申請',
      user_id: userId,
      document_title: title,
      query: {
        id: state.id,
      },
    };

    await apiAddReivew(body);
  };

  const reqReviewBack = async () => {
    if (!state.id) {
      myAlert.warning({ title: '狀態無id' });

      return;
    }

    await apiGetReviewBack(state.id);
  };

  // --------------------------------------------------------------------------

  // region HANDLE

  const handleSearch = () => {
    DragableModal.create({
      // handleText: '選擇付款申請單',
      handleText: t('selectPaymentApplication'),
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
            setDisabled(true);
          }}
        />
      ),
    });
  };

  // const handleDelete = () => {
  //   myAlert.confirm({
  //     title: '確認刪除?',
  //     props: {
  //       onOk: reqDelete,
  //     },
  //   });
  // };
  const handleDelete = state.id
    ? () => {
        myAlert.confirm({
          title: '確認刪除?',
          props: {
            onOk: reqDelete,
          },
        });
      }
    : null;

  const handleSentReview = raw_paymentOrder
    ? () => {
        const { unmount } = ReviewFlowSelector.open({
          userId: userId,
          onConfirm: async ({ reviewFlowId, purpose }) => {
            reviewFlowId && (await reqAddReview(reviewFlowId, purpose).then(update_reviewFlow));
            unmount();
          },
        });
      }
    : null;

  const handleSentReviewStop = raw_paymentOrder
    ? () => {
        myAlert.confirm({
          title: '確認抽單?',
          props: {
            onOk: async () => {
              reqReviewBack().then(update_reviewFlow);
            },
          },
        });
      }
    : null;

  const onAdd = () => {
    const { id, ...rest } = query;

    clear_paymentOrder();
    router.replace({
      query: rest as Tquery,
    });
    setDisabled(false);
  };

  const onCancel = () => {
    setDisabled(true);
  };

  const onConfirm = () => {
    reqAdd();
  };

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

  // MARK: RENDER
  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag={t('paymentApplication')} />

      <div>
        <BtnBar
          className="mb-5"
          disabled={disabled}
          onSearchClick={handleSearch}
          onAdd={onAdd}
          onCancel={onCancel}
          onConfirm={onConfirm}
          onDelete={handleDelete}
          onSentReview={handleSentReview}
          onSentReviewStop={handleSentReviewStop}
        />
        <Profile className="mb-5" disabled={disabled} state={state} setState={setState} />

        <SquareBtn className={classNames('mb-2', disabled && 'invisible')} sharp="mini" onClick={selectAllDetail}>
          全選
        </SquareBtn>
        <div className={scss.table}>
          <Detail_thead disabled={disabled} />

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

          <Detail_tfoot disabled={disabled} total={Number(state.total || 0).toLocaleString()} />
        </div>
        <br />
        <ReviewFlow />
      </div>
    </SubLayer>
  );
}

// =========================================================================

// region BtnBar
const BtnBar = ({
  disabled,
  onSearchClick,
  onAdd,
  onCancel,
  onConfirm,
  onDelete,
  onSentReview,
  onSentReviewStop,
  className,
}: {
  disabled: boolean;
  onSearchClick: () => void;
  onAdd: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onDelete: null | (() => void);
  onSentReview: null | (() => void);
  onSentReviewStop: null | (() => void);
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
            <SquareBtn content="add" onClick={onAdd} />
          </>
        )}
        {!disabled && (
          <>
            <SquareBtn content="save" theme="danger" onClick={onConfirm} />
            <SquareBtn content="cancel" onClick={onCancel} />
          </>
        )}
      </div>
      <div className="flex gap-1">
        {onDelete && <SquareBtn content="delete" theme="danger" onClick={onDelete} />}
        {onSentReview && <SquareBtn content="sentReview" onClick={onSentReview} />}
        {onSentReviewStop && <SquareBtn content="sentReviewStop" onClick={onSentReviewStop} />}
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
  const { t } = useTranslation('accounting', { keyPrefix: 'paymentOrder' });
  const { t: t_common } = useTranslation('common');

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
      handleText: t_common('selectSupplier'),
      children: (
        <SearchModal_customer
          onRowClick={async (customer) => {
            await apiGetAccountPayableBySupplierId(customer.id).then((raw_accountPayable) => {
              const stateDetailArr = raw_accountPayable.map((accountPayable) => {
                return createStateDetail_byAccountPayable(accountPayable);
              });

              setState((prev) => {
                return { ...prev, beneficiary: customer, detailArr: stateDetailArr };
              });
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
        caption={t('serial_number')}
        showBaseline="invisible"
        node={state.serial_number}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption={t('applicant_date')}
        showBaseline="invisible"
        node={getTaiwanDateStr(state.applicant_date?.toISOString() || null)}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption={t('applicant_department')}
        showBaseline="invisible"
        node={state.applicant_department}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption={t_common('agent')}
        showBaseline="invisible"
        node={state.agent?.chName}
      />

      {/*  */}
      <InputSel
        {...inputSelConfig_profile}
        caption={t('beneficiaryNumber')}
        htmlFor=""
        showBaseline="invisible"
        suffix={
          <SquareBtn
            className={classNames('mr-2', disabled && 'invisible')}
            sharp="mini"
            label={t('selectBeneficiary')}
            onClick={selectCustomer}
          />
        }
        node={<div>{state.beneficiary?.customerNumber}</div>}
      />

      <InputSel
        {...inputSelConfig_profile}
        caption={t('beneficiary_name')}
        htmlFor=""
        showBaseline="invisible"
        node={state.beneficiary?.name}
      />

      <div></div>
      <div></div>
      {/*  */}

      {/* <InputSel
        {...inputSelConfig_profile}
        caption={t('payable_method')}
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
      /> */}
    </div>
  );
};

// =========================================================================

// MARK:usePaymentOrder
const usePaymentOrder = (
  //
  raw_paymentOrder: Tpayment_order_Dto_detailed | undefined,
  disabled: boolean,
  userInfo: TuserDto
) => {
  //
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
  // --------------------------------------------------------------------------

  const selectAllDetail = () => {
    setState((prev) => {
      const copy = { ...prev };
      copy.detailArr = copy.detailArr.map((detail) => {
        return { ...detail, checked: true };
      });

      return copy;
    });
  };

  const createSetDetail = (index: number) => {
    const setDetail: React.Dispatch<React.SetStateAction<TstateDetail>> = (
      // dispatch: ((detail: TstateDetail) => TstateDetail) | TstateDetail
      dispatch
    ) => {
      setState((state_prev) => {
        const detail = typeof dispatch === 'function' ? dispatch(state_prev.detailArr[index]) : dispatch;

        const copy_stateDetail = [...state_prev.detailArr];
        let total = state_prev.total;

        const shouldCalcTotal =
          copy_stateDetail[index].payable_amount !== detail.payable_amount ||
          copy_stateDetail[index].checked !== detail.checked;

        copy_stateDetail[index] = detail;

        if (shouldCalcTotal) {
          total = copy_stateDetail
            .reduce((acc, cur) => {
              if (cur.checked) {
                return acc.add(cur.payable_amount || 0);
              }

              return acc;
            }, new Decimal(0))
            .toString() as `${number}`;
        }

        return { ...state_prev, total, detailArr: copy_stateDetail };
      });
    };

    return setDetail;
  };

  // --------------------------------------------------------------------------

  useEffect(() => {
    const theDefaultState = {
      ...defaultState,
    };

    if (!theDefaultState.id && !disabled) {
      const agent = userInfo.employee;
      !agent && myAlert.warning({ title: 'userInfo.employee為undefined', content: '將無法新增資料' });
      theDefaultState.agent = agent;
      theDefaultState.applicant_date = moment();
    }

    setState(theDefaultState);
  }, [defaultState, disabled]);

  // --------------------------------------------------------------------------
  return { state, setState, createSetDetail, selectAllDetail };
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
    account_payable_id: detail.account_payable_id,
    identifier: detail.id || `identifier-${nanoid()}`,
    //
    source_number: detail.source_number || '',
    transaction_date: detail.transaction_date ? moment(detail.transaction_date) : null,
    accountsPayableInvoicePrice: '',
    payable_amount: `${detail.payable_amount || ''}`,
    invoice_number: detail.invoice_number || '',
    unappliedBalance: null,
    note: detail.note || '',
    //
    payment_date: detail.payment_date ? moment(detail.payment_date) : null,
    //
    checked: true,
  };

  return stateDetail;
};

const createStateDetail_byAccountPayable = (accountPayable: Taccount_payable_Dto): TstateDetail => {
  const stateDetail: TstateDetail = {
    id: undefined,
    account_payable_id: accountPayable.id,
    identifier: `identifier-${nanoid()}`,
    //
    source_number: accountPayable.source_number || '',
    transaction_date: accountPayable.transaction_date ? moment(accountPayable.transaction_date) : null,
    accountsPayableInvoicePrice: `${accountPayable.invoice_price ?? ''}`,
    payable_amount: `${accountPayable.invoice_price ?? ''}`,
    invoice_number: accountPayable.invoice_number || '',
    // balance: `${accountPayable.balance ?? ''}`,
    unappliedBalance: '0',
    note: accountPayable.note || '',
    //
    payment_date: null,
    //
    checked: false,
  };

  return stateDetail;
};

// interface AddPaymentOrderBody {
//   beneficiary_uuid: string | null; // 廠商 customerDto.id
//   applicant_date: string | null; // 申請日期 ISOstring
//   agent_employee_id: string | null; // 經辦人員 employeeDto.id
//   total: string | null; // 發票金額加總 所有data.payable_amout的總和
//   data: DataBody[];
//   //
//   // warning ----------------
//   offset_method: string | null; // 支付方式 有欄位無property
//   // warning ----------------
//   //
//   payable_method: string | null; // 無欄位 送null
//   deduction: string | null; // 無欄位 送null
//   actualpaid: string | null; // 無欄位 送null
//   note: string | null; // 無欄位 送null
//   remittance_fee: string | null; // 無欄位 送null
//   applicant_department: string | null; // 無欄位 送null
// }

// interface DataBody {
//   account_payable_id: string; // account_payable.id
//   source_number: string; // 立帳來源單號
//   transaction_date: string; // 交易日期
//   invoice_number: string; // 發票號碼
//   note: string; // 摘要說明
//   payable_amount: string; // 本次沖銷
//   //
//   payment_date: string; // 無欄位 送null
// }

/*
account_payable.id               > 　　　　　　      > DataBody.account_payable_id
account_payable.source_number    > 立帳來源單號      > DataBody.source_number
account_payable.transaction_date > 交易日期 (可編輯) > DataBody.transaction_date
account_payable.invoice_price    > 應付帳款          > 只顯示
account_payable.invoice_price    > 本次沖銷 (可編輯) > DataBody.payable_amount
account_payable.invoice_number   > 發票號碼　　      > DataBody.invoice_number
// account_payable.balance          > 未充餘額　　      > 只顯示
                                 > 未充餘額　　      > 只顯示
account_payable.note             > 摘要說明 (可編輯) > DataBody.note
null                             > ？？？？　　      > DataBody.payment_date
*/

// 應付帳款 是否可帶入 發票金額  也就是這一筆明細 應該要付的金額
// detail 我確實沒有放 我原本好像是預設你可以從應付帳款拿 不過加上去可能比較好處理

// 支付方式 需要再加欄位
