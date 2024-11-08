import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';
import _ from 'lodash';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import { SearchModal_applyPayment } from 'components/composition/searchModal/useSearchModal/useSearchModal_applyPayment';
import Detail, { DetailHeader, DetailFooter, TimperativeHandle } from 'components/page/accounting/applyPayment/detail';

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

import { useTranslation } from 'react-i18next';

import scss from './index.module.scss';

// ===================================================================================

interface Tquery {
  apply_paymnet_id?: string;
}

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

interface Tstate_detail extends TpurchaseInvoice_Dto {
  willDelete?: boolean;
}

// ===================================================================================
// MARK: START
export default function ApplyPayment({ userInfo, isAdmin }: { userInfo: TuserDto; isAdmin: boolean }) {
  const { t } = useTranslation('accounting', { keyPrefix: 'applyPayment' });

  const router = useRouter();
  const query = router.query as Tquery;
  const { apply_paymnet_id } = query;

  // --------------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  // const [apply_paymnet_id, setApply_paymnet_id] = useState<string>();

  const [totalPrice, setTotalPrice] = useState(0);

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

    const currentArr = ref_detailArr.current.filter((item) => item !== null) as TimperativeHandle[];

    const idWillDeleteArr: string[] = [];

    const data: Tbody['data'] = (() => {
      const date_pre = currentArr.map((item) => {
        const state_detail = item!.state_detail;

        if (state_detail.id && state_detail.willDelete) {
          idWillDeleteArr.push(state_detail.id);

          return null;
        }

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
          subtotal: state_detail.subtotal || '0',
          tax_type: state_detail.tax_type || null,
        };

        return dataItem;
      });

      return date_pre.filter((item) => !!item) as Tbody['data'];
    })();

    const total_price = `${totalPrice}` as `${number}`;

    const body: Tbody = {
      payment_date: payment_date.toISOString(),
      total_price,
      applicant_department: applicant_department || '',
      description: description || '',
      agent_employee_id: userInfo.employee.id,
      data,
    };

    return { body, idWillDeleteArr };
  };

  const reqPostApplyPayment = async () => {
    const instance = createBody();

    if (!instance) {
      return;
    }

    const { body } = instance;

    apiPostAddApplyPayment(body).then((id) => {
      router.replace({
        query: {
          ...query,
          apply_paymnet_id: id,
        },
      });
      setDisabled(true);
    });
  };

  const reqPatchApplyPayment = async () => {
    const instance = createBody();

    if (!instance) {
      return;
    }

    const { body, idWillDeleteArr } = instance;
    console.log(body);

    new Promise(async (resolve, reject) => {
      try {
        for (const id of idWillDeleteArr) {
          const res = await reqDeleteDetail(id);

          if (!res) {
            break;
          }
        }

        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    })
      .then(() => {
        return reqPatch(body);
      })
      .then(update_data_applyPayment)
      .then(() => setDisabled(true))
      .catch(() => {
        myAlert.err({ title: '更新中斷', content: '若有執行刪除，則部分資料可能已刪除' });
      });
    // await reqPatch(body)
    //   .then(update_data_applyPayment)
    //   .then(() => setDisabled(true));
    // await reqPatch(body)
    //   .then(update_data_applyPayment)
    //   .then(() => setDisabled(true));
  };

  // --------------------------------------------------------------------------

  // region HANDLE

  const countTotalPrice = () => {
    let totalPrice = new Decimal(0);

    ref_detailArr.current.forEach((item) => {
      if (item) {
        const state_detail = item.state_detail;

        totalPrice = totalPrice.add(state_detail.amount_total || 0);
      }
    });

    setTotalPrice(totalPrice.toNumber());
  };

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
            router.replace({
              query: {
                ...query,
                apply_paymnet_id: data.id,
              },
            });

            // unmount();
          }}
        />
      ),
    });
  };

  const handleAdd = () => {
    router.replace({
      query: {
        ...query,
        apply_paymnet_id: undefined,
      },
    });

    clear_data_applyPayment();
    setDisabled(false);
  };

  // --------------------------------------------------------------------------

  useEffect(() => {
    countTotalPrice();
  }, [state_detailDict]);

  // --------------------------------------------------------------------------

  // if (!isAdmin) {
  //   return (
  //     <SubLayer bodyPreStyle="style01">
  //       <PageHeader02 tag={t('applyPayment')} />
  //       <div>
  //         <h1 className="text-5xl">施工中</h1>
  //       </div>
  //     </SubLayer>
  //   );
  // }

  // --------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag={t('applyPayment')} />
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
            <span className="text-xl text-main mt-2 block">{t('paymentDetail')}</span>

            <div className={scss.table}>
              <DetailHeader className={scss.thead} disabled={disabled} onAddClick={addDetail} />
              {Object.entries(state_detailDict).map(([id, state_detail], index) => {
                return (
                  <Detail
                    key={id}
                    className={classNames(state_detail?.willDelete && scss.none)}
                    disabled={disabled}
                    indexNumber={index + 1}
                    raw_detail={state_detail}
                    willDelete={state_detail?.willDelete}
                    ref={(handle) => {
                      ref_detailArr.current[index] = handle;
                    }}
                    onDeleteClick={() => {
                      removeDetail(id);
                    }}
                    onStateUpdate={countTotalPrice}
                  />
                );
              })}
              <DetailFooter className={scss.tfoot} totalPrice={totalPrice.toLocaleString()} />
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

  const [state, setState] = useState<{ [id: string]: Tstate_detail | undefined }>(defaultState);

  const add = () => {
    setState((state) => {
      return { ...state, [nanoid()]: undefined };
    });
  };

  const remove = (id: string) => {
    setState((state) => {
      const copy = _.cloneDeep(state);

      if (!copy || !copy[id]) {
        return copy;
      }

      if (!copy[id]) {
        delete copy[id];
      } else {
        copy[id]!.willDelete = true;
      }

      return copy;
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
  const { t } = useTranslation('accounting', { keyPrefix: 'applyPayment' });
  const { t: t_common } = useTranslation('common');

  const { optionArr_name, update } = useDepartments();

  useEffect(() => {
    update();
  }, []);

  return (
    <div className="global_grid01">
      <InputSel
        caption={t('serial_number')}
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
        caption={t('payment_date')}
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
        caption={t('applicant_department')}
        showBaseline="auto"
        disabled={disabled}
        selectProps={{
          props: {
            placeholder: '請選擇支出部門',
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
      <InputSel caption={t_common('agent')} showBaseline="invisible" node={state_applyPayment.agentName} />
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
