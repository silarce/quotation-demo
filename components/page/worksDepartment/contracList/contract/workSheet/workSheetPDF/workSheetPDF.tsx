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

                {/* <div className={scss.itemGrid}>
                  {itemArr.map((control_item, index) => {
                    return (
                      <Fragment key={index}>
                        <Miku_frontend_table01 control={control_item} />
                      </Fragment>
                    );
                  })}
                </div> */}

                <Table_specialDoor />
                <Table_specialDoor />
              </div>
            </div>
          </div>
        );
      })}
    </Modal>
  );
}

// =====================================================================

const Table_specialDoor = () => {
  return (
    <div className={scss.table2}>
      {/* C1 */}
      <div className={classNames(scss.c1, scss.s2, scss.caption, scss.partRight)}>
        <span>SJ-302</span>
      </div>

      {keyArr_basic.map((key) => {
        return (
          <Fragment key={key}>
            <div className={classNames(scss.c1)}>
              <span>{config[key].label}</span>
            </div>
            <div className={classNames(scss.c2, scss.partRight)}>
              <span>value</span>
            </div>
          </Fragment>
        );
      })}

      {/* C2 */}
      <div className={classNames(scss.c3, scss.s2, scss.caption, scss.partRight)}>
        <span>尺寸</span>
      </div>

      {keyArr_size.map((key) => {
        return (
          <Fragment key={key}>
            <div className={classNames(scss.c3)}>
              <span>{config[key].label}</span>
            </div>
            <div className={classNames(scss.c4, scss.partRight)}>
              <span>value</span>
            </div>
          </Fragment>
        );
      })}

      {/* 填空 */}
      <div className={classNames(scss.c1, scss.s4, scss.partRight)} />

      {/* C3 */}
      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>{'電動機(東元)'}</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>電供</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>test</span>
      </div>
      <div className={classNames(scss.c5)}>
        <span>馬力數</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>test</span>
      </div>

      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>門軌</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>門軌形式</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>test</span>
      </div>

      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>捲軸</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>捲軸尺寸</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>test</span>
      </div>

      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>鏈齒輪</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>鏈齒輪番號</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>test</span>
      </div>

      {/* C7 */}
      <div className={classNames(scss.c7, scss.s6, scss.caption)}>
        <span>捲箱</span>
      </div>

      {keyArr_headBox.map((key, index) => {
        const { label } = config[key];

        const [className_label, className_value] = (() => {
          if (index >= keyArr_headBox.length / 2) {
            return [scss.c9, scss.c10];
          }

          return [scss.c7, scss.c8];
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

      {/* 填空 */}
      <div className={classNames(scss.c7, scss.s4)} />

      {/*  */}
      <div className={classNames(scss.c11, scss.r4)}>
        <span>{'圖'}</span>
      </div>
      <div className={classNames(scss.c11, scss.r4)}>
        <span>{'圖'}</span>
      </div>
      <div className={classNames(scss.c12, scss.r4)}>
        <span>{'圖'}</span>
      </div>
      <div className={classNames(scss.c12, scss.r4)}>
        <span>{'圖'}</span>
      </div>

      {/*  */}
    </div>
  );
};

interface Tprops {
  doorModelNamer: React.ReactNode;

  itemName: React.ReactNode;
  qty: React.ReactNode;
  materialName: React.ReactNode;
  materialSurface: React.ReactNode;
  closingType: React.ReactNode;
  isAntiTyphoon: React.ReactNode;
  skeleton: React.ReactNode;
  //
  fullWidth: React.ReactNode;
  height: React.ReactNode;
  WG: React.ReactNode;
  gapA: React.ReactNode;
  gapC: React.ReactNode;
  BD: React.ReactNode;
  fullHeight: React.ReactNode;
  //
  isIntegratedHeadBox: React.ReactNode;
  upperMask: React.ReactNode;
  hasWheel: React.ReactNode;
  headBoxCover: React.ReactNode;
  headBoxTopCover: React.ReactNode;
  headBoxSizeO: React.ReactNode;
  headBoxSizeP: React.ReactNode;
  headBoxSizeQ: React.ReactNode;
  headBoxSizeX: React.ReactNode;
  headBoxSizeY: React.ReactNode;
  headBoxSizeM: React.ReactNode;
  headBoxSizeN: React.ReactNode;
  boxB: React.ReactNode;
  boxD: React.ReactNode;
}

type TconfigKeys = keyof Pick<
  Tprops,
  | 'itemName'
  | 'qty'
  | 'materialName'
  | 'materialSurface'
  | 'closingType'
  | 'isAntiTyphoon'
  | 'skeleton'
  | 'fullWidth'
  | 'height'
  | 'WG'
  | 'gapA'
  | 'gapC'
  | 'BD'
  | 'fullHeight'
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
  | 'boxD'
>;

const keyArr_basic = Array.from(
  new Set<TconfigKeys>([
    'itemName',
    'qty',
    'materialName',
    'materialSurface',
    'closingType',
    'isAntiTyphoon',
    'skeleton',
  ])
);

const keyArr_size = Array.from(new Set<TconfigKeys>(['fullWidth', 'height', 'WG', 'gapA', 'gapC', 'BD', 'fullHeight']));

const keyArr_headBox = Array.from(
  new Set<TconfigKeys>([
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

type TconfigItem = {
  label: string;
};

const config: Record<TconfigKeys, TconfigItem> = {
  // 基本資料
  itemName: {
    label: '型號',
  },
  qty: {
    label: '數量',
  },
  materialName: {
    label: '材質',
  },
  materialSurface: {
    label: '表面',
  },
  closingType: {
    label: '開閉方式',
  },
  isAntiTyphoon: {
    label: '防颱勾',
  },
  skeleton: {
    label: '骨架',
  },
  // 尺寸

  fullWidth: {
    label: '全寬',
  },
  height: {
    label: '淨高',
  },
  WG: {
    label: 'W+G',
  },
  gapA: {
    label: '  機械縫 A',
  },
  gapC: {
    label: '機械縫 C',
  },
  BD: {
    label: '支板尺寸 B*D',
  },
  fullHeight: {
    label: '捲門全高 H',
  },

  // 捲箱
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
