import React, { useState, forwardRef, useRef, useEffect, useMemo, createContext, useContext } from 'react';
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
  subTotal_detail: React.ReactNode; // 請款合計
  latestPeriodRemain: React.ReactNode; // 上期保留
  subTotal_detailAddLatestPeriodRemain: React.ReactNode; // 請款合計 + 上期保留
  tax: React.ReactNode; // tax 5%
  retainage: React.ReactNode; // 應扣明細 保留10%
  deduction_installationMaterials: React.ReactNode; // 應扣明細 按裝物料
  deduction_laborInsuranceLoan: React.ReactNode; // 應扣明細 借支勞保
  subTotal_deduction: React.ReactNode; // 應扣明細
  deduction_amount: React.ReactNode; // 核扣金額
  actualAmountReceived: React.ReactNode; // 實領金額
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
const allowHeight_wholePage = 323;
const allowHeight_table = 867;

const Context = createContext<Tprops>(null!);

// ======================================================================

// MARK:START

// 有第二頁時，UI的呈現可能不符合需求，不過也沒有說需求是什麼
// 等到實際提出需求時再改吧

// 外包商當月計價總表
export default function Pdf_outsourcingPaymentMonthlyTable({
  //
  rowArr,
  year,
  month,
  signer,
  subTotal_detail,
  latestPeriodRemain,
  subTotal_detailAddLatestPeriodRemain,
  tax,
  retainage,
  deduction_installationMaterials,
  deduction_laborInsuranceLoan,
  subTotal_deduction,
  deduction_amount,
  actualAmountReceived,
  managerName,
  supervisorName,
  checkerName,
  agentName,
  ...modalProps
}: Tprops & ModalProps) {
  const ref_pageArr = useRef<(HTMLDivElement | null)[]>([]);
  const ref_rowArr = useRef<(HTMLDivElement | null)[]>([]);

  const [isRowArrRendered, setIsRowArrRendered] = useState(false);

  // const chunkedRowArr = useMemo(() => {
  //   const arr_container: Trow[][] = [];
  //   let arr: Trow[] = [];
  //   let accumulationHeight = 0;

  //   ref_rowArr.current.forEach((element, index) => {
  //     const height = element?.getBoundingClientRect().height ?? 0;

  //     if (accumulationHeight + height > allowHeight_wholePage) {
  //       arr_container.push(arr);
  //       arr = [];
  //       accumulationHeight = 0;
  //     }

  //     accumulationHeight += height;
  //     arr.push(rowArr[index]);

  //     if (index === ref_rowArr.current.length - 1) {
  //       arr_container.push(arr);
  //     }
  //   });

  //   return arr_container;
  // }, [isRowArrRendered, rowArr]);

  const { chunkedRowArr_table, isOverflow } = useMemo(() => {
    let isOverflow = false;

    const arr_container: Trow[][] = [];
    let arr: Trow[] = [];
    let accumulationHeight = 0;

    ref_rowArr.current.forEach((element, index) => {
      const height = element?.getBoundingClientRect().height ?? 0;

      if (accumulationHeight + height > allowHeight_wholePage) {
        isOverflow = true;
      }

      if (accumulationHeight + height > allowHeight_table) {
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

    return {
      chunkedRowArr_table: arr_container,
      isOverflow,
    };
  }, [isRowArrRendered, rowArr]);

  // ----------------------------------------------------------------------------

  const handleDownloadPdf = async () => {
    const divElementArr = ref_pageArr.current;

    await dlPdf({
      divElementArr,
      fileName: '外包商當月計價總表',
    });
  };

  // ----------------------------------------------------------------------------

  useEffect(() => {
    if (!modalProps.visible) {
      ref_pageArr.current = [];
      ref_rowArr.current = [];
      setIsRowArrRendered(false);
    }
  }, [modalProps.visible]);

  // MARK: RENDER

  return (
    <Modal {...modalProps} width="fit-content" footer={null} destroyOnClose={true}>
      <SquareBtn onClick={handleDownloadPdf}>下載PDF</SquareBtn>

      <br />
      <br />
      <Context.Provider
        value={{
          rowArr,
          year,
          month,
          signer,
          subTotal_detail,
          latestPeriodRemain,
          subTotal_detailAddLatestPeriodRemain,
          tax,
          retainage,
          deduction_installationMaterials,
          deduction_laborInsuranceLoan,
          subTotal_deduction,
          deduction_amount,
          actualAmountReceived,
          managerName,
          supervisorName,
          checkerName,
          agentName,
        }}
      >
        {!isOverflow && (
          <Page ref={(ref) => (ref_pageArr.current[0] = ref)}>
            <Table2 rowArr={chunkedRowArr_table[0] ?? []} className={scss.noBorderBottom} />
          </Page>
        )}

        {isOverflow && (
          <>
            <Page className="mb-5" ref={(ref) => (ref_pageArr.current[0] = ref)} />
            {chunkedRowArr_table.map((item, index) => {
              return (
                <PageEmpty key={index} className="mb-5" ref={(ref) => (ref_pageArr.current[index + 1] = ref)}>
                  <Table2 rowArr={item} />
                </PageEmpty>
              );
            })}
          </>
        )}

        {/*  */}
        {/* 模板page */}
        <div className={scss.hiddenWrapper}>
          <PageEmpty>
            <Table>
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
            </Table>
          </PageEmpty>
        </div>

        {/*  */}
        {/* 另一個版本，每一頁都有Top跟Bottom，備用，刪掉無妨 */}
        {/* {chunkedRowArr.map((rowArr, index_p) => {
          return (
            <Page key={index_p} ref={(ref) => (ref_pageArr.current[index_p] = ref)} className="mb-5">
              <Table className={scss.noBorderBottom}>
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
              </Table>
            </Page>
          );
        })} */}
        {/*  */}
      </Context.Provider>

      {/*  */}
    </Modal>
  );
}

// MARK:END

// ======================================================================
// ======================================================================
// ======================================================================

// MARK:Row_forwardRef
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

// MARK:Top
const Top = () => {
  const { year, month, signer } = useContext(Context);

  return (
    <div className={classNames(scss.top, 'mb-3')}>
      <div className={scss.left}>
        <span>{year}</span>年<span>{month}</span>月
      </div>
      <div className={scss.right}>
        <span>{signer}</span>按裝明細
      </div>
    </div>
  );
};

// MARK:Bottom
const Bottom = () => {
  const {
    subTotal_detail,
    latestPeriodRemain,
    subTotal_detailAddLatestPeriodRemain,
    tax,
    retainage,
    deduction_installationMaterials,
    deduction_laborInsuranceLoan,
    subTotal_deduction,
    deduction_amount,
    actualAmountReceived,
    managerName,
    supervisorName,
    checkerName,
    agentName,
  } = useContext(Context);

  return (
    <div className={scss.bottom}>
      <div className={scss.total}>
        <span className="">請款合計:</span>
        <span className="border-b border-black w-[120px] text-center">{subTotal_detail}</span>
        <span className="mx-2">＋</span>
        <span className="">上期保留:</span>
        <span className="border-b border-black w-[120px] text-center">{latestPeriodRemain}</span>
        <span className="mx-4">＝</span>
        <span className="border-b border-black w-[160px] text-center">{subTotal_detailAddLatestPeriodRemain}</span>
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
        <Cell className={classNames(scss.j)}>{tax}</Cell>
        <Cell className={classNames(scss.k)}>{retainage}</Cell>
        <Cell className={classNames(scss.l)}>{deduction_installationMaterials}</Cell>
        <Cell className={classNames(scss.m)}>{deduction_laborInsuranceLoan}</Cell>
        <Cell className={classNames(scss.n)}>{subTotal_deduction}</Cell>
        <Cell className={classNames(scss.o)}>{deduction_amount}</Cell>
      </div>

      <div className={scss.actualAmountReceived}>實　領　金　額 :{actualAmountReceived}</div>

      <div className={scss.review}>
        <Cell className={scss.textVertical}>核　准</Cell>
        <Cell>{managerName}</Cell>
        <Cell className={scss.textVertical}>主　管</Cell>
        <Cell>{supervisorName}</Cell>
        <Cell className={scss.textVertical}>核　對</Cell>
        <Cell>{checkerName}</Cell>
        <Cell className={scss.textVertical}>經　辦</Cell>
        <Cell>{agentName}</Cell>
      </div>
    </div>
  );
};

// MARK:Table
const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={classNames(scss.table, className)}>
      <Row_thead />
      <div className={scss.rowContainer}>{children}</div>
    </div>
  );
};

// MARK:Table2
const Table2 = ({ rowArr, className }: { rowArr: Trow[]; className?: string }) => {
  return (
    <div className={classNames(scss.table, className)}>
      <Row_thead />
      <div className={scss.rowContainer}>
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
      </div>
    </div>
  );
};

// MARK:Page
const Page_forwardRef = ({ children, className }: Tprops_page, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} className={classNames(scss.page, className)} style={style}>
      <Top />
      {children}
      <Bottom />
    </div>
  );
};

const PageEmpty_forwardRef = ({ children, className }: Tprops_page, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div ref={ref} className={classNames(scss.page, className)} style={style}>
      {children}
    </div>
  );
};

const Page = forwardRef(Page_forwardRef);
const PageEmpty = forwardRef(PageEmpty_forwardRef);

export type { Tprops };
