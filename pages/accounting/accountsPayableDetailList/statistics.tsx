import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';
import { nanoid } from 'nanoid';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import {
  Row_thead,
  Row_tbody,
  createValueProps,
} from 'components/page/accounting/accountsPayableDetailList/index/Table';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconDelete01, IconRemoveCircle, IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

import {
  Taccount_payable_Dto,
  Taccount_payable_statistics_detail,
  //
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  apiPostAddAccountPayableStatistics,
  apiPatchUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
} from 'js/api/api_netCore/api_accountant';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import scss from './statistics.module.scss';

// ================================================================================

interface Tquery {
  year?: string;
  month?: string;
}

interface Tstate_detail {
  detail_id: string | null;
  payment: `${number}` | '';
  note: string;
  bank_account_uuid: string | null;
  bank_account_name: string;
}

interface Tstate {
  [id: string]: Tstate_detail;
}

// ================================================================================
export default function Statistics() {
  const router = useRouter();
  const { year, month } = router.query as Tquery;

  // -------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);

  // -------------------------------------------------------------------------

  const { raw } = useGetAccountPayableStatisticsByIdOrDate({
    date: `${year}-${month}`,
  });
  const raw_statistics = raw?.[0];

  const { raw: raw_accountPayable } = useGetAccountPayableBy(
    useMemo(() => {
      if (raw_statistics?.id) {
        return {
          statistics: {
            statistics_id: raw_statistics.id,
          },
        };
      }
    }, [raw_statistics]),
    { autoUpdate: true }
  );

  const { raw: raw_statisticsDetailArr } = useGetAccountPayableStatisticsDetailByStatisticsId(raw_statistics?.id);

  // -------------------------------------------------------------------------

  const { state, addDetail, deleteDetail, createSetDetail } = useDetail({
    disabled,
    detailArr: raw_statisticsDetailArr,
  });

  // -------------------------------------------------------------------------

  const panelList = createPanelList({
    disabled,
    onDelete: () => {},
    onEdit: () => setDisabled(false),
    onSendReview: () => {},
    onCancel: () => setDisabled(true),
    onConfirm: () => {},
  });

  // -------------------------------------------------------------------------

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="應付帳款統計表" panelList={panelList} />

      <div className={scss.body}>
        <div className={scss.accountPayable}>
          <Row_thead className={scss.thead} disabled={true} />
          {raw_accountPayable?.map((raw) => {
            const props: Parameters<typeof Row_tbody>[0] = {
              ...createValueProps(raw),
              disabled: true,
              noCheck: true,
              noDetail: true,
            };

            return <Row_tbody key={raw.id} {...props} />;
          })}
        </div>
        <div className={scss.detailWrapper}>
          <div className="text-xl mb-2">合計</div>
          <div className={scss.detailContainer}>
            {Object.entries(state).map(([key, stateDetail]) => {
              const setDetail = createSetDetail(key);
              const onDelete = () => deleteDetail(key);

              return (
                <Detail
                  key={key}
                  disabled={disabled}
                  stateDetail={stateDetail}
                  setDetail={setDetail}
                  onDelete={onDelete}
                />
              );
            })}
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// ============================================================================

// MARK: Detail
const Detail = ({
  //
  disabled,
  stateDetail,
  setDetail,
  onDelete,
}: {
  disabled: boolean;
  stateDetail: Tstate_detail;
  setDetail: (props: (prev: Tstate_detail) => Tstate_detail | Tstate_detail) => void;
  onDelete: () => void;
}) => {
  return (
    <div className={scss.detail}>
      <IconRemove02 className={classNames('m-auto', disabled && 'invisible')} />
      <div className={scss.inputCell}>
        <InputSel
          //
          disabled={disabled}
          showBaseline="auto"
          inputProps={{
            props: {
              placeholder: '付款帳號名稱',
              disabled: false,
              readOnly: disabled,
              value: stateDetail.bank_account_name,
              onChange: (e) => {
                const value = e.target.value;
                setDetail((prev) => ({ ...prev, bank_account_name: value }));
              },
            },
          }}
        />
      </div>
      <div className={scss.moneyCell}>
        <InputSel
          //
          disabled={disabled}
          showBaseline="auto"
          inputProps={{
            props: {
              placeholder: '金額',
              className: 'text-right',
              type: 'number',
              disabled: false,
              readOnly: disabled,
              value: stateDetail.payment,
              onChange: (e) => {
                const value = e.target.value as `${number}`;
                setDetail((prev) => ({ ...prev, payment: value }));
              },
            },
          }}
        />
      </div>
    </div>
  );
};
// ============================================================================

// MARK: useDetail
const useDetail = ({
  disabled,
  detailArr,
}: {
  disabled: boolean;
  detailArr: Taccount_payable_statistics_detail[] | undefined;
}) => {
  const defaultState = useMemo(() => {
    const defaultState: Tstate = {};

    detailArr?.forEach((detail) => {
      const state: Tstate_detail = {
        detail_id: detail.id,
        payment: `${detail.payment}`,
        note: detail.note,
        bank_account_uuid: detail.bank_account_uuid,
        bank_account_name: detail.bank_account_name,
      };
      defaultState[detail.id] = state;
    });

    return defaultState;
  }, [detailArr]);

  // -------------------------------------------------------------------------
  const [state, setState] = useState(defaultState);

  // -------------------------------------------------------------------------
  const addDetail = () => {
    setState((prev) => {
      const copy = { ...prev };

      copy[`new-${nanoid()}`] = {
        detail_id: null,
        payment: '',
        note: '',
        bank_account_uuid: null,
        bank_account_name: '',
      };

      return copy;
    });
  };

  const deleteDetail = (id: string) => {
    setState((prev) => {
      const copy = { ...prev };
      const { [id]: removed, ...restCopy } = copy;

      return restCopy;
    });
  };

  const createSetDetail = (id: string) => {
    const setDetail = (props: (prev: Tstate_detail) => Tstate_detail | Tstate_detail) => {
      let detail: Tstate_detail;

      if (typeof props === 'function') {
        detail = props(state[id]);
      } else {
        detail = props;
      }

      setState((prev) => {
        const copy = { ...prev };
        copy[id] = detail;

        return copy;
      });
    };

    return setDetail;
  };

  // -------------------------------------------------------------------------

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);
  useEffect(() => {
    disabled && setState(defaultState);
  }, [disabled]);

  return {
    state,
    addDetail,
    deleteDetail,
    createSetDetail,
  };
};

// ============================================================================

const createPanelList = ({
  disabled,
  onDelete,
  onEdit,
  onSendReview,
  onCancel,
  onConfirm,
}: {
  disabled: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onSendReview: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '刪除',
      onClick: onDelete,
    },
    {
      type: 'myButton',
      label: '編輯',
      onClick: onEdit,
    },
    {
      type: 'myButton',
      label: '送審',
      onClick: onSendReview,
    },
  ];
  const panelList_abled: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: onCancel,
    },
    {
      type: 'myButton',
      label: '上傳',
      onClick: onConfirm,
    },
  ];

  return disabled ? panelList_disabled : panelList_abled;
};
