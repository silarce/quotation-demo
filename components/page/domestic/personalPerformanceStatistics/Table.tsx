import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

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
};

export type { Tcontrol as Tcontrol_personalPerformanceStatistics, Tcontrol_row, Tcontrol_subTotalList, Tcontrol_total };

// ==================================================================

export default function Table({ control }: { control: Tcontrol }) {
  const { rowArr, subTotalList, total, listKeyArr } = control;

  return (
    <div className={classNames(scss.table)}>
      <Thead listKeyArr={listKeyArr} />
      <Tbody rowArr={rowArr} listKeyArr={listKeyArr} />
      <Footer subTotalList={subTotalList} total={total} listKeyArr={listKeyArr} />
    </div>
  );
}

// =======================================================================

const Thead = ({ listKeyArr }: { listKeyArr: string[] }) => {
  return (
    <div className={classNames(scss.row, scss.thead)}>
      <div style={config.group01.style}>
        <span>工程資訊</span>
      </div>
      <div style={config.builder.style}>
        <span>營造</span>
      </div>
      <div style={config.designer.style}>
        <span>設計單位</span>
      </div>

      {listKeyArr.map((key, index) => {
        return (
          <div key={index} className={classNames(scss.group02)} style={config.group02.style}>
            <div>
              <span>{'捲門'}</span>
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

      <div style={config.total.style}>
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
          <CellWithBar key={index} className={classNames(scss.row)}>
            <div className={scss.group01} style={config.group01.style}>
              <div style={config.quotationNumber.style}>
                <span>編號</span>
                <span>{quotationNumber}</span>
              </div>
              <div>
                <span>工程名稱</span>
                <span>{projectName}</span>
              </div>
            </div>
            <div style={config.builder.style}>
              <span>{builder}</span>
            </div>
            <div style={config.designer.style}>
              <span>{designer}</span>
            </div>
            {/*  */}
            {listKeyArr.map((key, index) => {
              const { totalsum, pricesum, percentage } = list[key] ?? {};

              return (
                <div key={index} className={classNames(scss.group02)} style={config.group02.style}>
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
            <div style={config.total.style}>
              <span>{total}</span>
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
};

const Footer = ({
  subTotalList,
  total,
  listKeyArr,
}: {
  subTotalList: Tcontrol_subTotalList;
  total: Tcontrol_total;
  listKeyArr: string[];
}) => {
  const { group01, builder, designer } = config;

  const leftWidth = parseInt(group01.style.width) + parseInt(builder.style.width) + parseInt(designer.style.width);

  return (
    <div className={scss.footer}>
      {/*  */}
      <div className={scss.bar01}>
        <div className={scss.left} style={{ width: `${leftWidth}px` }}>
          <div>
            <span>小計</span>
          </div>
        </div>

        {listKeyArr.map((key, index) => {
          const { totalsum, pricesum, percentage } = subTotalList[key];

          return (
            <div key={index} className={scss.group02} style={config.group02.style}>
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

        <div style={config.total.style}></div>
      </div>
      {/*  */}
      <div className={scss.bar02}>
        <div className={scss.left} style={{ width: `${leftWidth}px` }}>
          <div>
            <span>總計</span>
          </div>
        </div>

        <div className={scss.group02} style={config.group02.style}>
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
        {/* <div style={config.total.style}></div> */}
      </div>
      {/*  */}
    </div>
  );
};

// =======================================================================

const config = {
  quotationNumber: {
    style: { width: '110px' },
  },
  group01: {
    style: { width: '465px' },
  },
  builder: {
    style: { width: '147px' },
  },
  designer: {
    style: { width: '147px' },
  },
  total: {
    style: { width: '147px' },
  },
  group02: {
    style: { width: '357px' },
  },
};
