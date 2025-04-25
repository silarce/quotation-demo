import { useState, useRef, Fragment, forwardRef, useEffect, useReducer } from 'react';
import classNames from 'classnames';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// antd
import { Modal, ModalProps } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// css
import scss from './modalPdf.module.scss';

// ===============================================================================

type Tdata = {
  idNumber: string; // 派工單號，也就是序號
  customerName: string; // 其實是工地名稱
  phoneNumber: string; // 工地電話
  contactPerson: string; // 接洽人，自動帶工程聯絡單的聯絡人，但必須可以修改
  address: string; // 工地地址
  projectNumber: string; // 工程編號
  warrantyPeriod: string; // 保固日期
  content: string; // 承辦情形
};

export type { Tdata as Tdata_pdf };

// ===============================================================================

let isShowCellNumber = false;

// ===============================================================================

// region START

export default function ModalPdf({
  //
  visible,
  onCancel,
  data,
}: ModalProps & { data: Tdata }) {
  return (
    <Modal visible={visible} onCancel={onCancel} width={'fit-content'} footer={null} destroyOnClose={true}>
      <ModalPdf_pre data={data} />
    </Modal>
  );
}

function ModalPdf_pre({
  //

  data,
}: {
  data: Tdata;
}) {
  const ref_pdf = useRef<HTMLDivElement>(null!);
  const ref_contentWrapper = useRef<HTMLDivElement>(null!);
  const ref_content = useRef<HTMLDivElement>(null!);

  const [isContentOverflow, setIsContentOverflow] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const testBtn = useTestBtn();

  // ------------------------------------------------------------------------

  const dlPdf = async () => {
    if (!ref_pdf.current) {
      return;
    }

    setShowWarning(false);
    showRootLoading(true, '正在處理PDF');

    const func = async () => {
      const doc = new jsPDF('p', 'px', 'b5');
      const pageWidth = doc.internal.pageSize.getWidth();

      const pageHeight = doc.internal.pageSize.getHeight();

      const image = await html2canvas(ref_pdf.current, {
        scale: 5,
        // useCORS: true,
        // allowTaint: true,
      }).then((canvas) => {
        const image = canvas.toDataURL('image/JPEG');

        return image;
      });

      // 留作參考
      // doc.addImage(image, "JPEG", 0, 0, 595, 842);
      // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
      doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);

      doc.save(`派工單_${data.customerName}_${data.idNumber}.pdf`);

      showRootLoading(false);
      setShowWarning(true);
    };

    setTimeout(func, 0);
  };

  useEffect(() => {
    const { height: _height_content } = window.getComputedStyle(ref_content.current);
    const { height: _height_wrapper } = window.getComputedStyle(ref_contentWrapper.current);

    const height_wrapper = parseFloat(_height_wrapper);
    const height_content = parseFloat(_height_content);
    const isOverflow = Number(height_wrapper) - Number(height_content) < -6;

    isOverflow && setIsContentOverflow(true);
  }, []);

  // ------------------------------------------------------------------------
  // region RENDER
  return (
    <>
      {/*  */}
      {/* 給開發者方便開發用的 */}
      {/* 需要調整格子寬度時就取消註解按下按鈕 */}
      {testBtn}
      {/*  */}

      <MyButton_v2 onClick={dlPdf}>匯出PDF</MyButton_v2>

      <div className={scss.bodyWrapper}>
        <div ref={ref_pdf} className={classNames(scss.body)}>
          <div className={scss.title}>
            <p>三久建材工業股份有限公司</p>
            <p>派工證明單</p>
          </div>
          <div className={scss.dateAndIndex}>
            <div>{`通知　　年　　月　　日　　時　　分`}</div>
            <div>
              序號 <span className={scss.idNumber}>{data.idNumber}</span>
            </div>
          </div>
          {/*  */}

          <form className={scss.form}>
            <Row>
              <Cell01 str="客戶" />
              <Cell05>{data.customerName}</Cell05>
              <Cell03>電話</Cell03>
              <Cell06 className={classNames(scss.noPaddingY, scss.justifyStart)}>{data.phoneNumber}</Cell06>
              <div className={scss['cell_09-10']}>
                <Cell10 className={scss.noPaddingY}>工程編號</Cell10>
                <Cell09 className={scss.noPaddingY}>{data.projectNumber}</Cell09>
                <Cell10 className={scss.noPaddingY}>管制卡編號</Cell10>
                <Cell09 className={scss.noPaddingY}></Cell09>
              </div>
            </Row>

            <Row>
              <Cell01 str="接洽人" />
              <Cell05>{data.contactPerson}</Cell05>
              <Cell03>住址</Cell03>
              <Cell07>{data.address}</Cell07>
            </Row>

            <Row>
              <Cell01 str="交辦內容" />
              <Cell02 />
              <Cell04>大門修理</Cell04>
              <Cell02 />
              <Cell04>捲門修理</Cell04>
              <Cell02 />
              <Cell04>送電</Cell04>

              <Cell08 className={scss.cell_08_warranty}>
                保固
                <br />
                期限
              </Cell08>
              <Cell09>{data.warrantyPeriod}</Cell09>
            </Row>

            <Row className={scss.row_content}>
              <Cell00 className={scss.c00_center}>
                <span>承</span>
                <span>辦</span>
                <span>情</span>
                <span>形</span>
              </Cell00>

              <div
                ref={ref_contentWrapper}
                className={classNames(
                  //
                  scss.c11_content_wrapper,
                  isContentOverflow && showWarning && scss.warning
                )}
              >
                <Cell11 ref={ref_content} className={scss.c11_content}>
                  {data.content}
                </Cell11>
              </div>

              <div className={scss['wrapper_cell_12-8-9']}>
                <div className={scss['cell_12-8-9_head']}>
                  <Cell12>修理批價</Cell12>
                  {/* 最後一格 */}
                  <Cell08 className={classNames(scss.noPadding, scss.latest)}>合計</Cell08>
                  <Cell09 className={scss.latest} />
                </div>
                <div className={scss['cell_12-8-9']}>
                  {Array(20)
                    .fill('foo')
                    .map((_, index) => {
                      return (
                        <Fragment key={index}>
                          <Cell08 />
                          <Cell09 />
                        </Fragment>
                      );
                    })}
                </div>
              </div>
            </Row>

            <Row>
              <Cell00 className={scss.c00_bottom}>
                <span>往</span>
                <span>時</span>
                <span>返</span>
                <span>間</span>
              </Cell00>
              <Cell11 className={scss.cell_time}>
                <div className={scss.left}>
                  <span>月</span>
                  <span>日</span>
                  <span>時</span>
                  <span>分</span>
                  {/*  */}
                  <span>月</span>
                  <span>日</span>
                  <span>時</span>
                  <span>分</span>
                </div>
                <div className={scss.right}>{'(共計　　分　　秒)'}</div>
              </Cell11>
              <Cell08 className={scss.c08_customerSign}>
                <span>客</span>
                <span>戶</span>
                <span>簽</span>
                <span>章</span>
              </Cell08>
              <Cell09 />
            </Row>
          </form>
          {/*  */}
          <div className={scss.signBar}>
            <div>
              <SpanArr str="歸檔" />
            </div>
            <div>
              <SpanArr str="主管" />
            </div>
            <div>
              <SpanArr str="財會" />
            </div>
            <div>
              <SpanArr str="批價" />
            </div>
            <div>
              <SpanArr str="工務承辦" />
            </div>
            <div>
              <SpanArr str="交辦單位" />
            </div>
          </div>
        </div>
        {/* body close */}
      </div>
    </>
  );
}

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

// region COMPONENT

const Row = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};

const magnification = 1.2;
// const magnification = 1.3;
const c6c10Adjust = 40 * magnification;

const c0 = 50 * magnification;
const c00 = 50 * magnification;
const c01 = c00 + c0;

// const c02 = 20 * magnification;
const c02 = 26 * magnification;

const c03 = 40 * magnification;
const c04 = c03 + 50 * magnification;
const c05 = c02 + c02 + c04;
const c06 = c04 + c02 - c03 + c6c10Adjust;
const c07 = 'auto';
const c08 = 35 * magnification;

const c09 = 120 * magnification;
// const c09 = 110 * magnification;
// const c09 = 90 * magnification;

const c10 = c04 + c08 - c6c10Adjust;
const c11 = c0 + c02 + c04 + c02 + c04 + c02 + c04;
const c12 = c08 + c09;

const Cell00 = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, className)} style={{ width: c00 }}>
      {isShowCellNumber ? 'cell00' : children}
    </div>
  );
};

const Cell01 = ({ str }: { str?: string }) => {
  const letterArr = str ? str.split('') : [];

  return (
    <div className={classNames(scss.cell, scss.c01)} style={{ width: c01 }}>
      {isShowCellNumber
        ? 'cell01'
        : letterArr.map((letter, index) => {
            return <span key={index}>{letter}</span>;
          })}
    </div>
  );
};

const Cell02 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell)} style={{ width: c02 }}>
      {isShowCellNumber ? 'cell02' : children}
    </div>
  );
};

const Cell03 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, scss.c03)} style={{ width: c03 }}>
      {isShowCellNumber ? 'cell03' : children}
    </div>
  );
};

const Cell04 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, scss.c04)} style={{ width: c04 }}>
      {isShowCellNumber ? 'cell04' : children}
    </div>
  );
};

const Cell05 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, scss.c05)} style={{ width: c05 }}>
      {isShowCellNumber ? 'cell05' : children}
    </div>
  );
};

const Cell06 = ({ className, children }: { className: string; children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, className)} style={{ width: c06 }}>
      {isShowCellNumber ? 'cell06' : children}
    </div>
  );
};

const Cell07 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, scss.c07)} style={{ width: c07, flex: 'auto' }}>
      {isShowCellNumber ? 'cell07' : children}
    </div>
  );
};

const Cell08 = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, className)} style={{ width: c08 }}>
      {isShowCellNumber ? 'cell08' : children}
    </div>
  );
};

const Cell09 = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, className)} style={{ width: c09 }}>
      {isShowCellNumber ? 'cell09' : children}
    </div>
  );
};

const Cell10 = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, className)} style={{ width: c10 }}>
      {isShowCellNumber ? 'cell10' : children}
    </div>
  );
};

const Cell11_pre = (
  {
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={classNames(scss.cell, className)} style={{ width: c11 }}>
      {isShowCellNumber ? 'cell11' : children}
    </div>
  );
};

const Cell11 = forwardRef(Cell11_pre);

const Cell12 = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={classNames(scss.cell, className)} style={{ width: c12 }}>
      {isShowCellNumber ? 'cell12' : children}
    </div>
  );
};

const SpanArr = ({ str }: { str: string }) => {
  return (
    <>
      {str.split('').map((letter, index) => {
        return <span key={index}>{letter}</span>;
      })}
    </>
  );
};

// 將isShowCellNumber設為true即可在畫面上看到格子的編號
// 方便開發時調整格子的樣式或排版
// 需要注意的是isShowCellNumber是寫在這個檔案的變數，不是react狀態
// isShowCellNumber預期只在開發時可能改變，所以在產出環境沒有影響
const useTestBtn = () => {
  const [_, setForceRender] = useState(0);

  // 將isShowCellNumber設為true即可在畫面上看到格子的編號
  // 方便開發時調整格子的樣式或排版
  const handleShowCellNumber = () => {
    isShowCellNumber = !isShowCellNumber;
    setForceRender((state) => state + 1);
  };

  const testBtn =
    process.env.NODE_ENV === 'development' ? (
      <MyButton_v2 className="mr-5" onClick={handleShowCellNumber}>
        切換顯示cell編號
      </MyButton_v2>
    ) : null;

  return testBtn;
};
