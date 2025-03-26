import { useRef, useEffect, forwardRef, useMemo, useState } from 'react';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// gear
import Row, { Cell } from 'components/global/gear/table/row';

import scss from './exportPdfExcel.module.scss';

import type { Titem, Tkeys, Tconfig } from './index';
import { config, acceCheckLookup, keyArr } from './index';

import { dlPdf, getA4Rect } from 'js/utils/dlPdf';

// ============================================================================

import ExcelJs, { Column } from 'exceljs';

// ============================================================================
type TrowData = Titem & {
  element?: HTMLDivElement | null;
};

// ============================================================================

const pageStyle = getA4Rect({ horizontal: true });
const titleHeight = 41.42;
const theadHeight = 45.14;
const tbodyHeight = new Decimal(pageStyle.height).sub(titleHeight).sub(theadHeight);

// ============================================================================
export default function ExportPdfExcel({ itemArr, projectName }: { itemArr: Titem[]; projectName: string }) {
  const [rowDataArr, setRowDataArr] = useState<TrowData[]>([]);

  const ref_rowArr = useRef<(HTMLDivElement | null)[]>([]);
  const ref_pageArr = useRef<(HTMLDivElement | null)[]>([]);

  const pageArr = useMemo(() => {
    if (!ref_rowArr.current.length) {
      return [];
    }

    const pageArr: Titem[][] = [];
    let tempArr: Titem[] = [];
    let cumulativeHeight = new Decimal(0);

    rowDataArr.forEach((rowData, index) => {
      const { element } = rowData;

      if (!element) {
        return;
      }

      const isLatest = index === rowDataArr.length - 1;

      const { height } = element.getBoundingClientRect();

      const isGreaterThenTbody = cumulativeHeight.add(height).greaterThan(tbodyHeight);

      if (isGreaterThenTbody) {
        pageArr.push(tempArr);
        tempArr = [];
        cumulativeHeight = new Decimal(0);
      }

      tempArr.push(rowData);
      cumulativeHeight = cumulativeHeight.add(height);

      if (isLatest) {
        pageArr.push(tempArr);
      }
    });

    return pageArr;
  }, [rowDataArr]);

  const hanlder_dlPdf = () => {
    dlPdf({
      divElementArr: ref_pageArr.current,
      fileName: '送電備品列表',
      horizontal: true,
    });
  };

  useEffect(() => {
    const arr = itemArr.map((item, index) => ({
      ...item,
      element: ref_rowArr.current[index],
    }));

    setRowDataArr(arr);
  }, [itemArr]);

  return (
    <div className={scss.container}>
      <div className={scss.panel}>
        <SquareBtn content="export" sharp="long" onClick={hanlder_dlPdf}>
          PDF
        </SquareBtn>
        <SquareBtn
          content="export"
          sharp="long"
          onClick={() => {
            dlExcel({
              itemArr,
              projectName,
            });
          }}
        >
          Excel
        </SquareBtn>
      </div>
      {/*  */}
      <div className={scss.pageContainer}>
        <Page isTemp={true}>
          {itemArr.map((item, index) => {
            return (
              <Row
                ref={(ele) => {
                  ref_rowArr.current[index] = ele;
                }}
                key={index}
                className={scss.row}
                gap={false}
                fullWidth={true}
              >
                {keyArr.map((key) => {
                  const { style, className, render } = config[key];

                  return (
                    <Cell key={key} style={style} className={classNames(scss.cell, scss.plus, className)}>
                      {render(item)}
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
        </Page>

        {pageArr.map((itemArr, index) => {
          return (
            <Page
              key={index}
              ref={(ele) => {
                ref_pageArr.current[index] = ele;
              }}
              className="mt-10"
              page={index + 1}
              totalPage={pageArr.length}
            >
              {itemArr.map((item, index) => {
                return (
                  <Row
                    ref={(ele) => {
                      ref_rowArr.current[index] = ele;
                    }}
                    key={index}
                    className={scss.row}
                    gap={false}
                  >
                    {keyArr.map((key) => {
                      const { style, className, render } = config[key];

                      return (
                        <Cell key={key} style={style} className={classNames(scss.cell, scss.plus, className)}>
                          {render(item)}
                        </Cell>
                      );
                    })}
                  </Row>
                );
              })}
            </Page>
          );
        })}
      </div>
      {/*  */}
    </div>
  );
}

// ============================================================================

const Title = ({ page, totalPage }: { page: React.ReactNode; totalPage: React.ReactNode }) => {
  return (
    <div className={scss.title} style={{ height: titleHeight }}>
      <h1>送電備品列表</h1>
      <span>
        {page} / {totalPage} 頁
      </span>
    </div>
  );
};

const Page_ = (
  {
    page,
    totalPage,
    children,
    className,
    isTemp,
  }: {
    page?: React.ReactNode;
    totalPage?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    isTemp?: boolean;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div className={classNames(scss.pageWrapper, isTemp && scss.tempPage, className)}>
      <div ref={ref} style={pageStyle} className={classNames(scss.page)}>
        <Title page={page} totalPage={totalPage} />
        <div className={scss.table}>
          <Row className={scss.thead} style={{ height: theadHeight }} thead={true} gap={false}>
            {keyArr.map((key) => {
              const { label, style, className } = config[key];

              return (
                <Cell key={key} style={style} className={classNames(scss.cell, scss.plus, className)}>
                  {label}
                </Cell>
              );
            })}
          </Row>
          {children}
        </div>
      </div>
    </div>
  );
};

const Page = forwardRef(Page_);

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

type TpartialColumn = Partial<Column>;

// MARK:dlExcel
const dlExcel = ({ itemArr, projectName }: { itemArr: Titem[]; projectName: string }) => {
  const workbook = new ExcelJs.Workbook();

  const sheetName = 'foooo';

  const sheet = workbook.addWorksheet(sheetName, {
    pageSetup: {
      paperSize: 9, // A4 paper size
      orientation: 'portrait', // page orientation
      // showGridLines: true,
      // fitToPage: true, // fit to page
      // fitToWidth: 1, // fit to one page wide
      // fitToHeight: 0, // auto height
    },
  });

  sheet.columns = Object.values(columnsLookup);
  sheet.addRow([projectName]);

  itemArr.forEach((item, index) => {
    // const rowIndex = index + 2;
    const arr = keyArr.map((key) => item[key]);
    sheet.addRow(arr);
  });

  //
}; // dlExcel close

const c_itemName: TpartialColumn = {
  key: 'itemName',
  width: 10,
};

const c_floor: TpartialColumn = {
  key: 'floor',
  width: 10,
};

const c_locationArea: TpartialColumn = {
  key: 'locationArea',
  width: 10,
};

const c_qty: TpartialColumn = {
  key: 'qty',
  width: 10,
};

const c_doorModelName: TpartialColumn = {
  key: 'doorModelName',
  width: 10,
};

const c_motorVendor: TpartialColumn = {
  key: 'motorVendor',
  width: 10,
};

const c_motorVoltage: TpartialColumn = {
  key: 'motorVoltage',
  width: 10,
};

const c_horsepower: TpartialColumn = {
  key: 'horsepower',
  width: 10,
};

const c_antiTyphoonBaseLock: TpartialColumn = {
  key: 'antiTyphoonBaseLock',
  width: 10,
};

const c_obstacleSensor: TpartialColumn = {
  key: 'obstacleSensor',
  width: 10,
};

const c_infrared: TpartialColumn = {
  key: 'infrared',
  width: 10,
};

const c_remoteControl: TpartialColumn = {
  key: 'remoteControl',
  width: 10,
};

const c_smartSwitch: TpartialColumn = {
  key: 'smartSwitch',
  width: 10,
};

const c_antiTyphoonColumn: TpartialColumn = {
  key: 'antiTyphoonColumn',
  width: 10,
};

const c_ul: TpartialColumn = {
  key: 'ul',
  width: 10,
};

const c_wheel: TpartialColumn = {
  key: 'wheel',
  width: 10,
};

const c_itemNumber: TpartialColumn = {
  key: 'itemNumber',
  width: 10,
};

const c_bounceDoor: TpartialColumn = {
  key: 'bounceDoor',
  width: 10,
};

const columnsLookup: Record<(typeof keyArr)[number], TpartialColumn> = {
  itemName: c_itemName,
  floor: c_floor,
  locationArea: c_locationArea,
  qty: c_qty,
  doorModelName: c_doorModelName,
  motorVendor: c_motorVendor,
  motorVoltage: c_motorVoltage,
  horsepower: c_horsepower,
  antiTyphoonBaseLock: c_antiTyphoonBaseLock,
  obstacleSensor: c_obstacleSensor,
  infrared: c_infrared,
  remoteControl: c_remoteControl,
  smartSwitch: c_smartSwitch,
  antiTyphoonColumn: c_antiTyphoonColumn,
  ul: c_ul,
  wheel: c_wheel,
  // 沒用到
  itemNumber: c_itemNumber,
  // 沒用到
  bounceDoor: c_bounceDoor,
};
