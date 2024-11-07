import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
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
import ReviewFlowSelector, { apiAddReivew, reqSentReviewStop } from 'components/composition/review/reviewFlowSelecor';
// import { useReviewFlow } from 'components/composition/review/reviewFlow';
import { useReviewFlow } from 'components/composition/review/reviewFlow_2';

// icon
import {
  IconDelete01,
  IconRemoveCircle,
  IconRemove02,
  IconAdd,
  IconAddCircle,
} from 'public/image/icon/svgComponent/svgIcons';

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
import { useGetReivewById } from 'js/api/api_netCore/api_review';

//
import type { Toption } from 'js/utils/options/options';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import scss from './statistics.module.scss';

import type { TuserDto } from 'js/api/dtoTypes';

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
export default function Statistics({ userInfo }: { userInfo: TuserDto }) {
  const userId = userInfo.employee?.id;

  const router = useRouter();
  const query = router.query as Tquery;
  const { year, month } = query as Tquery;

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

  const { raw: raw_statisticsDetailArr, update: update_statisticsDetailArr } =
    useGetAccountPayableStatisticsDetailByStatisticsId(raw_statistics?.id);

  const { rawData_bankAccount, update_bankAccount } = useGetBankAccount();

  const {
    ReviewFlow,
    reviewFlow,
    update: update_reviewFlow,
  } = useReviewFlow({
    uuid: raw_statistics?.id,
  });

  console.log(reviewFlow);

  // -------------------------------------------------------------------------

  const { state, addDetail, deleteDetail, createSetDetail } = useDetail({
    disabled,
    detailArr: raw_statisticsDetailArr,
  });

  // -------------------------------------------------------------------------

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

              const body: Parameters<typeof apiAddReivew>[0] = {
                review_id: reviewFlowId,
                document_id: raw_statistics.date,
                document_uuid: raw_statistics.id,
                document_type: '應付帳款統計表',
                user_id: userId,
                document_title: purpose,
                query: {
                  ...query,
                },
              };

              await apiAddReivew(body)
                .then(update_reviewFlow)
                .catch(() => {});

              destroy();
            },
          });
        }
      : null;

  const handleReviewStop =
    raw_statistics && reviewFlow
      ? () => {
          reqSentReviewStop({
            uuid: raw_statistics.id,
            onSuccess: update_reviewFlow,
          });
        }
      : null;

  // -------------------------------------------------------------------------

  const panelList = createPanelList({
    disabled,
    onDelete: handleDelete,
    onEdit: !reviewFlow ? () => setDisabled(false) : null,
    onSendReview: handleSendReview,
    onCancel: () => setDisabled(true),
    onConfirm: reqUpdateAccountPayableStatisticsById,
    onSendReivewStop: handleReviewStop,
  });

  // -------------------------------------------------------------------------

  useEffect(() => {
    update_bankAccount();
  }, []);

  // -------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="應付帳款統計表" panelList={panelList} />

      <div className={scss.body}>
        <div className={scss.accountPayable}>
          <Row_thead className={scss.thead} disabled={true} noCheck={true} />
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
            <span>合計</span>
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
  onCancel,
  onConfirm,
  onSendReview,
  onSendReivewStop,
}: {
  disabled: boolean;
  onDelete: undefined | null | (() => void);
  onEdit: undefined | null | (() => void);
  onCancel: () => void;
  onConfirm: () => void;
  onSendReview: undefined | null | (() => void);
  onSendReivewStop: undefined | null | (() => void);
}) => {
  const panelList_disabled: TpanelList = [
    onDelete && {
      type: 'redButton',
      label: '刪除統計表',
      onClick: onDelete,
    },
    onEdit && {
      type: 'myButton',
      label: '編輯',
      onClick: onEdit,
    },
    onSendReview && {
      type: 'myButton',
      label: '送審',
      onClick: onSendReview,
    },
    onSendReivewStop && {
      type: 'myButton',
      label: '抽單',
      onClick: onSendReivewStop,
    },
  ];
  const panelList_abled: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: onCancel,
    },
    {
      type: 'redButton',
      label: '上傳',
      onClick: onConfirm,
    },
  ];

  return disabled ? panelList_disabled : panelList_abled;
};

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
