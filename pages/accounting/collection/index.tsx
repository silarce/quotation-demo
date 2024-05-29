import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
// import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01 from 'components/global/gear/table/table01';

// type
import type { Toption } from 'js/utils/options/options';

// =============================================================================

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tcategory = '匯款' | '票據' | '現金';

type Tquery = {
  category: Tcategory | undefined;
  year: string | undefined;
  month: string | undefined;
};

// =============================================================================

const defaultCategory: Tcategory = '匯款';

// =============================================================================

// region START
export default function Collection() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  // ------------------------------------------------------------------------------

  const router = useRouter();
  const query = router.query as Tquery;
  const { category = defaultCategory, year = String(thisYear), month = String(thisMonth) } = query;
  const year_tw = Number(year) - 1911;

  // ------------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);

  // ----------------------------------------------------------------------------
  // region USE HOOK
  const tagList = useTagList();

  const selectPropsArr = useSelectPropsArr({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  // ----------------------------------------------------------------------------

  // region PROPS

  const panelList = create_panelList({
    disabled,
    setDisabled,
  });

  // ----------------------------------------------------------------------------
  // region RENDER
  return (
    <SubLayer>
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
        panelList={panelList}
      />
      <div>
        {/*  */}
        <div>
          <span>{category}</span>
        </div>

        <div></div>

        {/*  */}
      </div>
    </SubLayer>
  );
}
// region END

// =============================================================================
// =============================================================================
// =============================================================================

// region HOOK

const useTagList = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { category = defaultCategory } = query;

  const switchCategory = (category: Tcategory) => {
    router.replace({
      query: {
        ...query,
        category: category,
      },
    });
  };

  const tagList: TtagList = [
    {
      label: '匯款',
      isActive: category === '匯款',
      onClick: () => switchCategory('匯款'),
    },
    {
      label: '票據',
      isActive: category === '票據',
      onClick: () => switchCategory('票據'),
    },
    {
      label: '現金',
      isActive: category === '現金',
      onClick: () => switchCategory('現金'),
    },
  ];

  return tagList;
};

// -------------------------------------------------------------------------------
const useYearMonth = () => {
  const m_today = moment();
  const thisYear = m_today.year();
  const thisMonth = m_today.month() + 1;

  const yearOptionArr = useMemo(() => {
    const yearOptionArr = Array.from({ length: 20 }, (_, i) => {
      const year = thisYear - i;
      const year_tw = year - 1911;

      return { label: year_tw.toString(), value: year.toString() };
    });

    return yearOptionArr;
  }, [thisYear]);

  const monthOptionArr = useMemo(() => {
    const monthOptionArr = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;

      return { label: month.toString(), value: month.toString() };
    });

    return monthOptionArr;
  }, []);

  return {
    yearOptionArr,
    monthOptionArr,
    thisYear,
    thisMonth,
  };
};

const useSelectPropsArr = ({
  year,
  month,
  yearOptionArr,
  monthOptionArr,
}: {
  year: string;
  month: string;
  yearOptionArr: Toption[];
  monthOptionArr: Toption[];
}) => {
  const router = useRouter();
  const query = router.query as Tquery;

  const selectPropsArr: TselectPropsArr = useMemo(() => {
    return [
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
  }, [year, yearOptionArr, month, monthOptionArr, router, query]);

  return selectPropsArr;
};

// ---------------------------------------------------------------------------

// region function

const create_panelList = ({
  //
  disabled,
  setDisabled,
}: {
  disabled: boolean;
  setDisabled: (value: boolean) => void;
}) => {
  const panelList_disable: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => setDisabled(false),
    },
  ];

  const panelList_able: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled(true),
    },
  ];

  const panelList = disabled ? panelList_disable : panelList_able;

  return panelList;
};

// =========================================================================
// region component
