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
type TrowData = Titem & {
  // rect?: DOMRectList;
  element?: HTMLDivElement | null;
};

// ============================================================================

const pageStyle = getA4Rect({ horizontal: true });
const titleHeight = 41.42;
const theadHeight = 45.14;
const tbodyHeight = new Decimal(pageStyle.height).sub(titleHeight).sub(theadHeight);

// ============================================================================
export default function ExportPdfExcel({ itemArr }: { itemArr: Titem[] }) {
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
        <SquareBtn content="export" sharp="long">
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
