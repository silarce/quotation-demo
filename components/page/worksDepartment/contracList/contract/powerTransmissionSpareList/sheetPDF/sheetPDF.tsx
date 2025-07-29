import React, { useRef } from 'react';
import classNames from 'classnames';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// antd
import Modal from 'antd/lib/modal/Modal';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

import scss from './sheetPDF.module.scss';

import { fixTailwindImgDisplay } from 'js/utils/dlPdf';

// =====================================================================

type Tcontrol_info = {
  projectNumber: string;
  projectName: string;
  date: string;
};

type Trow = {
  c1: {
    value: string;
  };
  c2: {
    cArr?: {
      value: string;
    }[];
    masterC2?: {
      value: React.ReactNode;
    };
    bigC2?: {
      value: string;
    };
  };
  c3?: {
    cArr: {
      value: string;
    }[];
  };
  // c4: {
  //   vArr: string[];
  // };
};

type Tcontrol = Trow[];

export type { Tcontrol as Tcontrol_sheetPDF, Tcontrol_info as Tcontrol_info_sheetPDF };

// =====================================================================
export default function SheetPDF({
  isShow,
  control,
  control_info,
  onCancel,
}: {
  isShow: boolean;
  control: Tcontrol;
  control_info: Tcontrol_info;
  onCancel: () => void;
}) {
  // ---------------------------------------------------------------------

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const dlPdf = async () => {
    if (!isShow || !refPdf.current[0]) {
      return;
    }

    showRootLoading(true, '正在處理PDF');

    const doc = new jsPDF('p', 'px', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    await fixTailwindImgDisplay(async () => {
      for (item of refPdf.current) {
        if (!item) {
          continue;
        }

        const image = await html2canvas(
          item
          // ,{
          //   useCORS: true,
          //   allowTaint: true,
          // }
        ).then((canvas) => {
          const image = canvas.toDataURL('image/JPEG');

          return image;
        });

        if (!isFirst) {
          doc.addPage();
        }

        isFirst = false;
        // 留作參考
        // doc.addImage(image, "JPEG", 0, 0, 595, 842);
        // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
        doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
      }
    });

    doc.save(`${control_info.projectName}-${control_info.projectNumber}.pdf`);
    showRootLoading(false);
  };

  // ---------------------------------------------------------------------
  return (
    <Modal
      //
      open={isShow}
      footer={null}
      closable={false}
      centered={true}
      destroyOnHidden={true}
      width={'auto'}
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.panelBar}>
        <MyButton_v2 label="下載PDF" onClick={dlPdf} />
      </div>
      <div
        ref={(ele) => {
          refPdf.current[0] = ele;
        }}
        className={scss.container}
      >
        <p className={scss.title}>送電備品料單</p>
        {/*  */}
        <div className={scss.infoBar}>
          <span>編號 : {control_info.projectNumber}</span>
          <span>工程名稱 : {control_info.projectName}</span>
          <span>日期 : {control_info.date}</span>
        </div>
        {/*  */}
        <div className={scss.table}>
          {/* thead */}
          <div className={classNames(scss.row, scss.thead)}>
            <div className={scss.cell}>
              <span>品名</span>
            </div>
            <div className={classNames(scss.cell, scss.type)}>
              <span>種類</span>
            </div>
            <div className={scss.cell}>
              <span>數量</span>
            </div>
            <div className={scss.cell}>
              <span>備料人員</span>
            </div>
          </div>
          {/* tbody */}

          {control.map((item, controlIndex) => {
            const { c1, c2, c3 } = item;
            const { cArr: c2Arr, masterC2, bigC2 } = c2;
            const { cArr: c3Arr } = c3 ?? {};

            return (
              <div className={classNames(scss.row)} key={controlIndex}>
                {/* C1 */}
                <div className={scss.cell}>
                  <span>{c1.value}</span>
                </div>
                {/* C2 */}

                {!masterC2 && c2Arr && <C2_normal c2Arr={c2Arr} />}
                {masterC2 && c2Arr && <C2_master c2Arr={c2Arr} masterC2={masterC2} />}
                {bigC2 && <C2_big bigC2={bigC2} />}

                {/* C3 */}
                <div className={classNames(scss.cellWrapper_1)}>
                  {c3Arr?.map((c3Item, c3ItemIndex) => {
                    return (
                      <div className={classNames(scss.cell)} key={c3ItemIndex}>
                        <span>{c3Item.value}</span>
                      </div>
                    );
                  })}
                </div>
                {/* C4 */}
                {/* 業主說這個欄位是給人填寫的 */}
                <div className={classNames(scss.cellWrapper_1)}>
                  {c3Arr?.map((c3Item, c3ItemIndex) => {
                    return (
                      <div className={classNames(scss.cell)} key={c3ItemIndex}>
                        <span></span>
                      </div>
                    );
                  })}
                </div>
                {/* close */}
              </div>
            );
          })}
        </div>
        {/* signature */}

        <div className={scss.signature}>
          <div>
            <span>領料 : {''}</span>
          </div>
          <div>
            <span>填表 : {''}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// =====================================================================

const C2_normal = ({
  c2Arr,
}: {
  // c2Arr: { value: string }[]
  c2Arr: Trow['c2']['cArr'];
}) => {
  return (
    <div className={classNames(classNames(scss.cellWrapper_1))}>
      {c2Arr?.map((c2Item, c2ItemIndex) => {
        return (
          <div className={classNames(scss.cell, scss.type)} key={c2ItemIndex}>
            <span>{c2Item.value}</span>
          </div>
        );
      })}
    </div>
  );
};

const C2_master = ({
  //
  c2Arr,
  masterC2,
}: {
  c2Arr: Trow['c2']['cArr'];
  masterC2: Trow['c2']['masterC2'];
}) => {
  return (
    <div className={classNames(classNames(scss.cellWrapper_1))}>
      <div className={scss.masterC2Wrapper_2}>
        <div className={classNames(scss.cell, scss.type)}>{masterC2?.value}</div>
        <div className={classNames(scss.cellWrapper_1)}>
          <C2_normal c2Arr={c2Arr} />
        </div>
      </div>
    </div>
  );
};

const C2_big = ({ bigC2 }: { bigC2: Trow['c2']['bigC2'] }) => {
  return (
    <div className={classNames(scss.cell, scss.bigC2)}>
      <span>{bigC2?.value}</span>
    </div>
  );
};
