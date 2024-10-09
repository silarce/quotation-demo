import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table_paymentApplication from 'components/page/accounting/paymentApplication/table_paymentApplication';
import { SearchModal_applyPayment } from 'components/composition/searchModal/useSearchModal/useSearchModal_applyPayment';
import Detail, { DetailHeader, TimperativeHandle } from 'components/page/accounting/applyPayment/detail';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import Row, { Cell } from 'components/global/gear/table/row';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import {
  TapplyPayment_Dto,
  TapplyPayment_Dto_detailed,
  TcreateApplyPayment_data_Dto,
  TupdateApplyPayment_data_Dto,
  TcreateApplyPayment_Dto,
  TupdateApplyPayment_Dto,
  TpurchaseInvoice_Dto,
  apiPostAddApplyPayment,
  useGetApplyPayment,
  useGetApplyPaymentById,
  useGetApplyPaymentDetail,
} from 'js/api/api_netCore/api_accountant';

import { Tbase } from 'js/api/api_netCore/_schemas';
import type { TuserDto } from 'js/api/dtoTypes';

// ===================================================================================

interface Tstate_applyPayment {
  readonly id?: string;
  readonly serial_number: string | undefined; // 單號
  readonly status: string | undefined;
  payment_date: Moment | null; // 支出日期
  total_price: number | undefined; // 合計
  applicant_department: string | undefined | null; //  申請單位(支出部門)
  description: string | undefined; // 備註說明

  agentName: string | undefined; //  經辦人名字
}

// interface Tstate_detail {
//   readonly id?: string;
//   date: string | undefined; // 發票日期
//   number: string | undefined; // 發票號碼
//   subtotal: number | undefined; // 發票小計
//   tax: number | undefined; // 發票稅額
//   amount_total: number | undefined; // 發票總計金額
//   title: string | undefined; // 發票抬頭
//   tax_id: string | undefined; // 發票統編
//   business_title: string | undefined; // 營業人抬頭
//   business_tax_id: string | undefined; // 營業人統編
//   type: string | undefined; // 發票類別(二聯式/三聯式)
//   payment_status: string | undefined; // 付款狀態
//   tax_type: string | undefined; // 稅別(應稅/零稅/免稅)
//   declaration_category: string | undefined; // 申報類別
//   is_offset: boolean | undefined; // 是否進項折抵
//   note: string | undefined; // 說明備註
//   address: string | undefined; // 發票地址
//   item: string | undefined; // 發票項目
//   accounting_subject: string | undefined; // 會計科目
// }

// type TimperativeHandle = {
//   count: number;
// };

// ===================================================================================
// MARK: START
export default function ApplyPayment({ userInfo }: { userInfo: TuserDto }) {
  const [disabled, setDisabled] = useState(true);
  const [apply_paymnet_id, setApply_paymnet_id] = useState<string>();

  // --------------------------------------------------------------------------
  const {
    res: data_applyPayment,
    clear,
    reqPatch,
    reqDeleteDetail,
    isFetching,
  } = useGetApplyPaymentById(apply_paymnet_id);

  // console.log(data_applyPayment);

  const raw_detailArr = data_applyPayment?.detailArr;
  // --------------------------------------------------------------------------
  const {
    state_detailDict,
    // setState_detailDict,
    addDetail,
    removeDetail,
  } = useDetailArr(raw_detailArr);

  const { state_applyPayment, setState_applyPayment } = useApplyPayment(
    data_applyPayment,
    disabled,
    userInfo.employee?.chName ?? ''
  );

  // --------------------------------------------------------------------------

  const handleSearch = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_applyPayment
          onRowClick={(data) => {
            setApply_paymnet_id(data.id);
            unmount();
          }}
        />
      ),
    });
  };

  const handleAdd = () => {
    clear();
    setDisabled(false);
  };

  // --------------------------------------------------------------------------

  const ref = useRef<(TimperativeHandle | null)[]>([]);
  // const ref = useRef<{ [key: string]: TimperativeHandle | null }>({});

  const test = () => {
    console.log(ref.current);
    // ref.current?.forEach((item) => {
    //   console.log(item?.state_detail);
    // });
  };

  console.log(ref.current);

  // --------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="支出單" />
      <div>
        <BtnBar
          disabled={disabled}
          onSearchClick={handleSearch}
          onCancelClick={() => setDisabled(true)}
          onEditClick={() => setDisabled(false)}
          onAddClick={handleAdd}
        />
        <Spin spinning={isFetching} delay={300}>
          <Profile
            state_applyPayment={state_applyPayment}
            setState_applyPayment={setState_applyPayment}
            disabled={disabled}
          />
          <div>
            <p>費用資訊</p>

            <button onClick={test}>test</button>

            <div>
              <DetailHeader />

              {Object.entries(state_detailDict).map(([id, state_detail], index) => {
                return (
                  <Detail
                    key={id}
                    disabled={disabled}
                    indexNumber={index + 1}
                    raw_detail={state_detail}
                    ref={(handle) => {
                      ref.current[index] = handle;
                    }}
                    onDeleteClick={() => {
                      removeDetail(id);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ==============================================================================

// region HOOKs

const useDetailArr = (detailArr: TpurchaseInvoice_Dto[] | undefined) => {
  const [state, setState] = useState<{ [id: string]: TpurchaseInvoice_Dto | undefined }>({});

  const add = () => {
    setState((state) => {
      return { ...state, [nanoid()]: undefined };
    });
  };

  const remove = (id: string) => {
    setState((state) => {
      const { [id]: removed, ...remain } = state;

      return remain;
    });
  };

  useEffect(() => {
    const detailDict = detailArr?.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
    setState(detailDict ?? {});
  }, [detailArr]);

  return {
    state_detailDict: state,
    setState_detailDict: setState,
    addDetail: add,
    removeDetail: remove,
  };
};

const useApplyPayment = (applyPaymnet: TapplyPayment_Dto | undefined, disabled: boolean, userName: string) => {
  const [state, setState] = useState<Tstate_applyPayment>(emptyState_applyPayment());

  const defaultState = useMemo(() => {
    let defaultState: Tstate_applyPayment = emptyState_applyPayment();

    if (!applyPaymnet) {
      defaultState.agentName = userName;

      return defaultState;
    }

    defaultState = {
      id: applyPaymnet.id,
      serial_number: applyPaymnet.serial_number,
      status: applyPaymnet.status,
      payment_date: moment(applyPaymnet.payment_date),
      total_price: applyPaymnet.total_price,
      applicant_department: applyPaymnet.applicant_department,
      description: applyPaymnet.description,
      agentName: 'agentName',
    };

    return defaultState;
  }, [applyPaymnet, userName]);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return {
    state_applyPayment: state,
    setState_applyPayment: setState,
  };
};

// const useDetail = (detail: TpurchaseInvoice_Dto | undefined, disabled: boolean) => {
//   const [state, setState] = useState<Tstate_detail>();

//   const defaultState = useMemo(() => {
//     if (!detail) {
//       return emptyState_detail();
//     }

//     const defaultState: Tstate_detail = {
//       id: detail.id,
//       date: detail.date,
//       number: detail.number,
//       subtotal: detail.subtotal,
//       tax: detail.tax,
//       amount_total: detail.amount_total,
//       title: detail.title,
//       tax_id: detail.tax_id,
//       business_title: detail.business_title,
//       business_tax_id: detail.business_tax_id,
//       type: detail.type,
//       payment_status: detail.payment_status,
//       tax_type: detail.tax_type,
//       declaration_category: detail.declaration_category,
//       is_offset: detail.is_offset,
//       note: detail.note,
//       address: detail.address,
//       item: detail.item,
//       accounting_subject: detail.accounting_subject,
//     };

//     return defaultState;
//   }, [detail]);

//   useEffect(() => {
//     if (disabled) {
//       setState(defaultState);
//     }
//   }, [defaultState, disabled]);

//   return {
//     state_detail: state,
//     setState_detail: setState,
//   };
// };

// ==============================================================================

// region COMPONENTs

const BtnBar = ({
  disabled,
  onSearchClick,
  onCancelClick,
  onEditClick,
  onAddClick,
}: {
  disabled: boolean;
  onSearchClick: () => void;
  onCancelClick: () => void;
  onEditClick: () => void;
  onAddClick: () => void;
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
            <SquareBtn content="add" className="invisible" />
            <SquareBtn content="cancel" onClick={onCancelClick} />
            <SquareBtn content="save" theme="danger" />
          </>
        )}
        {disabled && (
          <>
            <SquareBtn content="add" onClick={onAddClick} />
            <SquareBtn content="edit" onClick={onEditClick} />
          </>
        )}
      </>
    </ThreePartBar>
  );
};

// MARK:Profile
const Profile = ({
  state_applyPayment,
  setState_applyPayment,
  disabled,
}: {
  state_applyPayment: Tstate_applyPayment;
  setState_applyPayment: React.Dispatch<React.SetStateAction<Tstate_applyPayment>>;
  disabled: boolean;
}) => {
  return (
    <div className="global_grid01">
      <InputSel
        caption="支出單號"
        showBaseline="invisible"
        inputProps={{
          props: {
            defaultValue: state_applyPayment.serial_number,
            placeholder: '儲存後自動產生',
            readOnly: true,
          },
        }}
      />
      <InputSel
        caption="支出日期"
        showBaseline="auto"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: state_applyPayment.payment_date,
            onChange: (date) => {
              setState_applyPayment((prev) => ({ ...prev, payment_date: date }));
            },
          },
        }}
      />
      <InputSel
        caption="支出部門"
        showBaseline="auto"
        disabled={disabled}
        selectProps={{
          props: {
            value: state_applyPayment.applicant_department
              ? {
                  value: state_applyPayment.applicant_department,
                  label: state_applyPayment.applicant_department,
                }
              : null,
            onChange: (option) => {
              setState_applyPayment((prev) => ({ ...prev, applicant_department: option?.value }));
            },
          },
        }}
      />
      <InputSel caption="經辦人員" showBaseline="invisible" node={state_applyPayment.agentName} />
    </div>
  );
};

// const Detail_pre = (
//   {
//     raw_detailArr,
//   }: {
//     raw_detailArr: TpurchaseInvoice_Dto | undefined;
//   },
//   ref: React.Ref<TimperativeHandle>
// ) => {
//   const [count, setCount] = useState(0);

//   useImperativeHandle(
//     ref,
//     (): TimperativeHandle => ({
//       count,
//     })
//   );

//   // return <Row></Row>;
//   return (
//     <div>
//       <button
//         onClick={() => {
//           setCount(count + 1);
//         }}
//       >
//         count test
//       </button>
//       {count}
//     </div>
//   );
// };

// const Detail = forwardRef(Detail_pre);

// ========================================================================

const emptyState_applyPayment = (): Tstate_applyPayment => ({
  id: undefined,
  serial_number: undefined,
  status: undefined,
  payment_date: null,
  total_price: undefined,
  applicant_department: undefined,
  description: undefined,
  agentName: undefined,
});

// const emptyState_detail = (): Tstate_detail => ({
//   id: undefined,
//   date: undefined,
//   number: undefined,
//   subtotal: undefined,
//   tax: undefined,
//   amount_total: undefined,
//   title: undefined,
//   tax_id: undefined,
//   business_title: undefined,
//   business_tax_id: undefined,
//   type: undefined,
//   payment_status: undefined,
//   tax_type: undefined,
//   declaration_category: undefined,
//   is_offset: undefined,
//   note: undefined,
//   address: undefined,
//   item: undefined,
//   accounting_subject: undefined,
// });
