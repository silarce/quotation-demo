import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// css
import scss from './bonusStatisticsTable.module.scss';

// ========================================================================

type Tquery = {
  year: string | number;
  month: string | number;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// ========================================================================

const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });

// ========================================================================

export default function BonusStatisticsTable() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = new Date().getFullYear() - 1911,
    month,
  } = query;

  // --------------------------------------------------------------------
  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...query,
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
                ...query,
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
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics');
      },
    },
    {
      label: '獎金統計表',
      onClick: () => {},
      isActive: true,
    },
  ];

  // --------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} />
      <div>
        <SelectBar className="ml-5 mt-5 mb-5" selectPropsArr={selectPropsArr} />
      </div>
    </SubLayer>
  );
}
