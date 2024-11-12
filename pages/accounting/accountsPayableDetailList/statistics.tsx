import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import _ from 'lodash';

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
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';
import { useReviewFlow } from 'components/composition/review/reviewFlow';

// icon
import { IconRemove02, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

import {
  Taccount_payable_Dto,
  Taccount_payable_statistics_detail,
  //
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  apiPostAddAccountPayableStatistics,
  apiUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
} from 'js/api/api_netCore/api_accountant';
import { useGetBankAccount } from 'js/api/api_netCore/api_accountant';

//
import type { Toption } from 'js/utils/options/options';

import scss from './statistics.module.scss';

import type { TuserDto } from 'js/api/dtoTypes';

import { useTranslation } from 'react-i18next';

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

// MARK: START

export default function Statistics({ userInfo }: { userInfo: TuserDto }) {
  const userId = userInfo.employee?.id;

  const router = useRouter();
  const query = router.query as Tquery;
  const { year, month } = query as Tquery;

  const { t } = useTranslation('accounting', { keyPrefix: 'accountsPayableDetailList.statistics' });
  const { t: t_common } = useTranslation('common');

  // -------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);

  // -------------------------------------------------------------------------

  const {
    raw,
    isFetching: isFetching_statistics,
    isFirstLoaded: isFirstLoaded_statistics,
  } = useGetAccountPayableStatisticsByIdOrDate({
    date: `${year}-${month}`,
  });
  const raw_statistics = raw?.[0];

  const {
    raw: raw_accountPayable,
    isFetching: isFetching_accountPayable,
    isFirstLoaded: isFirstLoaded_accountPayable,
  } = useGetAccountPayableBy(
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

  const {
    raw: raw_statisticsDetailArr,
    isFetching: isFetching_statisticsDetailArr,
    update: update_statisticsDetailArr,
    isFirstLoaded: isFirstLoaded_statisticsDetailArr,
  } = useGetAccountPayableStatisticsDetailByStatisticsId(raw_statistics?.id);

  const { rawData_bankAccount, update_bankAccount, isFetching_bankAccount, isFirstLoaded_bankAccount } =
    useGetBankAccount();

  const {
    ReviewFlow,
    reviewFlow,
    // update: update_reviewFlow,
    isFetching: isFetching_reviewFlow,
    isFirstLoaded: isFirstLoaded_reviewFlow,
    reqAddReview,
    sentReviewStop,
  } = useReviewFlow({
    uuid: raw_statistics?.id,
  });

  const isFetching =
    isFetching_statistics ||
    isFetching_accountPayable ||
    isFetching_statisticsDetailArr ||
    isFetching_bankAccount ||
    isFetching_reviewFlow;

  const isReady =
    isFirstLoaded_statistics &&
    isFirstLoaded_accountPayable &&
    isFirstLoaded_statisticsDetailArr &&
    isFirstLoaded_bankAccount &&
    isFirstLoaded_reviewFlow;

  // -------------------------------------------------------------------------

  // region STATE

  const { state, addDetail, deleteDetail, createSetDetail } = useDetail({
    disabled,
    detailArr: raw_statisticsDetailArr,
  });

  // -------------------------------------------------------------------------
  // region API

  const reqUpdateAccountPayableStatisticsById = async () => {
    type Tbody = Parameters<typeof apiUpdateAccountPayableStatisticsById>[0];

    const statisticsId = raw_statistics?.id;

    if (!statisticsId) {
      throw new Error('沒有statisticsId');
    }

    const arr: Tbody['data'] = Object.values(state).map((detail) => {
      const { detail_id, payment, note, bank_account_uuid, bank_account_name } = detail;

      const data: Tbody['data'][number] = {
        detail_id: detail_id || undefined,
        payment: payment || '0',
        note,
        bank_account_uuid: bank_account_uuid || undefined,
        bank_account_name,
      };

      return data;
    });
    const body: Parameters<typeof apiUpdateAccountPayableStatisticsById>[0] = {
      id: statisticsId,
      data: arr,
    };

    await apiUpdateAccountPayableStatisticsById(body)
      .then(async () => {
        await update_statisticsDetailArr();
        setDisabled(true);
      })
      .catch(() => {});
  };

  const reqDelateAccountPayableStatisticsById = async () => {
    const statisticsId = raw_statistics?.id;

    if (!statisticsId) {
      throw new Error('沒有statisticsId');
    }

    await apiDeleteAccountPayableStatisticsById(statisticsId)
      .then(() => {
        router.push('/accounting/accountsPayableDetailList');
      })
      .catch(() => {});
  };

  // -------------------------------------------------------------------------

  // region HANDLE
  const handleDelete = !reviewFlow
    ? () => {
        myAlert.confirm({
          title: '確定刪除?',
          props: {
            onOk: reqDelateAccountPayableStatisticsById,
          },
        });
      }
    : null;

  const handleSendReview =
    raw_statistics && !reviewFlow
      ? () => {
          if (!raw_statistics || !userId) {
            return;
          }

          const { destroy } = ReviewFlowSelector.open2({
            userId,
            onConfirm: async ({ reviewFlowId, purpose }) => {
              if (!reviewFlowId) {
                myAlert.info({ title: '請選擇審核流程' });

                return;
              }

              const body: Parameters<typeof reqAddReview>[0] = {
                review_id: reviewFlowId,
                document_id: raw_statistics.date,
                // document_uuid: raw_statistics.id,
                document_type: '應付帳款統計表',
                user_id: userId,
                document_title: purpose,
                query: {
                  ...query,
                },
              };

              await reqAddReview(body);

              destroy();
            },
          });
        }
      : null;

  const handleReviewStop = raw_statistics && reviewFlow && !reviewFlow.document_status ? sentReviewStop : null;

  // -------------------------------------------------------------------------

  // MARK: PROPS

  const options = useMemo(() => {
    if (!rawData_bankAccount) {
      return [];
    }

    return rawData_bankAccount.map((item) => {
      const option: Toption = {
        value: item.account_name,
        label: item.account_name,
        id: item.id,
      };

      return option;
    });
  }, [rawData_bankAccount]);

  const panelList = usePanelList({
    disabled,
    onDelete: handleDelete,
    onEdit: !reviewFlow ? () => setDisabled(false) : null,
    onSendReview: handleSendReview,
    onCancel: () => setDisabled(true),
    onConfirm: reqUpdateAccountPayableStatisticsById,
    onSendReivewStop: handleReviewStop,
    onReture: () => router.back(),
  });

  // -------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    update_bankAccount();
  }, []);

  // -------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer bodyPreStyle="style01" isLoading_subLayer={isFetching}>
      <PageHeader02 tag={t('accountsPayableStatistics')} panelList={isReady ? panelList : []} />

      <div className={scss.body}>
        <div className={scss.accountPayable}>
          <Row_thead className={scss.thead} disabled={true} noCheck={true} noDetail={true} />
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
          <div className="text-xl mb-2">
            <span>{t_common('total')}</span>
            {!disabled && (
              <IconAddCircle
                //
                className="inline-block align-middle ml-2 w-5 h-5 select-none"
                onClick={addDetail}
              />
            )}
          </div>
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
                  options={options}
                />
              );
            })}
          </div>
        </div>
        <ReviewFlow />
      </div>
    </SubLayer>
  );
}

// MARK: END

// ============================================================================
// ============================================================================
// ============================================================================

// MARK: Detail
const Detail = ({
  //
  disabled,
  stateDetail,
  setDetail,
  onDelete,
  options,
}: {
  disabled: boolean;
  stateDetail: Tstate_detail;
  setDetail: (props: (prev: Tstate_detail) => Tstate_detail | Tstate_detail) => void;
  onDelete: () => void;
  options: Toption[];
}) => {
  const isNew = stateDetail.detail_id === null;
  const accountProps = createInputSelProps({
    options,
    stateDetail,
    setDetail,
  });

  return (
    <div className={classNames(scss.detail, isNew && 'bg-hoverBgc')}>
      <IconRemove02 className={classNames('m-auto', disabled && 'invisible')} onClick={onDelete} />
      <div className={scss.accountNameCell}>
        <InputSel
          //
          disabled={disabled}
          showBaseline="auto"
          {...accountProps}
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
              type: disabled ? 'text' : 'number',
              disabled: false,
              readOnly: disabled,
              value:
                disabled && stateDetail.payment ? Number(stateDetail.payment).toLocaleString() : stateDetail.payment,
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

// MARK:createPanelList
const usePanelList = ({
  disabled,
  onDelete,
  onEdit,
  onCancel,
  onConfirm,
  onSendReview,
  onSendReivewStop,
  onReture,
}: {
  disabled: boolean;
  onDelete: undefined | null | (() => void);
  onEdit: undefined | null | (() => void);
  onCancel: () => void;
  onConfirm: () => void;
  onSendReview: undefined | null | (() => void);
  onSendReivewStop: undefined | null | (() => void);
  onReture: () => void;
}) => {
  const { t } = useTranslation('accounting', { keyPrefix: 'accountsPayableDetailList.statistics' });
  const { t: t_common } = useTranslation('common');

  const panelList_disabled: TpanelList = [
    onDelete && {
      type: 'redButton',
      label: t('deleteStatistics'),
      onClick: onDelete,
    },
    onEdit && {
      type: 'myButton',
      label: t_common('edit'),
      onClick: onEdit,
    },
    onSendReview && {
      type: 'myButton',
      label: t_common('sendReview'),
      onClick: onSendReview,
    },
    onSendReivewStop && {
      type: 'myButton',
      label: t_common('sendReviewStop'),
      onClick: onSendReivewStop,
    },
    {
      type: 'myButton',
      label: t_common('return'),
      onClick: onReture,
    },
  ];
  const panelList_abled: TpanelList = [
    {
      type: 'myButton',
      label: t_common('cancel'),
      onClick: onCancel,
    },
    {
      type: 'redButton',
      label: t_common('confirm'),
      onClick: onConfirm,
    },
  ];

  return disabled ? panelList_disabled : panelList_abled;
};

// MARK:createInputSelProps
const createInputSelProps = ({
  options,
  stateDetail,
  setDetail,
}: {
  options: Toption[];
  stateDetail: Tstate_detail;
  setDetail: (props: (prev: Tstate_detail) => Tstate_detail | Tstate_detail) => void;
}) => {
  const selectProps_forNew: TinputSelProps['selectProps'] = {
    props: {
      placeholder: '選擇或輸入銀行帳戶',
      isSearchable: true,
      options: options,
      value: stateDetail.bank_account_name
        ? {
            value: stateDetail.bank_account_name,
            label: stateDetail.bank_account_name,
            id: stateDetail.detail_id,
          }
        : null,
      onChange: (option) => {
        const bank_account_uuid = (option?.id || null) as string | null;

        setDetail((prev) => ({
          ...prev,
          bank_account_uuid: bank_account_uuid,
          bank_account_name: option?.value ?? '',
        }));
      },
    },
  };

  const selectProps_forOld: TinputSelProps['selectProps'] = _.cloneDeep(selectProps_forNew);
  selectProps_forOld.props!.placeholder = '選擇銀行帳戶';
  selectProps_forOld.props!.isSearchable = false;

  const inputProps_forOld: TinputSelProps['inputProps'] = {
    props: {
      value: stateDetail.bank_account_name,
      onChange: (e) => {
        const value = e.target.value;
        setDetail((prev) => ({ ...prev, bank_account_uuid: null, bank_account_name: value }));
      },
    },
  };

  const isNew = stateDetail.detail_id === null;

  const inputSelProps: TinputSelProps = isNew
    ? { selectProps: selectProps_forNew }
    : stateDetail.bank_account_uuid
    ? { selectProps: selectProps_forOld }
    : { inputProps: inputProps_forOld };

  return inputSelProps;
};
