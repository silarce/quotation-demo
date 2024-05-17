import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table, {
  Tcontrol_personalPerformanceStatistics,
  Tcontrol_row,
  Tcontrol_subTotalList,
  Tcontrol_total,
} from 'components/page/domestic/personalPerformanceStatistics/Table';

// gaer
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// api
import { useQuotationAccounting_personalContract, TquotationAccounting_personal_contract } from 'js/api/api_quotation';
import { useEmployee, Tparams } from 'js/api/api_employee';

// css
import scss from './index.module.scss';

// ==================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  emp: string | undefined;
  keyWord: string | undefined;
};

// ==================================================================
const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });

// ==================================================================

const empParams: Tparams = {
  pageSize: 99999,
  populate: ['jobs.department'],
  filter: {
    'jobs.department.name': { $eq: '業務部' },
  },
};

// ==================================================================
// 個人業績統計表
export default function PersonalPerformanceStatistics() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = new Date().getFullYear() - 1911,
    month,
    emp,
  } = query;

  // ------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------------------------

  const params = {
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
    employeeId: emp,
  };

  const { data, update } = useQuotationAccounting_personalContract(params);

  const toUpdateData = async () => {
    try {
      setIsLoading(true);
      await update();
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得報表失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    toUpdateData();
  }, [year, month, emp]);

  // ------------------------------------------------------------------

  const { data: data_emp, update: update_emp } = useEmployee(empParams);

  useEffect(() => {
    update_emp();
  }, []);

  const empOptionArr = useMemo(() => {
    if (!data_emp) {
      return [];
    }

    const empArr = data_emp.data;

    const optionArr = empArr.map((emp) => {
      return {
        label: emp.chName || emp.enName || '---',
        value: emp.id,
      };
    });

    return optionArr;
  }, [data_emp]);

  // ------------------------------------------------------------------

  const control_table = useControl_personalPerformanceStatistics(data);

  // ------------------------------------------------------------------
  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: emp,
        options: empOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...router.query,
                emp: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇員工',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...router.query,
                year: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇年份',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: month,
        options: monthOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...router.query,
                month: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇月份',
      boxStyle: { width: '140px' },
    },
  ];

  const tagList: TtagList = [
    {
      label: '個人業績統計表',
      isActive: true,
    },
    {
      label: '獎金統計表',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics/bonusStatisticsTable');
      },
    },
    {
      label: '獎金週期維護',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics/bonusPeriod');
      },
    },
  ];

  // const customeLeft = [<SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />];

  // ------------------------------------------------------------------

  // ██████  ███████ ██████  ██    ██  ██████ ███████ ██████
  // ██   ██ ██      ██   ██ ██    ██ ██      ██      ██   ██
  // ██████  █████   ██   ██ ██    ██ ██      █████   ██████
  // ██   ██ ██      ██   ██ ██    ██ ██      ██      ██   ██
  // ██   ██ ███████ ██████   ██████   ██████ ███████ ██   ██

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      <PageHeader02 tagList={tagList} />

      <div className="w-fit">
        <div className={scss.selectBarWrapper}>
          <SelectBar className={''} selectPropsArr={selectPropsArr} />
        </div>
        <Table control={control_table} />
      </div>
    </SubLayer>
  );
}

// ===========================================================

// ██   ██  ██████   ██████  ██   ██
// ██   ██ ██    ██ ██    ██ ██  ██
// ███████ ██    ██ ██    ██ █████
// ██   ██ ██    ██ ██    ██ ██  ██
// ██   ██  ██████   ██████  ██   ██

const useControl_personalPerformanceStatistics = (data: TquotationAccounting_personal_contract[] | undefined) => {
  const control: Tcontrol_personalPerformanceStatistics = useMemo(() => {
    if (!data) {
      return {
        rowArr: [],
        subTotalList: {},
        total: {
          totalsum: '',
          pricesum: '',
          percentage: '',
        },
        listKeyArr: [],
      };
    }

    const list: {
      [key: string]: // Tcontrol_row
      Omit<Tcontrol_row, 'total'> & { total: number };
    } = {};

    const subTotalList: {
      [key: string]: {
        totalsum: number;
        pricesum: number;
        percentage: number;
      };
    } = {};

    const total = {
      totalsum: 0,
      pricesum: 0,
      percentage: 0,
    };

    const listKeyQty: { [key: string]: number } = {};

    data.forEach((item) => {
      const {
        //
        projectname,
        quotationnumber,
        // quotetype,
        totalsum,
        pricesum,
        percentage,
      } = item;

      const isValid = typeof percentage === 'number';

      let quotetype = item.quotetype;

      if (!quotetype) {
        quotetype = '無資料';
      }

      if (!subTotalList[quotetype]) {
        subTotalList[quotetype] = {
          totalsum: 0,
          pricesum: 0,
          percentage: 0,
        };
      }

      if (listKeyQty[quotetype] === undefined) {
        listKeyQty[quotetype] = 0;
      }

      if (isValid) {
        listKeyQty[quotetype] = listKeyQty[quotetype] + 1;
        subTotalList[quotetype].totalsum = new Decimal(subTotalList[quotetype].totalsum).add(totalsum).toNumber();
        subTotalList[quotetype].pricesum = new Decimal(subTotalList[quotetype].pricesum).add(pricesum).toNumber();
        subTotalList[quotetype].percentage = new Decimal(subTotalList[quotetype].percentage)
          .add(percentage ?? 0)
          .toNumber();

        total.totalsum = new Decimal(total.totalsum).add(totalsum).toNumber();
        total.pricesum = new Decimal(total.pricesum).add(pricesum).toNumber();
        total.percentage = new Decimal(total.percentage).add(percentage ?? 0).toNumber();
      }

      if (!list[quotationnumber]) {
        list[quotationnumber] = {
          quotationNumber: quotationnumber,
          projectName: projectname,
          builder: '',
          designer: '',
          list: {},
          total: 0,
        };
      }

      // 格子裡的文字
      list[quotationnumber].list[quotetype] = {
        totalsum: isValid ? Number(totalsum).toLocaleString() : 'n/a',
        pricesum: isValid ? Number(pricesum).toLocaleString() : 'n/a',
        percentage: isValid ? `${percentage}%` : 'n/a',
      };

      if (isValid) {
        list[quotationnumber].total = new Decimal(list[quotationnumber].total).add(pricesum).toNumber();
      }
    });
    //
    //
    const control_rowArr: Tcontrol_row[] = Object.values(list).map((item) => {
      return {
        ...item,
        total: Number(item.total).toLocaleString(),
      };
    });

    const theSubTotalList: Tcontrol_subTotalList = {};

    Object.keys(subTotalList).forEach((key) => {
      // const percent = new Decimal(subTotalList[key].percentage).div(listKeyQty[key]).toNumber();

      const isValid = !!listKeyQty[key];

      if (isValid) {
        const percent = new Decimal(subTotalList[key].percentage).div(listKeyQty[key]).toDecimalPlaces(2).toNumber();

        theSubTotalList[key] = {
          ...subTotalList[key],
          totalsum: Number(subTotalList[key].totalsum).toLocaleString(),
          pricesum: Number(subTotalList[key].pricesum).toLocaleString(),
          percentage: `${percent}%`,
        };
      } else {
        theSubTotalList[key] = {
          ...subTotalList[key],
          totalsum: 'n/a',
          pricesum: 'n/a',
          percentage: `n/a`,
        };
      }
    });

    const validDataQty = data.filter((item) => typeof item.percentage === 'number').length;

    const theTotal = {
      totalsum: Number(total.totalsum).toLocaleString(),
      pricesum: Number(total.pricesum).toLocaleString(),
      percentage: `${new Decimal(total.percentage).div(validDataQty).toDecimalPlaces(2).toNumber()}%`,
    };

    const listKeyArr = Object.keys(listKeyQty);

    return {
      rowArr: control_rowArr,
      subTotalList: theSubTotalList,
      total: theTotal,
      listKeyArr,
    };

    //
    //
  }, [data]);

  return control;
};
