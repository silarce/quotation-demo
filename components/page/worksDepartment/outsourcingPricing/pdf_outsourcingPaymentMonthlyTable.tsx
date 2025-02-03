import { useState, forwardRef, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { Modal, ModalProps } from 'antd';

import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

import { calcHeight_a4, dlPdf } from 'js/utils/dlPdf';

import scss from './pdf_outsourcingPaymentMonthlyTable.module.scss';

// ======================================================================

type Trow = {
  indexNumber: React.ReactNode;
  projectNumber: React.ReactNode;
  projectName: React.ReactNode;
  installPrice: React.ReactNode;
  supplyPrice: React.ReactNode;
  // subTotal: React.ReactNode;
  subTotal: number;
  priceCheck: React.ReactNode;
};

interface Tprops_page {
  children?: React.ReactNode;
  className?: string;
}

type Tprops = {
  rowArr: Trow[];
  year: React.ReactNode;
  month: React.ReactNode;
  signer: React.ReactNode; //右上方的名字
  latestPeriodRemain: number; // 上期保留
  deduction_5percent: React.ReactNode; // 應扣明細 5%
  deduction_10percent: React.ReactNode; // 應扣明細 保留10%
  deduction_installationMaterials: React.ReactNode; // 應扣明細 按裝物料
  deduction_laborInsuranceLoan: React.ReactNode; // 應扣明細 借支勞保
  deduction_amount: React.ReactNode; // 應扣明細 核扣金額
  actualAmountReceived: number; // 實領金額
  managerName: React.ReactNode; // 核准
  supervisorName: React.ReactNode; // 主管
  checkerName: React.ReactNode; // 核對
  agentName: React.ReactNode; // 經辦
};

// ======================================================================
const width = 20;
const height = calcHeight_a4(width, { round: false });

const style = {
  width: `${width}cm`,
  height: `${height}cm`,
};

// 這個值是在直接在控制台看rowContainer的高度而定義的
// 基本上可以是任意高度，只要符合使用者需求就可以了
const allowHeight = 323;

// ======================================================================

// 外包商當月計價總表
export default function Pdf_outsourcingPaymentMonthlyTable({
  //
  rowArr,
  ...modalProps
}: Tprops & ModalProps) {
  const ref_pageArr = useRef<(HTMLDivElement | null)[]>([]);
  const ref_rowArr = useRef<(HTMLDivElement | null)[]>([]);

  const [isRowArrRendered, setIsRowArrRendered] = useState(false);

  const handleDownloadPdf = async () => {
    const divElementArr = ref_pageArr.current;

    await dlPdf({
      divElementArr,
      fileName: '外包商當月計價總表',
    });
  };

  const chunkedRowArr = useMemo(() => {
    const arr_container: Trow[][] = [];
    let arr: Trow[] = [];
    let accumulationHeight = 0;

    ref_rowArr.current.forEach((element, index) => {
      const height = element?.getBoundingClientRect().height ?? 0;

      if (accumulationHeight + height > allowHeight) {
        arr_container.push(arr);
        arr = [];
        accumulationHeight = 0;
      }

      accumulationHeight += height;
      arr.push(rowArr[index]);

      if (index === ref_rowArr.current.length - 1) {
        arr_container.push(arr);
      }
    });

    return arr_container;
  }, [isRowArrRendered, rowArr]);

  useEffect(() => {
    if (!modalProps.visible) {
      ref_pageArr.current = [];
      ref_rowArr.current = [];
      setIsRowArrRendered(false);
    }
  }, [modalProps.visible]);

  return (
    <Modal {...modalProps} width="fit-content" footer={null} destroyOnClose={true}>
      <SquareBtn onClick={handleDownloadPdf}>下載PDF</SquareBtn>

      <br />
      <br />

      {/* 
考慮修改UI?
還是等有實際需求時再說吧
*/}
      {chunkedRowArr.map((rowArr, index_p) => {
        return (
          <Page key={index_p} ref={(ref) => (ref_pageArr.current[index_p] = ref)} className="mb-5">
            {rowArr.map((item, index) => {
              const {
                indexNumber,
                projectNumber: projectNumber,
                projectName,
                installPrice,
                supplyPrice,
                subTotal,
                priceCheck,
              } = item;

              return (
                <Row
                  key={index}
                  ref={(ref) => {
                    !isRowArrRendered && setIsRowArrRendered(true);

                    ref_rowArr.current[index] = ref;
                  }}
                  indexNumber={indexNumber}
                  projectNumber={projectNumber}
                  projectName={projectName}
                  installPrice={installPrice}
                  supplyPrice={supplyPrice}
                  subTotal={subTotal}
                  priceCheck={priceCheck}
                />
              );
            })}
          </Page>
        );
      })}

      {/* 模板page */}
      <div className={scss.hiddenWrapper}>
        <Page>
          {rowArr.map((item, index) => {
            const {
              indexNumber,
              projectNumber: projectNumber,
              projectName,
              installPrice,
              supplyPrice,
              subTotal,
              priceCheck,
            } = item;

            return (
              <Row
                key={index}
                ref={(ref) => {
                  !isRowArrRendered && setIsRowArrRendered(true);

                  ref_rowArr.current[index] = ref;
                }}
                indexNumber={indexNumber}
                projectNumber={projectNumber}
                projectName={projectName}
                installPrice={installPrice}
                supplyPrice={supplyPrice}
                subTotal={subTotal}
                priceCheck={priceCheck}
              />
            );
          })}
        </Page>
      </div>

      {/*  */}
    </Modal>
  );
}

// ======================================================================

const Row_forwardRef = (
  props: {
    className?: string;
    indexNumber: React.ReactNode;
    projectNumber: React.ReactNode;
    projectName: React.ReactNode;
    installPrice: React.ReactNode;
    supplyPrice: React.ReactNode;
    subTotal: React.ReactNode;
    priceCheck: React.ReactNode;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    className,

    indexNumber,
    projectNumber: projectNumber,
    projectName,
    installPrice,
    supplyPrice,
    subTotal,
    priceCheck,
  } = props;

  return (
    <div ref={ref} className={classNames(scss.row, className)}>
      <Cell className={classNames(scss.indexNumber)}>{indexNumber}</Cell>
      <Cell>{projectNumber}</Cell>
      <Cell>{projectName}</Cell>
      <Cell>{installPrice}</Cell>
      <Cell>{supplyPrice}</Cell>
      <Cell>{subTotal}</Cell>
      <Cell>{priceCheck}</Cell>
    </div>
  );
};

const Row = forwardRef(Row_forwardRef);

const Row_thead = () => {
  return (
    <Row
      className={scss.thead}
      indexNumber="序號"
      projectNumber="工程編號"
      projectName="工程名稱"
      installPrice="按　裝　費"
      supplyPrice="補　　貼"
      subTotal="請款小計"
      priceCheck="核對金額"
    />
  );
};

const Cell = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, children, ...rest } = props;

  return (
    <div className={classNames(scss.cell, className)} {...rest}>
      {children}
    </div>
  );
};

const Top = () => {
  return (
    <div className={classNames(scss.top, 'mb-3')}>
      <div className={scss.left}>
        <span>{111}</span>年<span>{11}</span>月
      </div>
      <div className={scss.right}>
        <span>{'王汪汪'}</span>按裝明細
      </div>
    </div>
  );
};

const Bottom = () => {
  return (
    <>
      <div className={scss.total}>
        <span className="">請款合計:</span>
        <span className="border-b border-black w-[120px] text-center">{9999}</span>
        <span className="mx-2">＋</span>
        <span className="">上期保留:</span>
        <span className="border-b border-black w-[120px] text-center">{9999}</span>
        <span className="mx-4">＝</span>
        <span className="border-b border-black w-[160px] text-center">9999</span>
      </div>

      <div className={scss.deductionTotal}>
        <Cell className={classNames(scss.a)}>減</Cell>
        <Cell className={classNames(scss.b)}>應扣明細</Cell>
        <Cell className={classNames(scss.c)}>5%</Cell>
        <Cell className={classNames(scss.d)}>保留　10%</Cell>
        <Cell className={classNames(scss.e)}>按裝物料</Cell>
        <Cell className={classNames(scss.f)}>借支勞保</Cell>
        <Cell className={classNames(scss.g)}>應扣明細</Cell>
        <Cell className={classNames(scss.h)}>核扣金額</Cell>
        <Cell className={classNames(scss.i, scss.textVertical)}>金　額</Cell>
        <Cell className={classNames(scss.j)}>j</Cell>
        <Cell className={classNames(scss.k)}>k</Cell>
        <Cell className={classNames(scss.l)}>l</Cell>
        <Cell className={classNames(scss.m)}>m</Cell>
        <Cell className={classNames(scss.n)}>n</Cell>
        <Cell className={classNames(scss.o)}>o</Cell>
      </div>

      <div className={scss.actualAmountReceived}>實　領　金　額 :{9999}</div>

      <div className={scss.review}>
        <Cell className={scss.textVertical}>核　准</Cell>
        <Cell>2</Cell>
        <Cell className={scss.textVertical}>主　管</Cell>
        <Cell>4</Cell>
        <Cell className={scss.textVertical}>核　對</Cell>
        <Cell>6</Cell>
        <Cell className={scss.textVertical}>經　辦</Cell>
        <Cell>8</Cell>
      </div>
    </>
  );
};

const Page_forwardRef = ({ children, className }: Tprops_page, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} className={classNames(scss.page, className)} style={style}>
      <Top />

      <div className={scss.table}>
        <Row_thead />

        <div className={scss.rowContainer}>{children}</div>

        <Bottom />
      </div>
    </div>
  );
};

const Page = forwardRef(Page_forwardRef);

export type { Tprops };
