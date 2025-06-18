import { useState, useEffect, useLayoutEffect, useRef, forwardRef, useMemo, useImperativeHandle } from 'react';

import classNames from 'classnames';
import Decimal from 'decimal.js';

import scss from './index.module.scss';

import { dlPdf, getA4Rect } from 'js/utils/dlPdf';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { XOR } from 'ts-essentials';

import SquareBtn from '../gear/button/larrysBtn/squarebtn';

// ========================================================================

type Tprops_pdfTable<PROPS = any> = {
  fileName: string;

  scale?: number;
  horizontal?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  ISO216?: string;
  showPanel?: boolean;

  centerFullHeight?: boolean;

  Top?: Ttop;
  Bottom?: Tbottom;
} & XOR<
  {
    center: {
      propsArr: PROPS[];
      Render: React.ComponentType<
        PROPS & {
          pageIndex: number;
          pageCount: number;
        }
      >;
    };
  },
  {
    center_indivisible: {
      propsArr: PROPS[];
      Render_propsArr?: React.ComponentType<{
        propsArr: PROPS[];
        pageIndex: number;
        pageCount: number;
      }>;
      template?: (refs: {
        ref_thead: React.RefObject<HTMLElement>;
        ref_centerRowArr: React.MutableRefObject<(HTMLElement | null)[]>;
      }) => React.ReactNode;
    };
  }
>;

type Ttop = React.ComponentType<{
  pageIndex: number;
  pageCount: number;
}>;

type Tbottom = React.ComponentType<{
  pageIndex: number;
  pageCount: number;
}>;

interface Timperativehandle_pdfTable {
  download: () => void;
}

// ========================================================================

// MARK: START

// 要節省效能，以下proerty都要用useMemo處理過
// Top
// Bottom
// propsArr_raw
// Render
// Render_propsArr
// template

function PdfTable_ref<PROPS>(props: Tprops_pdfTable<PROPS>, ref: React.ForwardedRef<Timperativehandle_pdfTable>) {
  const {
    fileName,

    scale = 2,
    horizontal = false,
    ISO216 = 'a4',
    showPanel = true,

    centerFullHeight,
    Top,
    Bottom,
    center,
    center_indivisible,
  } = props;

  const { propsArr: propsArr_raw } = center || center_indivisible;
  const { Render } = center || {};
  const { Render_propsArr, template } = center_indivisible || {};

  const ref_top = useRef<HTMLDivElement>(null);
  const ref_bottom = useRef<HTMLDivElement>(null);
  const ref_page = useRef<(null | HTMLDivElement)[]>([]);

  const ref_thead = useRef<HTMLElement>(null);
  const ref_centerRowArr = useRef<(null | HTMLElement)[]>([]);

  const [isReady, setIsReady] = useState<boolean>(false);

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
    if (!ref_centerRowArr.current.length || !isReady) {
      return [];
    }

    const propsArrArr: PROPS[][] = [];
    let tempArr: PROPS[] = [];
    let cumulativeHeight = new Decimal(0);

    const errorIndexArr: number[] = [];

    propsArr_raw.forEach((props, index) => {
      const ele = ref_centerRowArr.current[index];

      if (!ele) {
        errorIndexArr.push(index);

        return;
      }

      const isLatest = index === propsArr_raw.length - 1;

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
    });

    if (errorIndexArr.length > 0) {
      myAlert.notify.error({ message: `第${errorIndexArr.join(', ')}資料有誤` });
    }

    return propsArrArr;
  }, [isReady, propsArr_raw, tbodyHeight]);

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
    setIsReady(false);
    ref_centerRowArr.current = [];
  }, [Top, Bottom, propsArr_raw, Render, Render_propsArr, template]);

  useLayoutEffect(() => {
    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  useEffect(() => {
    if (isReady) {
      setTopHeight(ref_top.current?.getBoundingClientRect().height ?? 0);
      setBottomHeight(ref_bottom.current?.getBoundingClientRect().height ?? 0);
    }
  }, [isReady]);

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
      {showPanel && (
        <div className={scss.panel}>
          <SquareBtn
            sharp="long"
            onClick={() => {
              handel_dlPdf();
            }}
          >
            下載PDF
          </SquareBtn>
        </div>
      )}

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
              <div>
                <Top pageIndex={pageIndex} pageCount={pageCount} />
              </div>
            )}

            <div
              style={{
                height: centerFullHeight ? tbodyHeight.toNumber() + 'px' : 'auto',
              }}
            >
              {Render &&
                propsArr.map((props, index) => {
                  return (
                    <div key={index}>
                      <Render pageIndex={pageIndex} pageCount={pageCount} {...props} />
                    </div>
                  );
                })}

              {Render_propsArr && <Render_propsArr propsArr={propsArr} pageIndex={pageIndex} pageCount={pageCount} />}
            </div>

            {Bottom && (
              <div className={scss.bottom}>
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

          {!template &&
            Render &&
            propsArr_raw.map((data, index) => {
              return (
                <div
                  key={index}
                  ref={(ele) => {
                    ref_centerRowArr.current[index] = ele;
                  }}
                >
                  <Render {...data} pageIndex={0} pageCount={0} />
                </div>
              );
            })}

          {template &&
            template({
              ref_thead,
              ref_centerRowArr,
            })}

          {Bottom && (
            <div ref={ref_bottom}>
              <Bottom pageIndex={0} pageCount={0} />
            </div>
          )}
        </Page>
      </div>
    </div>
  );
}

// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
// =========================================================================
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
