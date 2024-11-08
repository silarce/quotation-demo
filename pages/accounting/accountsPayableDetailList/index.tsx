import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
// import SearchSwitch from 'components/page/accounting/accountsPayableDetailList/index/SearchSwitch';
import {
  Row_thead,
  Row_tbody,
  createValueProps,
} from 'components/page/accounting/accountsPayableDetailList/index/Table';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';

import {
  Taccount_payable_Dto,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  apiPostAddAccountPayableStatistics,
} from 'js/api/api_netCore/api_accountant';

import { useTranslation } from 'react-i18next';

// ================================================================================
type Tquery = {
  year?: string;
  month?: string;
};

type TcheckedRaw = {
  [id: string]: Taccount_payable_Dto;
};

// ================================================================================

// MARK: START
export default function AccountsPayableDetailList() {
  const { t } = useTranslation('accounting', { keyPrefix: 'accountsPayableDetailList' });

  const router = useRouter();
  const query = router.query as Tquery;

  const {
    yearOptionArr,
    monthOptionArr,

    thisYear,
    thisMonth,
  } = useYearMonth_options();
  const {
    //
    year = String(thisYear),
    month = String(thisMonth),
  } = query;

  const [disabled, setDisabled] = useState(true);

  // ----------------------------------------------------------------
  // MARK: DATA

  const params = useMemo(() => {
    let params: Parameters<typeof useGetAccountPayableBy>[0] = undefined;

    params = {
      dateForUnpaid: {
        date: `${year}-${month}`,
      },
    };

    return params;
  }, [year, month]);

  const { raw: raw_accountPayable, update: update_accountPayable } = useGetAccountPayableBy(params, {
    autoUpdate: true,
  });

  const { raw: raw_AccountPayableStatistics, update: update_AccountPayableStatistics } =
    useGetAccountPayableStatisticsByIdOrDate({
      date: `${year}-${month}`,
    });

  const haveAccountPayableStatistics = !!raw_AccountPayableStatistics?.length;

  // ----------------------------------------------------------------
  // MARK: STATE

  const [checkedRaw, setCheckedRaw] = useState<TcheckedRaw>({});

  const isAllChecked = useMemo(() => {
    let checked = Object.keys(checkedRaw).length === raw_accountPayable?.length;

    if (checked) {
      checked = !!raw_accountPayable?.every((raw) => !!checkedRaw[raw.id]);
    }

    return checked;
  }, [checkedRaw, raw_accountPayable]);

  // ----------------------------------------------------------------
  // MARK: API

  const reqPostAddAccountPayableStatistics = async () => {
    const date = moment(`${year}-${month}`).format('YYYY-MM-DD');
    const note = '';
    const account_payable_uuids = Object.keys(checkedRaw);

    if (account_payable_uuids.length === 0) {
      myAlert.info({ title: '請選擇應付帳款' });
    }

    return await apiPostAddAccountPayableStatistics({
      date,
      note,
      account_payable_uuids,
    });
  };

  // ----------------------------------------------------------------
  // MARK: HANDLE

  const handleAddAccountPayableStatistics = async () => {
    await reqPostAddAccountPayableStatistics().then(async () => {
      await Promise.all([update_accountPayable(), update_AccountPayableStatistics()]);

      setDisabled(true);
    });
  };

  const handleStatisticsClick = !haveAccountPayableStatistics
    ? null
    : () => {
        router.push({
          pathname: '/accounting/accountsPayableDetailList/statistics',
          query: {
            year,
            month,
          },
        });
      };

  const handleCheckAndGenerate = haveAccountPayableStatistics
    ? null
    : () => {
        setDisabled(false);
      };

  const handleCheckAllChange = (checked: boolean) => {
    if (checked) {
      const rawDict: TcheckedRaw = {};
      raw_accountPayable?.forEach((raw) => {
        rawDict[raw.id] = raw;
      });

      setCheckedRaw(rawDict);
    } else {
      setCheckedRaw({});
    }
  };

  const handleCheck = (checked: boolean, id: string, raw: Taccount_payable_Dto) => {
    setCheckedRaw((prev) => {
      let copy = { ...prev };

      if (checked) {
        copy[id] = raw;
      } else {
        const { [id]: removed, ...restCopy } = copy;
        copy = restCopy;
      }

      return copy;
    });
  };

  // ----------------------------------------------------------------
  // MARK: useEffect
  useEffect(() => {
    if (!query.year || !query.month) {
      router.replace({
        query: {
          ...query,
          year: thisYear.toString(),
          month: thisMonth.toString(),
        },
      });
    }
  }, []);

  useEffect(() => {
    setCheckedRaw({});
  }, [raw_accountPayable, disabled]);

  // ----------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag={t('accountsPayableDetailTable')}
        customeLeft={[
          <SelectBar
            key="DateSelector"
            className="ml-2"
            selectPropsArr={useYearMonth_selectBar_query({
              year: year,
              month: month,
              yearOptionArr,
              monthOptionArr,
            })}
          />,
        ]}
        // customeLeft={[<SearchSwitch className="ml-2" key="0" />]}
        panelList={usePanel({
          //
          disabled,
          setDisabled,
          onAddClick: handleAddAccountPayableStatistics,
          onStatisticsClick: handleStatisticsClick,
          onCheckAndGenerateClick: handleCheckAndGenerate,
        })}
      />

      <div>
        <Spin spinning={false} delay={300}>
          <Row_thead disabled={disabled} checked={isAllChecked} onCheckChange={handleCheckAllChange} />

          {raw_accountPayable?.map((raw) => {
            const props: Parameters<typeof Row_tbody>[0] = {
              ...createValueProps(raw),
              disabled,
              checked: !!checkedRaw[raw.id],
              onCheck: (checked) => {
                handleCheck(checked, raw.id, raw);
              },
              onDetailClick: () => {
                router.push({
                  pathname: '/accounting/accountsPayableDetailList/detail',
                  query: {
                    invoiceNumber: raw.invoice_number,
                  },
                });
              },
            };

            return <Row_tbody key={raw.id} {...props} />;
          })}
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

// ==============================================================================

// MARK:createPanel

const usePanel = ({
  disabled,
  setDisabled,
  onAddClick,
  onStatisticsClick,
  onCheckAndGenerateClick,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick: () => void;
  onStatisticsClick: null | undefined | (() => void);
  onCheckAndGenerateClick: null | undefined | (() => void);
}) => {
  const { t } = useTranslation('accounting', { keyPrefix: 'accountsPayableDetailList' });
  const { t: t_common } = useTranslation('common');

  const panel1: TpanelList[number] = onCheckAndGenerateClick && {
    type: 'myButton',
    label: t('checkAndGenerate'),
    onClick: onCheckAndGenerateClick,
  };

  const panel2: TpanelList[number] = onStatisticsClick && {
    type: 'myButton',
    label: t('accountsPayableStatistics'),
    onClick: onStatisticsClick,
  };

  const panel3: TpanelList[number] = {
    type: 'myButton',
    label: t_common('cancel'),
    onClick: () => {
      setDisabled(true);
    },
  };

  const panel4: TpanelList[number] = {
    type: 'redButton',
    label: t_common('confirm'),
    onClick: onAddClick,
  };

  const panelList: TpanelList = disabled ? [panel1, panel2] : [panel3, panel4];

  return panelList;
};

// ==========================================================================
