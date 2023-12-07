import { Tdata } from 'pages/domestic/quoteStatistics';
import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from './quoteStatistics.module.scss';

// ==================================================================

type Tcontrol_row = {
  idNumber: string;
  designDepartment: string;
  constructionName: string;
  subRowArr: {
    customerName: string;
    contactPerson: string;
    contactPhone: string;
    groupList: {
      [key: string]:
        | {
            listPrice: string;
            bearPrice: string;
            percent: string;
          }
        | undefined;
    };
  }[];
};

type TcontrolTotalList = {
  [key: string]: {
    listPrice: string;
    bearPrice: string;
    percent: string;
  };
};

type Tcontrol = {
  rowArr: Tcontrol_row[];
  groupListKeyArr: string[];
  totalList: TcontrolTotalList;
};

export type { Tcontrol as Tcontrol_quoteStatistics, Tcontrol_row, TcontrolTotalList };

// ==================================================================
export default function Table({ control }: { control: Tcontrol }) {
  const { rowArr, totalList, groupListKeyArr } = control;

  return (
    <div className={classNames(scss.table)}>
      <Thead groupListKeyArr={groupListKeyArr} />
      {/* <Tbody dataArr={dataArr} /> */}
      <Tbody rowArr={rowArr} groupListKeyArr={groupListKeyArr} />
      <Tfoot totalList={totalList} groupListKeyArr={groupListKeyArr} />
    </div>
  );
}

// =======================================================================
// =======================================================================
// =======================================================================

const Thead = ({ groupListKeyArr }: { groupListKeyArr: string[] }) => {
  return (
    <div className={classNames(scss.row, scss.thead)}>
      {/*  */}
      <div className={classNames(scss.group, scss.group01)}>
        {group01Keys.map((key, index) => {
          let label;

          if (index === 0) {
            label = '工程資訊';
          }

          const width = colConfig[key].width;

          return (
            <div key={index} style={{ width }}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {/*  */}
      <div className={classNames(scss.group, scss.group02)}>
        {group02Keys.map((key, index) => {
          let label;

          if (index === 0) {
            label = '客戶資訊';
          }

          const width = colConfig[key].width;

          return (
            <div key={index} style={{ width }}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {/*  */}

      {groupListKeyArr.map((key, index) => {
        return (
          <div key={index} className={classNames(scss.group, scss.group03)}>
            <div>
              <span>{key}</span>
            </div>
            {group03Keys.map((key, index) => {
              const { width, headLabel } = colConfig[key];

              return (
                <div key={index} style={{ width }}>
                  <span>{headLabel}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// =======================================================================
const Tbody = ({
  //
  rowArr,
  groupListKeyArr,
}: {
  rowArr: Tcontrol_row[];
  groupListKeyArr: string[];
}) => {
  return (
    <div className={scss.tbody}>
      {rowArr.map((row, index) => {
        return (
          <CellWithBar key={index}>
            <div className={scss.row}>
              <div className={classNames(scss.group, scss.group01)}>
                {group01Keys.map((key, index) => {
                  const { label, width } = colConfig[key];
                  const value = row[key];

                  return <Info key={index} label={label} value={value} width={width} />;
                })}
              </div>
              {/*  */}
              <div className={classNames(scss.group, scss.group02)}>
                {row.subRowArr.map((subRow, index) => {
                  return (
                    <div key={index}>
                      {group02Keys.map((key, index) => {
                        const { label, width } = colConfig[key];
                        const value = subRow[key];

                        return <Info key={index} label={label} value={value} width={width} />;
                      })}
                    </div>
                  );
                })}
              </div>
              {/*  */}

              {row.subRowArr.map((subRow, subRowIndex) => {
                const groupList = subRow.groupList;

                return (
                  <div key={subRowIndex} className={scss.subRow}>
                    {groupListKeyArr.map((glKey, glIndex) => {
                      const list = groupList[glKey];
                      // console.log(glKey);
                      // console.log(list);

                      return (
                        <div key={glIndex} className={classNames(scss.group, scss.group03)}>
                          {group03Keys.map((key, index) => {
                            const { width } = colConfig[key];
                            const value = list?.[key] ?? '';

                            return (
                              <div key={index} style={{ width }}>
                                <span>{value}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
};

// =======================================================================
// =======================================================================
// =======================================================================

const Tfoot = ({ totalList, groupListKeyArr }: { totalList: TcontrolTotalList; groupListKeyArr: string[] }) => {
  return (
    <div className={classNames(scss.row, scss.tfoot)}>
      <div className={classNames(scss.group, scss.group01)}>
        <div className={scss.total}>
          <div>
            <span>總計</span>
          </div>
          <div>
            <span>小計</span>
          </div>
        </div>
      </div>

      {groupListKeyArr.map((key, index) => {
        const group = totalList[key];

        return (
          <div key={index} className={classNames(scss.group, scss.group03)}>
            {group03Keys.map((key, index) => {
              const { label, width } = colConfig[key];
              const value = group[key];

              return (
                <div key={index} style={{ width }}>
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// =======================================================================
const Info = ({
  label,
  value,
  width,
}: {
  label: string | undefined;
  value: string | undefined;
  width: React.CSSProperties['width'];
}) => {
  return (
    <div className={scss.info} style={{ width }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
};

// =======================================================================
// =======================================================================

type TconfigKey = Exclude<keyof Tdata | keyof Tdata['customer'][number], 'customer'>;

type Tconfig = {
  [key in TconfigKey]: {
    label?: string;
    headLabel?: string;
    width: Exclude<React.CSSProperties['width'], undefined>;
    color?: 'black' | 'colorMain';
  };
};

const group01Keys: Extract<TconfigKey, 'idNumber' | 'designDepartment' | 'constructionName'>[] = [
  'idNumber',
  'designDepartment',
  'constructionName',
];

const group02Keys: Extract<TconfigKey, 'customerName' | 'contactPerson' | 'contactPhone'>[] = [
  'customerName',
  'contactPerson',
  'contactPhone',
];

const group03Keys: Extract<TconfigKey, 'listPrice' | 'bearPrice' | 'percent'>[] = ['listPrice', 'bearPrice', 'percent'];

const colConfig: Tconfig = {
  idNumber: {
    label: '編號',
    width: '110px',
    color: 'black',
  },
  designDepartment: {
    label: '設計單位',
    width: '100px',
    color: 'black',
  },
  constructionName: {
    label: '工程名稱',
    width: 'auto',
    color: 'black',
  },
  customerName: {
    label: '客戶',
    width: '110px',
    color: 'black',
  },
  contactPerson: {
    label: '聯絡人',
    width: '90px',
    color: 'black',
  },
  contactPhone: {
    label: '聯絡電話',
    width: '105px',
    color: 'black',
  },
  listPrice: {
    label: undefined,
    headLabel: '牌價',
    width: '138px',
    color: 'black',
  },
  bearPrice: {
    label: undefined,
    headLabel: '承價',
    width: '138px',
    color: 'black',
  },
  percent: {
    label: undefined,
    headLabel: '百分比',
    width: '138px',
    color: 'black',
  },
};
