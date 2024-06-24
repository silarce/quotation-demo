import { useMemo } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';

// ------------------------------------------------------------------------

type Tquery = {
  year: string;
  month: string;
  keyword: string;
};

// ------------------------------------------------------------------------

// MARK: START

export default function InvoiceBook() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
    keyword,
  } = query;

  // ------------------------------------------------------------------------
  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  const searchGroup: TsearchGroup = {
    searchTargetList: [
      {
        value: keyword,
        placeholder: '請輸入關鍵字',
        width: '200px',
      },
    ],
    doSearch: (arr) => {
      const keyword = arr[0] as string;
      router.replace({
        query: {
          ...query,
          keyword,
        },
      });
    },
  };

  const panelList = [{ searchGroup }];

  return (
    <SubLayer>
      <PageHeader02
        tag="開立發票管理"
        customeLeft={[<SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} />]}
        panelList={panelList}
      />

      <div></div>
    </SubLayer>
  );
}
