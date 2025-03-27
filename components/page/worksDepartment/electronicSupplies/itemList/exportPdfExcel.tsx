import { useRef, useEffect, forwardRef, useMemo, useState, createContext, useContext } from 'react';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import moment from 'moment';

// gear
import Row, { Cell } from 'components/global/gear/table/row';

import scss from './exportPdfExcel.module.scss';

import type { Titem } from './index';
import { config, keyArr } from './index';

import { dlPdf, getA4Rect } from 'js/utils/dlPdf';

import ExcelJs, { Column } from 'exceljs';

// ============================================================================
type Tcontext = { projectName: string };

type TrowData = Titem & {
  element?: HTMLDivElement | null;
};

type TcolumnConfig = {
  outline: Partial<Column>;
  getValue: (data: Titem) => string | number;
};

// ============================================================================

const Context = createContext<Tcontext>({ projectName: '' });

// ============================================================================

const pageStyle = getA4Rect({ horizontal: true });
const titleHeight = 41.42;
const theadHeight = 45.14;
const tbodyHeight = new Decimal(pageStyle.height).sub(titleHeight).sub(theadHeight);

// ============================================================================

// MARK: START

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

  // MARK: RENDER
  return (
    <Context.Provider value={{ projectName }}>
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
    </Context.Provider>
  );
}

// MARK: END

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// MARK: COMPONENT

const Title = ({ page, totalPage }: { page: React.ReactNode; totalPage: React.ReactNode }) => {
  const { projectName } = useContext(Context);

  return (
    <div className={scss.title} style={{ height: titleHeight }}>
      <h1>{projectName} 送電備品列表</h1>
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

// MARK:dlExcel
const dlExcel = async ({ itemArr, projectName }: { itemArr: Titem[]; projectName: string }) => {
  const workbook = new ExcelJs.Workbook();

  const sheetName = '送電備品列表';

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

  sheet.columns = keyArr.map((key) => columnsLookup[key].outline);

  keyArr.forEach((key) => {
    const { alignment } = columnsLookup[key].outline;
    // 在上面建立column時，送alignment進去沒有用，所以要在這邊再設定一次
    const column = sheet.getColumn(key);
    column.alignment = { ...column.alignment, ...alignment };
  });

  sheet.addRow([projectName]).getCell('A').font = { bold: true, size: 20 };

  const labelArr = keyArr.map((key) => config[key].label);
  sheet.addRow(labelArr);

  itemArr.forEach((item) => {
    const rowValueArr = keyArr.map((key) => columnsLookup[key].getValue(item));
    sheet.addRow(rowValueArr);
  });

  // -------------------------------------------------------
  await workbook.xlsx.writeBuffer();

  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const today = moment().format('yyyy-MM-DD');
    link.download = `送電備品列表_${projectName}_${today}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });

  //
}; // dlExcel close

// region excel config

const c_itemName: TcolumnConfig = {
  outline: {
    key: 'itemName',
    width: 10,
  },
  getValue: (data) => data.itemName,
};

const c_floor: TcolumnConfig = {
  outline: {
    key: 'floor',
    width: 10,
  },
  getValue: (data) => data.floor ?? '',
};

const c_locationArea: TcolumnConfig = {
  outline: {
    key: 'locationArea',
    width: 10,
  },
  getValue: (data) => data.locationArea ?? '',
};

const c_qty: TcolumnConfig = {
  outline: {
    key: 'qty',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => data.qty,
};

const c_doorModelName: TcolumnConfig = {
  outline: {
    key: 'doorModelName',
    width: 10,
  },
  getValue: (data) => data.doorModelName,
};

const c_motorVendor: TcolumnConfig = {
  outline: {
    key: 'motorVendor',
    width: 10,
  },
  getValue: (data) => data.motorVendor ?? '',
};

const c_motorVoltage: TcolumnConfig = {
  outline: {
    key: 'motorVoltage',
    width: 10,
  },
  getValue: (data) => {
    const { motorVoltage, motorPhase } = data;

    return `${motorPhase}ψ ${motorVoltage}V`;
  },
};

const c_horsepower: TcolumnConfig = {
  outline: {
    key: 'horsepower',
    width: 10,
  },
  getValue: (data) => data.horsepower,
};

const c_antiTyphoonBaseLock: TcolumnConfig = {
  outline: {
    key: 'antiTyphoonBaseLock',
    width: 15,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => data.antiTyphoonBaseLock,
};

const c_obstacleSensor: TcolumnConfig = {
  outline: {
    key: 'obstacleSensor',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.obstacleSensor && 'V') || '',
};

const c_infrared: TcolumnConfig = {
  outline: {
    key: 'infrared',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.infrared && 'V') || '',
};

const c_remoteControl: TcolumnConfig = {
  outline: {
    key: 'remoteControl',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.remoteControl && 'V') || '',
};

const c_smartSwitch: TcolumnConfig = {
  outline: {
    key: 'smartSwitch',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.smartSwitch && 'V') || '',
};

const c_antiTyphoonColumn: TcolumnConfig = {
  outline: {
    key: 'antiTyphoonColumn',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.antiTyphoonColumn && 'V') || '',
};

const c_ul: TcolumnConfig = {
  outline: {
    key: 'ul',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.ul && 'V') || '',
};

const c_wheel: TcolumnConfig = {
  outline: {
    key: 'wheel',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.wheel && 'V') || '',
};

const c_itemNumber: TcolumnConfig = {
  outline: {
    key: 'itemNumber',
    width: 10,
  },
  getValue: (data) => data.itemNumber,
};

const c_bounceDoor: TcolumnConfig = {
  outline: {
    key: 'bounceDoor',
    width: 10,
    alignment: {
      horizontal: 'center',
    },
  },
  getValue: (data) => (data.bounceDoor && 'V') || '',
};

const columnsLookup: Record<(typeof keyArr)[number], TcolumnConfig> = {
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

// endregion
