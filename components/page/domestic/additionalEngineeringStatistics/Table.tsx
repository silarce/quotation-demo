import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './table.module.scss';

// =========================================================================

type TareaContent = {
  areaName: string;
  pricesum_num: number; // 承價
  pricesum: string; // 承價
};

type TareaList = {
  [key: string]: TareaContent;
};

type Tcontrol_row = {
  quotationNumber: string;
  projectName: string;
  // builder: string;
  // designer: string;
  list: {
    [key: string]:
      | {
          totalsum: string; // 牌價
          pricesum: string; // 承價
          percentage: string; // 百分比
        }
      | undefined;
  };

  // total: string;
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
  areaList: TareaList;
};

export type {
  //
  Tcontrol as Tcontrol_personalPerformanceStatistics,
  Tcontrol_row,
  Tcontrol_subTotalList,
  Tcontrol_total,
  TareaContent,
  TareaList,
};

// =========================================================================
export default function Table({ control }: { control: Tcontrol }) {
  const { rowArr, subTotalList, total, listKeyArr } = control;

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
          areaList={control.areaList}
        />
      )}
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

      {listKeyArr.map((key, index) => {
        return (
          <div key={index} className={classNames(scss.group02)} style={config.group02.style}>
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
    </div>
  );
};

const Tbody = ({ rowArr, listKeyArr }: { rowArr: Tcontrol_row[]; listKeyArr: string[] }) => {
  return (
    <div className={classNames(scss.tbody)}>
      {rowArr.map((row, index) => {
        const { quotationNumber, projectName, list } = row;

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
  areaList,
}: {
  subTotalList: Tcontrol_subTotalList;
  total: Tcontrol_total;
  listKeyArr: string[];
  areaList: TareaList;
}) => {
  return (
    <div className={scss.footer}>
      {/*  */}
      <div className={scss.bar01}>
        <div className={scss.left} style={config.group01.style}>
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
        {/* 
        <div style={config.total.style}></div> */}
      </div>
      {/*  */}
      {Object.values(areaList).map((content, index) => {
        return (
          <div key={index} className={scss.bar02}>
            <div className={scss.left} style={config.group01.style}>
              <div>
                <span>{content.areaName}</span>
              </div>
            </div>

            <div className={scss.footTotalCell} style={config.footTotalCell.style}>
              <div>
                <span>{content.pricesum}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/*  */}
      <div className={scss.bar02}>
        <div className={scss.left} style={config.group01.style}>
          <div>
            <span>總計</span>
          </div>
        </div>

        <div className={scss.footTotalCell} style={config.footTotalCell.style}>
          <div>
            <span>{total.pricesum}</span>
          </div>
        </div>
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

  footTotalCell: {
    style: { width: '118.63px' },
  },

  group01: {
    style: { width: '465px' },
  },

  group02: {
    style: { width: '357px' },
  },
};
