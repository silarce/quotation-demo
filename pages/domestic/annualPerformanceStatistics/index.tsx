import { useMemo, Fragment } from 'react';

import classNames from 'classnames';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import scss from './annualPerformanceStatistics.module.scss';

export default function AnnualPerformanceStatistics() {
  // const fakeData: Tfoo = {};
  // const companyKeyArr = Object.keys(fakeData);

  const list = useMemo(() => {
    const list: Partial<Tlist> = {};
    fakeDataArr.forEach((data) => {
      const { year, month, totalSum, company_location } = data;

      if (list[company_location] === undefined) {
        list[company_location] = {};
      }

      if (list[company_location]![year] === undefined) {
        list[company_location]![year] = {} as Tlist[string][string];
        list[company_location]![year].year = `${year} 年度`;
      }

      list[company_location]![year].companyName = companyNameLookup[company_location] ?? '查無分公司';

      list[company_location]![year][`${month}`] = totalSum;

      if (month === 12) {
        let inTotal = 0;
        monthArr.forEach((month) => {
          const totalSum = Number(list[company_location]![year][month]);
          inTotal += totalSum;
          list[company_location]![year][month] = totalSum.toLocaleString();
        });
        list[company_location]![year].inTotal = inTotal.toLocaleString();
        list[company_location]![year].成長率 = '成長率';
      }
    });

    return list as Tlist;
  }, []);

  // --------------------------------------------------------------------
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
type Tdata = {
  year: number;
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  totalSum: string;
  company_location: string;
};

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

const fakeDataArr: Tdata[] = [
  {
    year: 2023,
    month: 1,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 2,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 3,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 4,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 5,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 6,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 7,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 8,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 9,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 10,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 11,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2023,
    month: 12,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 1,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 2,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 3,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 4,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 5,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 6,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 7,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 8,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 9,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 10,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 11,
    totalSum: '100',
    company_location: 'Taipei',
  },
  {
    year: 2022,
    month: 12,
    totalSum: '100',
    company_location: 'Taipei',
  },
  //
  {
    year: 2023,
    month: 1,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 2,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 3,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 4,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 5,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 6,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 7,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 8,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 9,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 10,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 11,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2023,
    month: 12,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 1,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 2,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 3,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 4,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 5,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 6,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 7,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 8,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 9,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 10,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 11,
    totalSum: '100',
    company_location: 'Taichung',
  },
  {
    year: 2022,
    month: 12,
    totalSum: '100',
    company_location: 'Taichung',
  },
];
