import { useState, useEffect, useRef, forwardRef, useMemo, useImperativeHandle } from 'react';

import classNames from 'classnames';
import Decimal from 'decimal.js';

import scss from './index.module.scss';

import { dlPdf, getA4Rect } from 'js/utils/dlPdf';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ========================================================================
// MARK:PdfTable

interface Tprops_pdfTable<PROPS = any> {
  fileName: string;

  scale?: number;
  horizontal?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  ISO216?: string;

  centerFullHeight?: boolean;

  Top?: React.ComponentType<{
    pageIndex: number;
    pageCount: number;
  }>;

  Bottom?: React.ComponentType<{
    pageIndex: number;
    pageCount: number;
  }>;

  center: {
    propsArr: PROPS[];
    Render: React.ComponentType<
      PROPS & {
        pageIndex: number;
        pageCount: number;
      }
    >;
  };
}

interface Timperativehandle_pdfTable {
  download: () => void;
}

// ========================================================================
function PdfTable_ref<PROPS>(props: Tprops_pdfTable<PROPS>, ref: React.ForwardedRef<Timperativehandle_pdfTable>) {
  const {
    fileName,

    scale = 2,
    horizontal = false,
    ISO216 = 'a4',

    centerFullHeight,
    Top,
    Bottom,
    center,
  } = props;

  const { propsArr, Render } = center;

  const ref_top = useRef<HTMLDivElement>(null);
  const ref_bottom = useRef<HTMLDivElement>(null);
  const ref_center = useRef<(null | HTMLDivElement)[]>([]);
  const ref_page = useRef<(null | HTMLDivElement)[]>([]);

  //
  //
  const [render, setRender] = useState(0);

  const [topHeight, setTopHeight] = useState(0);
  const [bottomHeight, setBottomHeight] = useState(0);

  // ----------------------------------------------------------------------

  const pageStyle_ = getA4Rect({
    scale,
    horizontal,
  });

  const paddingTop = props.paddingTop !== undefined ? props.paddingTop : 20;
  const paddingBottom = props.paddingBottom !== undefined ? props.paddingBottom : 20;

  const pageStyle = {
    ...pageStyle_,
    paddingTop: paddingTop + 'px',
    paddingBottom: paddingBottom + 'px',
  };

  const tbodyHeight = new Decimal(pageStyle.height).sub(topHeight).sub(bottomHeight).sub(paddingTop).sub(paddingBottom);

  // ----------------------------------------------------------------------

  const propsArrArr = useMemo(() => {
    if (!ref_center.current.length) {
      return [];
    }

    const propsArrArr: PROPS[][] = [];
    let tempArr: PROPS[] = [];
    let cumulativeHeight = new Decimal(0);

    propsArr.forEach((props, index) => {
      const ele = ref_center.current[index];

      if (!ele) {
        myAlert.notify.error({ message: `第${index}資料有誤` });

        return;
      }

      const isLatest = index === propsArr.length - 1;

      const { height } = ele.getBoundingClientRect();

      const isGreaterThenTbody = cumulativeHeight.add(height).greaterThan(tbodyHeight);

      if (isGreaterThenTbody) {
        propsArrArr.push(tempArr);
        tempArr = [];
        cumulativeHeight = new Decimal(0);
      }

      tempArr.push(props);
      cumulativeHeight = cumulativeHeight.add(height);

      if (isLatest) {
        propsArrArr.push(tempArr);
      }
      //
    });

    return propsArrArr;
  }, [propsArr, render]);

  // ----------------------------------------------------------------------

  const handel_dlPdf = () => {
    dlPdf({
      divElementArr: ref_page.current,
      fileName: fileName,
      ISO216,
      horizontal,
    });
  };

  // ----------------------------------------------------------------------
  useEffect(() => {
    setTopHeight(ref_top.current?.getBoundingClientRect().height ?? 0);
    setBottomHeight(ref_bottom.current?.getBoundingClientRect().height ?? 0);
  }, [render]);

  useEffect(() => {
    setRender((prev) => prev + 1);
  }, []);

  // ----------------------------------------------------------------------

  useImperativeHandle(ref, () => {
    return {
      download: handel_dlPdf,
    };
  });

  // ----------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div>
      {propsArrArr.map((propsArr, index) => {
        const pageIndex = index + 1;
        const pageCount = propsArrArr.length;

        return (
          <Page
            ref={(ele) => {
              ref_page.current[index] = ele;
            }}
            key={index}
            pageStyle={pageStyle}
          >
            {Top && (
              <div ref={ref_top}>
                <Top pageIndex={pageIndex} pageCount={pageCount} />
              </div>
            )}

            <div
              style={{
                height: centerFullHeight ? tbodyHeight.toNumber() + 'px' : 'auto',
              }}
            >
              {propsArr.map((props, index) => {
                return (
                  <div key={index}>
                    <Render pageIndex={pageIndex} pageCount={pageCount} {...props} />
                  </div>
                );
              })}
            </div>

            {Bottom && (
              <div ref={ref_bottom} className={scss.bottom}>
                <Bottom pageIndex={pageIndex} pageCount={pageCount} />
              </div>
            )}
          </Page>
        );
      })}

      <div className="w-[0] h-[0] overflow-hidden">
        <Page pageStyle={pageStyle}>
          {Top && (
            <div ref={ref_top}>
              <Top pageIndex={0} pageCount={0} />
            </div>
          )}

          {propsArr.map((data, index) => {
            return (
              <div
                key={index}
                ref={(ele) => {
                  ref_center.current[index] = ele;
                }}
              >
                <Render {...data} pageIndex={0} pageCount={0} />
              </div>
            );
          })}

          {Bottom && (
            <div ref={ref_bottom}>
              <Bottom pageIndex={0} pageCount={0} />
            </div>
          )}
        </Page>
      </div>
      {/*  */}
    </div>
  );
}

// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
const Page_ref = (
  {
    className,
    pageStyle,
    children,
    ...attr
  }: React.HTMLAttributes<HTMLDivElement> & {
    pageStyle: React.CSSProperties;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div {...attr} className={classNames(scss.pageWrapper, className)}>
      <div ref={ref} style={pageStyle} className={classNames(scss.page)}>
        {children}
      </div>
    </div>
  );
};

const Page = forwardRef(Page_ref);

const PdfTable = forwardRef<Timperativehandle_pdfTable, Tprops_pdfTable>(PdfTable_ref);

export default PdfTable;
export type { Tprops_pdfTable, Timperativehandle_pdfTable };
