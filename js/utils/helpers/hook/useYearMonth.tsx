import { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// gaer
import SelectBar, { TselectBarProps } from 'components/global/gear/select/selectBar/selectBar';

import type { Toption } from 'js/utils/options/options';
// ==========================================================================

interface Tquery {
  year?: string;
  month?: string;
}

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type TselectBarDateProps = Omit<TselectBarProps, 'selectPropsArr'> & {
  haveYear?: boolean;
  haveMonth?: boolean;
};

// ==========================================================================
const useYearMonth_options = ({
  emptyYearOption = false,
  emptyMonthOption = false,
}: {
  emptyYearOption?: boolean;
  emptyMonthOption?: boolean;
} = {}) => {
  const m_now = moment();
  const thisYear = m_now.year();
  const thisMonth = m_now.month() + 1;

  const yearOptionArr = useMemo(() => {
    const yearOptionArr = Array.from({ length: 20 }, (_, i) => {
      const year = thisYear - i;
      const year_tw = year - 1911;

      return { label: year_tw.toString(), value: year.toString() };
    });

    emptyYearOption && yearOptionArr.unshift({ label: '不拘', value: '' });

    return yearOptionArr;
  }, [thisYear, emptyYearOption]);

  const monthOptionArr = useMemo(() => {
    const monthOptionArr = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;

      return { label: month.toString(), value: month.toString() };
    });

    emptyMonthOption && monthOptionArr.unshift({ label: '不拘', value: '' });

    return monthOptionArr;
  }, [emptyMonthOption]);

  const thisYear_tw = thisYear - 1911;

  return {
    yearOptionArr,
    monthOptionArr,
    thisYear,
    thisYear_tw,
    thisMonth,
  };
};

// 配合SelectBar使用
const useYearMonth_selectBar_query = ({
  year,
  month,
  yearOptionArr,
  monthOptionArr,
}: {
  year?: string | number;
  month?: string | number;
  yearOptionArr?: Toption[];
  monthOptionArr?: Toption[];
}) => {
  const router = useRouter();
  const query = router.query as {
    year: string | undefined;
    month: string | undefined;
  };

  const selectPropsArr: TselectPropsArr = useMemo(() => {
    const value_year = yearOptionArr?.find((option) => String(option.value) === String(year)) || year;

    const selectProps_year: TselectPropsArr[number] = {
      selectProps: {
        value: value_year,
        options: yearOptionArr ?? [],
        onChange: (option) => {
          const value = option?.value;

          if (value) {
            router.replace({
              query: {
                ...query,
                year: option.value,
              },
            });
          } else {
            router.replace({
              query: {
                ...query,
                year: undefined,
                month: undefined,
              },
            });
          }
        },
      },
      placeholder: '年份',
      boxStyle: { width: '140px' },
    };

    const selectProps_month: TselectPropsArr[number] = {
      selectProps: {
        value: month,
        options: monthOptionArr ?? [],

        onChange: (option) => {
          const value = option?.value;
          router.replace({
            query: {
              ...query,
              month: value,
            },
          });
        },
      },
      placeholder: '月份',
      boxStyle: { width: '140px' },
      disabled: !year,
    };

    const selectPropsArr: TselectPropsArr = [];

    yearOptionArr && selectPropsArr.push(selectProps_year);
    monthOptionArr && selectPropsArr.push(selectProps_month);

    return selectPropsArr;
  }, [year, yearOptionArr, month, monthOptionArr, router, query]);

  return selectPropsArr;
};

// ==========================================================================

// 這個元件取得、操縱Url的query
// 如果狀態不可以是Url的query，那就使用useYearMonth_options與SelectBar另外處理
const SelectBar_date = ({
  //
  haveYear = true,
  haveMonth = true,
  ...selectBarProps
}: TselectBarDateProps = {}) => {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();
  const router = useRouter();
  const { year = thisYear, month = thisMonth } = router.query as Tquery;

  const selectPropsArr = useYearMonth_selectBar_query({
    year: haveYear ? year : undefined,
    yearOptionArr: haveYear ? yearOptionArr : undefined,

    month: haveMonth ? month : undefined,
    monthOptionArr: haveMonth ? monthOptionArr : undefined,
  });

  return <SelectBar {...selectBarProps} selectPropsArr={selectPropsArr} />;
};

// ==========================================================================
export { SelectBar_date };
export { useYearMonth_options, useYearMonth_selectBar_query, SelectBar };
export type { TselectPropsArr };
