import { useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';
import classNames from 'classnames';

import { useRouter } from 'next/router';
// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// css
import scss from './regionalPerformanceStatistics.module.scss';

// api
import { useQuotationAccounting_area, TquotationAccouting_area } from 'js/api/api_quotation';

// ==================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  year: string | undefined;
  month: string | undefined;

  keyWord: string | undefined;
};

// ==================================================================
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const yearOptionArr = optionsCreator_year();

// ==================================================================
export default function RegionalPerformanceStatistics() {
  const router = useRouter();
  const { year, month } = router.query as Tquery;

  const { data, update } = useQuotationAccounting_area({ year: Number(year), month: Number(month) });

  useEffect(() => {
    if (!year || !month) {
      const yearNum = new Date().getFullYear();
      const monthNum = new Date().getMonth() + 1;

      router.push({
        query: {
          year: yearNum,
          month: monthNum,
        },
      });

      return;
    }

    update();
  }, [year, month]);

  const { formatedList, quotetypeArr } = useMemo(() => {
    if (!data) {
      return {};
    }

    const list: Tdata = {};
    const countList: TcountList = {};
    const quotetypeList: { [key: string]: string } = {};

    data.forEach((item) => {
      const { quotetype, year, month, county, totalsum, pricesum, percentage } = item;

      quotetypeList[quotetype] = quotetype;

      if (!list[county]) {
        list[county] = {};
        countList[county] = {};
      }

      if (!list[county][quotetype]) {
        list[county][quotetype] = {
          totalsum: totalsum,
          pricesum: pricesum,
          percentage: String(percentage),
        };
        countList[county][quotetype] = {
          count: 1,
        };
      } else {
        list[county][quotetype].totalsum = String(Number(list[county][quotetype].totalsum) + Number(totalsum));
        list[county][quotetype].pricesum = String(Number(list[county][quotetype].pricesum) + Number(pricesum));
        list[county][quotetype].percentage = String(Number(list[county][quotetype].percentage) + percentage);
        countList[county][quotetype].count += 1;
      }
    });
    //
    //
    // Object.values(list).forEach((item_c) => {
    Object.keys(list).forEach((key_c) => {
      const item_c = list[key_c];

      let totalsumTotal = 0;
      let pricesumTotal = 0;
      let percentageTotal = 0;

      Object.keys(item_c).forEach((key_q) => {
        const item_q = item_c[key_q];
        const count = countList[key_c][key_q].count;
        //
        totalsumTotal += Number(item_q.totalsum);
        pricesumTotal += Number(item_q.pricesum);
        //
        item_q.totalsum = Number(item_q.totalsum).toLocaleString();
        item_q.pricesum = Number(item_q.pricesum).toLocaleString();
        //
        item_q.percentage = new Decimal(item_q.percentage).div(count).toString();
        percentageTotal += Number(item_q.percentage);
      });

      const length = Object.keys(item_c).length;
      const percentageAve = new Decimal(percentageTotal).div(length).toNumber();

      item_c['total'] = {
        totalsum: totalsumTotal.toLocaleString(),
        pricesum: pricesumTotal.toLocaleString(),
        percentage: String(percentageAve),
      };

      item_c['remark'] = {
        totalsum: '',
        pricesum: '',
        percentage: '',
      };
    });

    quotetypeList.total = 'total';
    quotetypeList.remark = 'remark';

    const quotetypeArr = Object.keys(quotetypeList);

    return { formatedList: list, quotetypeArr };
  }, [data]);

  // ------------------------------------------------------------------

  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.push({
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
            router.push({
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

  const customeLeft = [<SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />];

  const panelList: TpanelList = [
    {
      searchGroup: {
        searchTargetList: [
          {
            placeholder: '輸入搜尋內容',
          },
        ],
        doSearch: (v) => {
          console.log(v);
        },
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="全區業績統計表" customeLeft={customeLeft} panelList={panelList} />

      <div className={scss.wrapper}>
        <div className={scss.table}>
          <div className={scss.thead}>
            <div></div>
            {/*  */}
            {quotetypeArr?.map((quotetype, index) => {
              if (quotetype === 'total') {
                quotetype = '合計';
              }

              if (quotetype === 'remark') {
                quotetype = '備註';
              }

              return (
                <div key={index}>
                  <span>{quotetype}</span>
                </div>
              );
            })}
            {/*  */}
          </div>
          <div className={scss.tbody}>
            {Object.keys(formatedList ?? {}).map((key, index) => {
              if (!formatedList?.[key]) {
                return null;
              }

              const item = formatedList[key];

              return (
                <div key={index} className={scss.row}>
                  <div>
                    <div className={classNames(scss.noBottom, scss.plus)}>
                      <span>{key}</span>
                    </div>
                    <div>
                      <span>承包價</span>
                    </div>
                    <div>
                      <span>牌價</span>
                    </div>
                    <div className={classNames(scss.noBottom, scss.plus)}>
                      <span>{key}百分比</span>
                    </div>
                  </div>
                  {/*  */}

                  {quotetypeArr.map((key, index_q) => {
                    const item_q = item[key];

                    const { totalsum, pricesum, percentage } = item_q ?? {};

                    return (
                      <div key={index_q}>
                        <div>
                          <span>{totalsum}</span>
                        </div>
                        <div>
                          <span>{pricesum}</span>
                        </div>
                        <div className={classNames(scss.noBottom, scss.plus)}>
                          <span>{percentage}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/*  */}
                </div>
              );
            })}
          </div>
          {/* table close */}
        </div>
      </div>
    </SubLayer>
  );
}

// ==================================================================

type Tdata = {
  /**地區 */
  [key: string]: {
    /**門型 追加 合計 */
    [key: string]: {
      totalsum: string; // 牌價複價
      pricesum: string; // 單價複價
      percentage: string; // 百分比
    };
  };
};

type TcountList = {
  /**地區 */
  [key: string]: {
    /**門型 追加  */
    [key: string]: {
      count: number;
    };
  };
};

// const fakeData: TquotationAccouting_area[] = [
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 1,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 2,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 3,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 4,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 5,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 6,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 7,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 8,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 9,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 10,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 11,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 12,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   //
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 1,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 2,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 3,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 4,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 5,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 6,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 7,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 8,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 9,
//     county: '高雄市',
//     totalsum: '50',
//     pricesum: '50',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 10,
//     county: '高雄市',
//     totalsum: '50',
//     pricesum: '50',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 11,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 12,
//     county: '高雄市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   // ----------------------------------------------------------------
//   // ----------------------------------------------------------------
//   // ----------------------------------------------------------------
//   // ----------------------------------------------------------------
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 1,
//     county: '臺北市',
//     totalsum: '50',
//     pricesum: '50',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 2,
//     county: '臺北市',
//     totalsum: '50',
//     pricesum: '50',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 3,
//     county: '臺北市',
//     totalsum: '50',
//     pricesum: '50',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 4,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 5,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 6,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 7,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 8,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 9,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 10,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 11,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '捲門',
//     year: 2022,
//     month: 12,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   //
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 1,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 2,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 3,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 4,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 5,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 6,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 7,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 8,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 9,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 10,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 11,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '水閘門',
//     year: 2022,
//     month: 12,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   //
//   {
//     quotetype: '特殊大門',
//     year: 2022,
//     month: 11,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   {
//     quotetype: '特殊大門',
//     year: 2022,
//     month: 12,
//     county: '臺北市',
//     totalsum: '100',
//     pricesum: '100',
//     percentage: 999,
//   },
//   //
// ];
