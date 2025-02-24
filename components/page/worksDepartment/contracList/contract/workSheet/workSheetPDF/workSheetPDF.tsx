import React, { useState, useRef, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// component
import Miku_frontend_table01, { Tcontrol_table01 } from 'components/otherProject/miku-frontend/Table01';

// gear
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// antd
import Modal from 'antd/lib/modal/Modal';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// api
import { apiGetAssets } from 'js/api/api_product';

import scss from './workSheetPDF.module.scss';

// =====================================================================

type Tcontrol = {
  info: {
    contractNumber: string;
    projectName: string;
    projectAddress: string;
    customerName: string;
    contactPerson: string;
    // 開單日期
    billingDate: string;
    // 出貨日期
    shippingDate: string;
  };
  itemArr: Tcontrol_table01[];
};

export type { Tcontrol as Tcontrol_workSheetPDF_01 };

// =====================================================================
export default function WorkSheetPDF({
  isShow,
  onCancel,
  control,
}: {
  isShow: boolean;
  onCancel: () => void;
  control: Tcontrol;
}) {
  // ---------------------------------------------------------------------

  const itemArr = control.itemArr;

  const chunkedList = _.chunk(itemArr, 3);

  // ---------------------------------------------------------------------

  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const dlPdf = async () => {
    if (!isShow || !refPdf.current[0]) {
      return;
    }

    showRootLoading(true, '正在處理PDF');

    // const doc = new jsPDF('l', 'px', 'a4');
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'px',
      // format: 'a4',
      format: 'a3',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    for (item of refPdf.current) {
      if (!item) {
        continue;
      }

      const image = await html2canvas(
        item,
        {
          // scale: 5,
          scale: 3,
        }
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
      doc.addImage(image, 'png', 0, 0, pageWidth, pageHeight);
    }

    doc.save(`工作表${control.info.contractNumber}.pdf`);
    showRootLoading(false);
  };

  // ---------------------------------------------------------------------

  // const [svgList, setSvgList] = useState<{ [key: string]: string | undefined | null }>({});

  // const getSvg = async ({ fileName }: { fileName: string }) => {
  //   if (svgList[fileName] === null) {
  //     return;
  //   }

  //   if (svgList[fileName] === 'isLoading') {
  //     return;
  //   }

  //   if (!!svgList[fileName]) {
  //     return;
  //   }

  //   try {
  //     svgList[fileName] = 'isLoading';

  //     const svg = await apiGetAssets(fileName);

  //     if (svg) {
  //       setSvgList((list) => ({
  //         ...list,
  //         [fileName]: svg,
  //       }));
  //     }
  //   } catch (error) {
  //     setSvgList((list) => ({
  //       ...list,
  //       [fileName]: null,
  //     }));
  //   }
  // };

  // ---------------------------------------------------------------------
  return (
    <Modal
      //
      visible={isShow}
      footer={null}
      closable={false}
      centered={true}
      destroyOnClose={true}
      width={'auto'}
      wrapClassName={scss.antdModalWrapper}
      onCancel={onCancel}
    >
      <div className={scss.panelBar}>
        <MyButton_v2 label="下載PDF" onClick={dlPdf} />
      </div>

      {chunkedList.map((itemArr, index) => {
        return (
          <div key={index}>
            {index !== 0 && <hr className=" border-black" />}

            <div
              //
              ref={(ele) => (refPdf.current[index] = ele)}
              className={scss.container}
              id="report"
            >
              <div>
                <div className="text-2xl text-center pt-5 mb-1 relative">
                  <span>工作表</span>
                  <span className="absolute right-0">
                    {index + 1} / {chunkedList.length} 頁
                  </span>
                </div>

                <table className={classNames('w-full mb-1', scss.infoTable)}>
                  <tbody>
                    <tr>
                      <td>合約編號: {control.info.contractNumber}</td>
                      <td>客戶名稱: {control.info.customerName}</td>
                      <td>開單日期: {control.info.billingDate}</td>
                    </tr>
                    <tr>
                      <td>工程名稱: {control.info.projectName}</td>
                      <td>聯絡人: {control.info.contactPerson}</td>
                      <td>出貨日期: {control.info.shippingDate}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}>{`工程地點: ${control.info.projectAddress}`}</td>
                    </tr>
                  </tbody>
                </table>

                <div className={scss.itemGrid}>
                  {itemArr.map((control_item, index) => {
                    return (
                      <Fragment key={index}>
                        <Miku_frontend_table01 control={control_item} />
                      </Fragment>
                    );
                  })}
                </div>

                {/* <Pdf2 />
                <Pdf2 /> */}
              </div>
            </div>
          </div>
        );
      })}
    </Modal>
  );
}

// =====================================================================

const Pdf2 = () => {
  return (
    <div className={scss.table2}>
      {/* C1 */}
      <div className={classNames('col-start-1 col-span-2', scss.caption)}>
        <span>SJ-302</span>
      </div>

      <div className={classNames('col-start-1')}>
        <span>型號</span>
      </div>
      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-1')}>
        <span>數量</span>
      </div>
      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-1')}>
        <span>材質</span>
      </div>
      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-1')}>
        <span>表面</span>
      </div>
      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-1')}>
        <span>開閉方式</span>
      </div>
      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-1')}>
        <span>防颱勾</span>
      </div>
      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-1')}>
        <span>骨架</span>
      </div>

      <div className={classNames('col-start-2')}>
        <span>test</span>
      </div>

      {/* C2 */}
      <div className={classNames('col-start-3 col-span-2', scss.caption)}>
        <span>尺寸</span>
      </div>

      <div className={classNames('col-start-3')}>
        <span>全寬</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-3')}>
        <span>淨高</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-3')}>
        <span>W+G</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-3')}>
        <span>機械縫 A</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-3')}>
        <span>機械縫 C</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-3')}>
        <span>支板尺寸 B*D ()</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-3')}>
        <span>捲門全高 H</span>
      </div>
      <div className={classNames('col-start-4')}>
        <span>test</span>
      </div>
      {/* C3 */}
      <div className={classNames('col-start-5 col-span-2', scss.caption)}>
        <span>{'電動機(東元)'}</span>
      </div>

      <div className={classNames('col-start-5')}>
        <span>電供</span>
      </div>
      <div className={classNames('col-start-6')}>
        <span>test</span>
      </div>
      <div className={classNames('col-start-5')}>
        <span>馬力數</span>
      </div>
      <div className={classNames('col-start-6')}>
        <span>test</span>
      </div>

      <div className={classNames('col-start-5 col-span-2', scss.caption)}>
        <span>門軌</span>
      </div>

      <div className={classNames('col-start-5')}>
        <span>門軌形式</span>
      </div>
      <div className={classNames('col-start-6')}>
        <span>test</span>
      </div>

      <div className={classNames('col-start-5 col-span-2', scss.caption)}>
        <span>捲軸</span>
      </div>

      <div className={classNames('col-start-5')}>
        <span>捲軸尺寸</span>
      </div>
      <div className={classNames('col-start-6')}>
        <span>test</span>
      </div>

      <div className={classNames('col-start-5 col-span-2', scss.caption)}>
        <span>鏈齒輪</span>
      </div>

      <div className={classNames('col-start-5')}>
        <span>鏈齒輪番號</span>
      </div>
      <div className={classNames('col-start-6')}>
        <span>test</span>
      </div>

      {/* C7 */}
      <div className={classNames('col-start-7 col-span-6', scss.caption)}>
        <span>捲箱</span>
      </div>

      {keyArr_headBox_set.map((key, index) => {
        const { label } = config_headBox[key];

        const [className_label, className_value] = (() => {
          if (index >= keyArr_headBox_set.length / 2) {
            return ['col-start-9', 'col-start-10'];
          }

          return ['col-start-7', 'col-start-8'];
        })();

        return (
          <Fragment key={key}>
            <div className={classNames(className_label)}>
              <span>{label}</span>
            </div>
            <div className={classNames(className_value)}>
              <span>{'value'}</span>
            </div>
          </Fragment>
        );
      })}

      <div className={classNames('col-start-11 row-span-4')}>
        <span>{'圖'}</span>
      </div>
      <div className={classNames('col-start-11 row-span-4')}>
        <span>{'圖'}</span>
      </div>
      <div className={classNames('col-start-12 row-span-4')}>
        <span>{'圖'}</span>
      </div>
      <div className={classNames('col-start-12 row-span-4')}>
        <span>{'圖'}</span>
      </div>

      {/*  */}
    </div>
  );
};

// const keyArr_headBox = [
//   'isIntegratedHeadBox',
//   'upperMask',
//   'hasWheel',
//   'headBoxCover',
//   'headBoxTopCover',
//   'headBoxSizeO',
//   'headBoxSizeP',
//   'headBoxSizeQ',
//   'headBoxSizeX',
//   'headBoxSizeY',
//   'headBoxSizeM',
//   'headBoxSizeN',
// ] as const;

type TconfigItem = {
  label: string;
};

type TconfigKeys_headBox =
  | 'isIntegratedHeadBox'
  | 'upperMask'
  | 'hasWheel'
  | 'headBoxCover'
  | 'headBoxTopCover'
  | 'headBoxSizeO'
  | 'headBoxSizeP'
  | 'headBoxSizeQ'
  | 'headBoxSizeX'
  | 'headBoxSizeY'
  | 'headBoxSizeM'
  | 'headBoxSizeN'
  | 'boxB'
  | 'boxD';

const config_headBox: Record<TconfigKeys_headBox, TconfigItem> = {
  isIntegratedHeadBox: {
    label: '型式',
  },
  upperMask: {
    label: '上遮',
  },
  hasWheel: {
    label: '擋輪',
  },
  headBoxCover: {
    label: '前遮',
  },
  headBoxTopCover: {
    label: '上蓋',
  },
  headBoxSizeO: {
    label: 'sizeO',
  },
  headBoxSizeP: {
    label: 'sizeP',
  },
  headBoxSizeQ: {
    label: 'sizeQ',
  },
  headBoxSizeX: {
    label: 'sizeX',
  },
  headBoxSizeY: {
    label: 'sizeY',
  },
  headBoxSizeM: {
    label: 'sizeM',
  },
  headBoxSizeN: {
    label: 'sizeN',
  },
  boxB: {
    label: 'sizeB',
  },
  boxD: {
    label: 'sizeD',
  },
};

const keyArr_headBox_set = Array.from(
  new Set<TconfigKeys_headBox>([
    'isIntegratedHeadBox',
    'hasWheel',
    'upperMask',
    'boxB',
    'boxD',
    'headBoxSizeM',
    'headBoxSizeN',

    'headBoxCover',
    'headBoxTopCover',
    'headBoxSizeO',
    'headBoxSizeP',
    'headBoxSizeQ',
    'headBoxSizeX',
    'headBoxSizeY',
  ])
);
