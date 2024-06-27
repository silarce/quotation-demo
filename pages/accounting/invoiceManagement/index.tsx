import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';

// css
import scss from './index.module.scss';

// =========================================================================

type Tquery = {
  year: string;
  month: string;
  keyword: string;
};

// =========================================================================

// region START

export default function InvoiceManagement() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
    keyword,
  } = query;

  // --------------------------------------------------------------------------

  // region PROPS

  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  const searchGroup: TsearchGroup = {
    searchTargetList: [
      {
        defaultValue: keyword,
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

  const penalList_disabled: TpanelList = [
    { searchGroup },
    // {
    //   type: 'myButton',
    //   label: '編輯',
    //   onClick: () => setDisabled(false),
    // },
  ];

  // const panelList_abled: TpanelList = [
  //   {
  //     type: 'redButton',
  //     label: '確認',
  //     onClick: handle_confirm,
  //   },
  //   {
  //     type: 'myButton',
  //     label: '新增',
  //     onClick: addNewBook,
  //   },
  //   {
  //     type: 'myButton',
  //     label: '取消',
  //     onClick: () => setDisabled(true),
  //   },
  // ];

  // const panelList = disabled ? penalList_disabled : panelList_abled;
  const panelList = penalList_disabled;

  // --------------------------------------------------------------------------
  // region RENDER

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

// =========================================================================
