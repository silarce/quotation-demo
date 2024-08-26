import classNames from 'classnames';

// gear
// import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './table.module.scss';

// ==================================================================

type Tcontrol_row = {
  quotationNumber: string;
  projectName: string;
  builder: string;
  designer: string;
  list: {
    [key: string]:
      | {
          totalsum: string;
          pricesum: string;
          percentage: string;
        }
      | undefined;
  };
  total: string;
  employeeName: string;
};

type Tcontrol_total = {
  totalsum: string;
  pricesum: string;
  percentage: string;
};

type Tcontrol_subTotalList = {
  [key: string]: Tcontrol_total;
};

type Tcontrol = {
  rowArr: Tcontrol_row[];
  subTotalList: Tcontrol_subTotalList;
  total: Tcontrol_total;
  listKeyArr: string[];
  bounsCalcProcess: React.ReactNode;
};

export type { Tcontrol as Tcontrol_personalPerformanceStatistics, Tcontrol_row, Tcontrol_subTotalList, Tcontrol_total };

// ==================================================================

// region main
export default function Table({ control }: { control: Tcontrol }) {
  const {
    //
    rowArr,
    subTotalList,
    total,
    listKeyArr,
    bounsCalcProcess,
  } = control;

  return (
    <div className={classNames(scss.table)}>
      <Thead listKeyArr={listKeyArr} />
      <Tbody rowArr={rowArr} listKeyArr={listKeyArr} />
      {rowArr.length > 0 && (
        <Footer
          //
          subTotalList={subTotalList}
          total={total}
          listKeyArr={listKeyArr}
          bounsCalcProcess={bounsCalcProcess}
        />
      )}
    </div>
  );
}

// =======================================================================

// region component

const Thead = ({ listKeyArr }: { listKeyArr: string[] }) => {
  return (
    <div className={classNames(scss.row, scss.thead)}>
      <div className={scss.group01}>
        <span>工程資訊</span>
      </div>
      <div className={scss.builder}>
        <span>營造</span>
      </div>
      <div className={scss.designer}>
        <span>設計單位</span>
      </div>

      {listKeyArr.map((key, index) => {
        return (
          <div key={index} className={classNames(scss.group02)}>
            <div>
              <span>{key}</span>
            </div>

            <div>
              <span>牌價</span>
            </div>
            <div>
              <span>承價</span>
            </div>
            <div>
              <span>百分比</span>
            </div>
          </div>
        );
      })}

      <div className={scss.total}>
        <span>總價</span>
      </div>
    </div>
  );
};

const Tbody = ({ rowArr, listKeyArr }: { rowArr: Tcontrol_row[]; listKeyArr: string[] }) => {
  return (
    <div className={classNames(scss.tbody)}>
      {rowArr.map((row, index) => {
        const { quotationNumber, projectName, builder, designer, list, total } = row;

        return (
          <div key={index} className={classNames(scss.row)}>
            {/*  */}
            <div className={scss.group01}>
              <div className={scss.quotationNumber}>
                <span>編號</span>
                <span>{quotationNumber}</span>
              </div>
              <div className={scss.projectName}>
                <span>工程名稱</span>
                <span>{projectName}</span>
              </div>
              {/* <div>
                <span>業務</span>
                <span>{'開發中'}</span>
              </div> */}
            </div>
            {/*  */}
            <div className={scss.builder}>
              <span>{builder}</span>
            </div>
            <div className={scss.designer}>
              <span>{designer}</span>
            </div>
            {/*  */}
            {listKeyArr.map((key, index) => {
              const { totalsum, pricesum, percentage } = list[key] ?? {};

              return (
                <div key={index} className={classNames(scss.group02)}>
                  <div>
                    <span>{totalsum}</span>
                  </div>
                  <div>
                    <span>{pricesum}</span>
                  </div>
                  <div>
                    <span>{percentage}</span>
                  </div>
                </div>
              );
            })}

            {/*  */}
            <div className={scss.total}>
              <span>{total}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Footer = ({
  subTotalList,
  total,
  listKeyArr,
  bounsCalcProcess,
}: {
  subTotalList: Tcontrol_subTotalList;
  total: Tcontrol_total;
  listKeyArr: string[];
  bounsCalcProcess: Tcontrol['bounsCalcProcess'];
}) => {
  return (
    <div className={scss.footer}>
      {/*  */}
      <div className={scss.bar01}>
        <div className={scss.left}>
          <div>
            <span>小計</span>
          </div>
        </div>

        {listKeyArr.map((key, index) => {
          const { totalsum, pricesum, percentage } = subTotalList[key];

          return (
            <div key={index} className={scss.group02}>
              <div>
                <span>{totalsum}</span>
              </div>
              <div>
                <span>{pricesum}</span>
              </div>
              <div>
                <span>{percentage}</span>
              </div>
            </div>
          );
        })}

        <div className={scss.total} />
      </div>
      {/*  */}
      <div className={scss.bar02}>
        <div className={scss.left}>
          <div>
            <span>總計</span>
          </div>
        </div>

        <div className={classNames(scss.group02, scss.total)}>
          <div>
            <span>{total.totalsum}</span>
          </div>
          <div>
            <span>{total.pricesum}</span>
          </div>
          <div>
            <span>{total.percentage}</span>
          </div>
        </div>
      </div>
      <div className={classNames(scss.bar02, scss.bonusBar)}>
        <div className={scss.left}>
          <div>
            <span>獎金</span>
          </div>
        </div>

        <div className={classNames(scss.bonusWraper)}>
          <div className={scss.bonus}>
            <span>{bounsCalcProcess}</span>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
};

// =======================================================================
