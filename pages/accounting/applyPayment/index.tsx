import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import { SearchModal_applyPayment } from 'components/composition/searchModal/useSearchModal/useSearchModal_applyPayment';
import Detail, { DetailHeader, TimperativeHandle } from 'components/page/accounting/applyPayment/detail';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
import { useDepartments } from 'js/api/api_department';

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

// ===================================================================================
// MARK: START
export default function ApplyPayment({ userInfo }: { userInfo: TuserDto }) {
  const [disabled, setDisabled] = useState(true);
  const [apply_paymnet_id, setApply_paymnet_id] = useState<string>();

  // --------------------------------------------------------------------------

  // ref.current的長度不會縮短且被填入null的原因
  // https://stackoverflow.com/questions/75927246/how-does-react-clear-the-old-ref-when-calling-ref-callback-after-re-render

  //  If the ref callback is defined as an inline function,
  //  it will get called twice during updates,
  //  first with null and then again with the DOM element.
  //  This is because a new instance of the function is created with each render,
  //  so React needs to clear the old ref and set up the new one.
  const ref_detailArr = useRef<(TimperativeHandle | null)[]>([]);
  // --------------------------------------------------------------------------
  const {
    res: data_applyPayment,
    clear: clear_data_applyPayment,
    update: update_data_applyPayment,
    reqPatch,
    reqDeleteDetail,
    isFetching,
  } = useGetApplyPaymentById(apply_paymnet_id);

  const raw_detailArr = data_applyPayment?.detailArr;
  // --------------------------------------------------------------------------
  const {
    state_detailDict,
    // setState_detailDict,
    addDetail,
    removeDetail,
  } = useDetailArr(raw_detailArr, disabled);

  const { state_applyPayment, setState_applyPayment } = useApplyPayment(
    data_applyPayment,
    disabled,
    userInfo.employee?.chName ?? ''
  );

  // --------------------------------------------------------------------------

  // region API

  const createBody = () => {
    type Tbody = Parameters<typeof reqPatch>[0];

    const {
      payment_date,
      //  total_price,
      applicant_department,
      description,
    } = state_applyPayment;

    if (!payment_date) {
      myAlert.info({ title: '請選擇支出日期' });

      return;
    }

    if (!userInfo.employee?.id) {
      myAlert.info({ title: '沒有經辦人ID' });

      return;
    }

    const data: Tbody['data'] = ref_detailArr.current.map((item) => {
      const state_detail = item!.state_detail;

      const dataItem: TupdateApplyPayment_data_Dto = {
        id: state_detail.id,
        item: state_detail.item || '',
        invoice_business_title: state_detail.business_title || '',
        invoice_type: state_detail.type,
        tax: state_detail.tax || '0',
        amount_total: state_detail.amount_total || '0',
        accounting_subject: state_detail.accounting_subject || '',
        invoice_number: state_detail.number || '',
        note: state_detail.note || '',
      };

      return dataItem;
    });

    const total_price = data
      .reduce((de, item) => {
        return de.add(item.amount_total);
      }, new Decimal(0))
      .toString() as `${number}`;

    const body: Tbody = {
      payment_date: payment_date.toISOString(),
      total_price,
      applicant_department: applicant_department || '',
      description: description || '',
      agent_employee_id: userInfo.employee.id,
      data,
    };

    return body;
  };

  const reqPostApplyPayment = async () => {
    const body = createBody();
    body &&
      apiPostAddApplyPayment(body).then((id) => {
        setApply_paymnet_id(id);
        setDisabled(true);
      });
  };

  const reqPatchApplyPayment = async () => {
    const body = createBody();
    body &&
      (await reqPatch(body)
        .then(update_data_applyPayment)
        .then(() => setDisabled(true)));
  };

  // --------------------------------------------------------------------------

  const handleConfirm = () => {
    if (apply_paymnet_id) {
      reqPatchApplyPayment();
    } else {
      reqPostApplyPayment();
    }
  };

  const handleSearch = () => {
    const { unmount } = DragableModal.create({
      children: (
        <SearchModal_applyPayment
          limit={1}
          onRowClick={(data) => {
            setDisabled(true);
            setApply_paymnet_id(data.id);
            // unmount();
          }}
        />
      ),
    });
  };

  const handleAdd = () => {
    clear_data_applyPayment();
    setDisabled(false);
  };

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
          onConfirmClick={handleConfirm}
        />
        <Spin spinning={isFetching} delay={300}>
          <Profile
            state_applyPayment={state_applyPayment}
            setState_applyPayment={setState_applyPayment}
            disabled={disabled}
          />
          <div>
            <span className="text-xl text-main mt-2 block">費用資訊</span>

            <div>
              <DetailHeader disabled={disabled} onAddClick={addDetail} />
              {Object.entries(state_detailDict).map(([id, state_detail], index) => {
                return (
                  <Detail
                    key={id}
                    disabled={disabled}
                    indexNumber={index + 1}
                    raw_detail={state_detail}
                    ref={(handle) => {
                      ref_detailArr.current[index] = handle;
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
// ==============================================================================
// ==============================================================================

// region HOOKs

const useDetailArr = (detailArr: TpurchaseInvoice_Dto[] | undefined, disabled: boolean) => {
  const defaultState = useMemo(() => {
    const detailDict = detailArr?.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});

    return detailDict ?? {};
  }, [detailArr]);

  const [state, setState] = useState<{ [id: string]: TpurchaseInvoice_Dto | undefined }>(defaultState);

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
    setState(defaultState);
  }, [defaultState, disabled]);

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
      !disabled && (defaultState.agentName = userName);

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
      agentName: applyPaymnet.agent_employee.chName,
    };

    return defaultState;
  }, [applyPaymnet, userName, disabled]);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return {
    state_applyPayment: state,
    setState_applyPayment: setState,
  };
};

// ==============================================================================

// region COMPONENTs

const BtnBar = ({
  disabled,
  onSearchClick,
  onCancelClick,
  onEditClick,
  onAddClick,
  onConfirmClick,
}: {
  disabled: boolean;
  onSearchClick: () => void;
  onCancelClick: () => void;
  onEditClick: () => void;
  onAddClick: () => void;
  onConfirmClick: () => void;
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
  const { optionArr_name, update } = useDepartments();

  useEffect(() => {
    update();
  }, []);

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
            options: optionArr_name,
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
