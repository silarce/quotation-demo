import { useEffect, useMemo, Fragment } from 'react';

import classNames from 'classnames';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import scss from './annualPerformanceStatistics.module.scss';

// api
import { useQuotationAccounting_years } from 'js/api/api_quotation';

export default function AnnualPerformanceStatistics() {
  // const fakeData: Tfoo = {};
  // const companyKeyArr = Object.keys(fakeData);

  const { data, update } = useQuotationAccounting_years();

  useEffect(() => {
    update();
  }, []);

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    const list: Partial<Tlist> = {};
    data.forEach((data) => {
      const { totalsum, company_location } = data;
      const year = data.year.toString();
      const month = data.month.toString() as (typeof monthArr)[number];

      if (list[company_location] === undefined) {
        list[company_location] = {};
      }

      if (list[company_location]![year] === undefined) {
        list[company_location]![year] = {} as Tlist[string][string];
        list[company_location]![year].year = `${year} 年度`;
      }

      list[company_location]![year].companyName = companyNameLookup[company_location] ?? '查無分公司';

      list[company_location]![year][month] = totalsum;

      // 統計表給的不一定齊全，可能沒有12月，而且12月在陣列中也不見得會在1月後面
      // 所以這個部份不能用
      // if (month === '12') {
      //   let inTotal = 0;
      //   monthArr.forEach((month) => {
      //     const totalSum = Number(list[company_location]![year][month]);
      //     inTotal += totalSum;
      //     list[company_location]![year][month] = totalSum.toLocaleString();
      //   });
      //   list[company_location]![year].inTotal = inTotal.toLocaleString();
      //   list[company_location]![year].成長率 = '成長率';
      // }
    });

    Object.values(list).forEach((item_c) => {
      if (!item_c) {
        return;
      }

      Object.values(item_c).forEach((item_y) => {
        let inTotal = 0;

        const keyArr = Object.keys(item_y) as (keyof typeof item_y)[];
        keyArr.forEach((key) => {
          if (Number(key) >= 1) {
            const value_num = Number(item_y[key]);
            inTotal += value_num;
            item_y[key] = value_num.toLocaleString();
          }
        });
        item_y.inTotal = inTotal.toLocaleString();
        item_y.成長率 = '成長率';
      });
    });

    return list as Tlist;
  }, [data]);

  // --------------------------------------------------------------------
  const panelList: TpanelList = [
    // {
    //   searchGroup: {
    //     searchTargetList: [
    //       {
    //         placeholder: '輸入搜尋內容',
    //       },
    //     ],
    //     doSearch: (v) => {
    //       console.log(v);
    //     },
    //   },
    // },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="年度業績統計表" panelList={panelList} />

      <div className={scss.wrapper}>
        <div className={scss.table}>
          {/*  */}
          <div className={scss.left}>
            <div className={scss.corner}></div>
            {leftStrArr.map((key, index, arr) => {
              const isLast = index === arr.length - 1;

              return (
                <div key={index} className={classNames(isLast && scss.noBottom)}>
                  <span>{key}</span>
                </div>
              );
            })}
          </div>
          {/*  */}

          {Object.values(list).map((item_c, index_c, arr_c) => {
            const arr = Object.values(item_c);

            const isLastC = index_c === arr_c.length - 1;

            return (
              <div key={index_c} className={scss.main}>
                {arr.map((item, index, arr) => {
                  const { companyName, year, inTotal, 成長率 } = item;

                  const span = arr.length;

                  const isLastColumn = index === arr.length - 1 && isLastC;

                  return (
                    <Fragment key={index}>
                      {index === 0 && (
                        <div
                          className={classNames(scss.companyName, isLastC && scss.noRight)}
                          style={{ gridColumn: `span ${span}` }}
                        >
                          <span>{companyName}</span>
                        </div>
                      )}
                      <div className={classNames(scss.year, isLastColumn && scss.noRight)}>
                        <span>{year}</span>
                      </div>
                      {monthArr.map((month, index_m) => {
                        const value = item[month];

                        return (
                          <div key={index_m} className={classNames(isLastColumn && scss.noRight)}>
                            <span>{value}</span>
                          </div>
                        );
                      })}

                      <div className={classNames(isLastColumn && scss.noRight)}>
                        <span>{inTotal}</span>
                      </div>
                      <div className={classNames(scss.noBottom, isLastColumn && scss.noRight)}>
                        <span>{成長率}</span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            );
          })}

          {/*  */}
        </div>
      </div>
    </SubLayer>
  );
}

// ===============================================================

// 會收到的資料結構

type Tlist = {
  // 這一層是company_location
  [key: string]: {
    // 這一層是year
    [key: string]: {
      companyName: string;
      year: string; // totalSum
      '1': string; // totalSum
      '2': string; // totalSum
      '3': string; // totalSum
      '4': string; // totalSum
      '5': string; // totalSum
      '6': string; // totalSum
      '7': string; // totalSum
      '8': string; // totalSum
      '9': string; // totalSum
      '10': string; // totalSum
      '11': string; // totalSum
      '12': string; // totalSum
      inTotal: string; // 總合計
      成長率: string;
    };
  };
};

const leftStrArr = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
  '總計',
  '成長率',
];

const monthArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;

type TcompanyNameLookup = {
  [key: string]: string | undefined;
};

const companyNameLookup: TcompanyNameLookup = {
  Taichung: '台中分公司',
  Taipei: '台北分公司',
};

// ===============================================================
